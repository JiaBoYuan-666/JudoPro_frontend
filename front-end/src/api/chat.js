import OpenAI from "openai";

const deepseekOpenAI = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-bb7152657f8c4994b8dec6dff88d6460',
  dangerouslyAllowBrowser: true
});

const openrouterOpenAI = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": "https://judopro.com",
    "X-Title": "JudoPro"
  }
});

const formatMessages = (messages, isReasoner) => {
  const recentMessages = messages.slice(-10);
  
  // R1 模型需要强制交替消息
  if (isReasoner) {
    const filtered = [];
    let lastRole = null;
    
    for (const msg of recentMessages) {
      // 跳过连续相同角色的消息
      if (msg.role === lastRole) continue;
      
      // 处理助手消息
      if (msg.role === 'assistant') {
        filtered.push({
          ...msg,
          content: `[续写]${msg.content}`
        });
      } else {
        filtered.push(msg);
      }
      
      lastRole = msg.role;
    }
    
    // 确保最后一条是用户消息
    while (filtered.length > 0 && filtered[filtered.length-1].role !== 'user') {
      filtered.pop();
    }
    
    return filtered;
  }
  
  return recentMessages;
};
export const getLargeModelAPI = async (
  messages,
  model = "deepseek-chat",
  temperature = 1.0
) => {
  try {
    const isOpenRouter = model.startsWith('openai/');
    const isReasoner = model === 'deepseek-reasoner';
    
    // 构造符合要求的消息数组
    const formattedMessages = [
      {
        role: "system",
        content: ""
      },
      ...formatMessages(messages, isReasoner).map(msg => ({
        role: msg.role,
        content: isReasoner && msg.role === 'assistant' 
          ? `[续写]${msg.content}` 
          : msg.content
      }))
    ];

    // 添加调试日志
    console.log('API Request Payload:', {
      model,
      messages: formattedMessages,
      temperature
    });

    const client = isOpenRouter ? openrouterOpenAI : deepseekOpenAI;
    const stream = await client.chat.completions.create({
      messages: formattedMessages,
      model: isOpenRouter ? model : model,
      max_tokens: 1200,
      temperature,
      frequency_penalty: 0.5,
      stream: true
    });

    return (async function* () {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        yield { content };
      }
    })();
  } catch (error) {
    console.error("流式API错误:", error);
    let errorMessage = "请求失败，请稍后重试";
    if (error.response?.status === 429) errorMessage = "请求过于频繁";
    else if (error.response?.status >= 500) errorMessage = "服务器繁忙";
    
    return (async function* () {
      yield { content: `\n[错误：${errorMessage}]` };
    })();
  }
};