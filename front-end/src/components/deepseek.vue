<!-- deepseek.vue -->
<template>
     <div class="container">
    <div class="control-bar">
      <div style="color: black;">控制台</div>
      <div class="temperature-control">
        <span class="label">创造力：{{ temperature.toFixed(1) }}</span>
        <Slider 
  v-model="temperature"
  @change="value => temperature = value"
  :min="0"
  :max="1.5"
  :step="0.1"

  :disabled="isSending" 
  class="slider"
/>
      </div>
      
      <Button
        class="model-switch"
        @click="toggleModel"
        type="primary"
        theme="solid"
        :disabled="isSending"
      >
        {{ modelVersion === 'deepseek-chat' ? 'V3 模型' : 'R1 模型' }}
      </Button>
  
    </div>

    <Chat
      :key="align + mode"
      :align="align"
      :mode="mode"
      :style="commonOuterStyle"
      :chats="message"
      :role-config="roleInfo"
      @chats-change="onChatsChange"
      @message-send="onMessageSend"
      @message-reset="onMessageReset"
      class="chat"
    />
    
    <Spin
      v-show="loadingStatus"
      tip="loading"
      size="large"
      class="loading"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Chat, Spin, Button, Slider,Toast } from "@kousum/semi-ui-vue";
import { getLargeModelAPI } from "@/api/chat";

const temperature = ref(1.0);
const modelVersion = ref("deepseek-chat");
const loadingStatus = ref(false);
const currentAssistantMessage = ref(null);
const isSending = ref(false);
const toggleModel = () => {
  if (isSending.value) {
    Toast.warning({
      content: '请等待当前对话完成后切换模型',
      duration: 3
    });
    return;
  }
  modelVersion.value = modelVersion.value === 'deepseek-chat' 
    ? 'deepseek-reasoner' 
    : 'deepseek-chat';
};



const defaultMessage = [
  {
    role: "system",
    id: "1",
    createAt: new Date(),
    content: "我是JudoPro小助手，你可以问我任何问题！",
  },
];

const AVATAR_PATH = "/src/assets/学校logo4.png";

const roleInfo = {
  user: {
    name: "用户",
    avatar: AVATAR_PATH,
  },
  assistant: {
    name: "AI小助手",
    avatar: AVATAR_PATH,
  },
  system: {
    name: "AI小助手",
    avatar: AVATAR_PATH,
  },
};

const commonOuterStyle = {
  border: "1px solid var(--semi-color-border)",
  borderRadius: "16px",
  margin: "8px 16px",
  height: 550,
};

let id = 0;
const getId = () => `id-${id++}`;

const message = ref([...defaultMessage]);
const mode = ref("bubble");
const align = ref("leftRight");


const getValidMessages = () => {
  return message.value.filter(m => 
    m.role === "user" || 
    m.role === "assistant"
  ).map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};
const onMessageSend = async (content) => {
  try {
    isSending.value = true; 
    loadingStatus.value = true;

    // 仅添加用户消息
    const userMessage = {
      role: "user",
      id: getId(),
      createAt: Date.now(),
      content: content,
    };
    message.value.push(userMessage);

    // 创建临时助手消息（先不加入历史）
    currentAssistantMessage.value = {
      role: "assistant",
      id: getId(),
      createAt: Date.now(),
      content: "",
      streaming: true,
    };

    const contextMessages = getValidMessages();


    const systemPrompt = {
      role: "system",
      content: "你在柔道运动领域，训练效果直接关系到运动员的竞技水平与赛事成绩。JudoPro 智训平台旨在填补国内柔道训练智能化的空白，通过智能算法生成个性化训练建议，提升运动员的训练效率和竞技水平。作为JudoPro小助手，你要回答用户关于柔道、体育相关的问题，热情一点,说中文"
    };
    
    // 调用API
    const stream = await getLargeModelAPI(
      [systemPrompt, ...contextMessages],
      modelVersion.value,
      temperature.value
    );

    // 将助手消息加入历史并开始流式更新
    message.value.push(currentAssistantMessage.value);

    for await (const chunk of stream) {
      if (chunk.content) {
        currentAssistantMessage.value.content += chunk.content;
        message.value = [...message.value];
      }
    }
  } catch (error) {
    isSending.value = false;
    console.error("流式请求失败:", error);
    if (currentAssistantMessage.value) {
      currentAssistantMessage.value.content += "\n[流式传输中断]";
      message.value = [...message.value];
    }
  } finally {
    if (currentAssistantMessage.value) {
      currentAssistantMessage.value.streaming = false;
      message.value = [...message.value];
    }
    loadingStatus.value = false;
  }
};

const onMessageReset = async () => {
  try {
    loadingStatus.value = true;
    isSending.value = true;
    // 移除最后一条助手消息
    const lastMessage = message.value[message.value.length - 1];
    if (lastMessage.role === "assistant") {
      message.value.pop();
    }

    // 创建新助手消息
    currentAssistantMessage.value = {
      role: "assistant",
      id: getId(),
      createAt: Date.now(),
      content: "",
      streaming: true,
    };
    message.value.push(currentAssistantMessage.value);

    // 获取完整上下文
    const contextMessages = getValidMessages();

    // 添加柔道领域提示词
    const systemPrompt = {
      role: "system",
      content: "你在柔道运动领域，训练效果直接关系到运动员的竞技水平与赛事成绩。JudoPro 智训平台旨在填补国内柔道训练智能化的空白，通过智能算法生成个性化训练建议，提升运动员的训练效率和竞技水平。作为JudoPro小助手，你要回答用户关于柔道、体育相关的问题，热情一点"
    };
    
    const stream = await getLargeModelAPI(
      [systemPrompt, ...contextMessages],
      modelVersion.value,
      temperature.value
    );

    for await (const chunk of stream) {
      if (chunk.content) {
        currentAssistantMessage.value.content += chunk.content;
        message.value = [...message.value];
      }
    }
  } catch (error) {
    console.error("重置失败:", error);
    currentAssistantMessage.value.content += "\n[流式传输中断]";
    message.value = [...message.value];
  } finally {
    isSending.value = false;
    currentAssistantMessage.value.streaming = false;
    message.value = [...message.value];
    loadingStatus.value = false;
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .control-bar {
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 16px;


    .temperature-control {
      flex: 1;
      max-width: 300px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.9);
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .label {
        flex-shrink: 0;
        font-size: 14px;
        color: var(--semi-color-text-1);
      }

      .slider {
        flex: 1;
        min-width: 180px;
      }
    }
    :deep(.semi-slider-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  
  .semi-slider-track {
    background-color: var(--semi-color-disabled-bg) !important;
  }
  
  .semi-slider-handle {
    border-color: var(--semi-color-disabled-border) !important;
  }
}
    .model-switch[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  &:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}

  }

  .chat {
    flex: 1;
    min-height: 0; // 修复flex布局溢出问题
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    :deep(.semi-chat-item-content) {
      &[data-streaming="true"] {
        background: rgba(245, 245, 245, 0.8);
        border-radius: 8px;
        position: relative;
        
        &::after {
          content: "⏳";
          position: absolute;
          right: 10px;
          bottom: 5px;
          font-size: 12px;
          opacity: 0.6;
        }
      }
    }
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

@keyframes cursor-blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.streaming-cursor::after {
  content: "|";
  animation: cursor-blink 1s infinite;
  color: #666;
  margin-left: 2px;
}
</style>