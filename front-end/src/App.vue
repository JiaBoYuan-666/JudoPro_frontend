<script setup></script>

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
div {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.box {
  width: 50%;
  height: 600px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  //背景透明度
  background: linear-gradient(to right, rgba(222, 161, 161, 0.8), rgba(152, 206, 227, 0.8));
}
.pre-box {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  background-color: rgb(243, 209, 209);
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  transition: 0.5s ease-in-out;
}
.pre-box h1 {
  color: white;
  text-align: center;
  margin-top: 150px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

.img-box {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
}
.img-box img {
  width: 100%;
  height: 100%;
}
</style>
