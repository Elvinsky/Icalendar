<template>
  <div class="loader-wrapper">
    <div class="lds-hourglass"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
  .lds-hourglass {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    &::after {
      content: ' ';
      display: block;
      border-radius: 50%;
      width: 0;
      height: 0;
      margin: 8px;
      box-sizing: border-box;
      border: 32px solid #ff0000;
      border-color: #ff0000 transparent #ff0000 transparent;
      animation: lds-hourglass 1.2s infinite;
    }
    @keyframes lds-hourglass {
      0% {
        transform: rotate(0);
        animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }
      50% {
        transform: rotate(900deg);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }
      100% {
        transform: rotate(1800deg);
      }
    }
  }
</style>
