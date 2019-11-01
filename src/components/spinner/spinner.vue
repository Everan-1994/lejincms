<template>
  <transition name="fade">
    <div ref="lejin" class="lejin" v-if="show">
      <div :style="styles" class="spinner spinner--rotate-square-2">
        <div class="shadow" :style="shadowStyles"></div>
        <div class="square" :style="squareStyles"></div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'spinner',
    data() {
      return {
        show: Boolean,
        size: String,
        color: String,
        shadow: String
      }
    },
    computed: {
      styles () {
        return {
          width: this.size,
          height: this.size,
        }
      },
      squareStyles () {
        return {
          background: this.color
        }
      },
      shadowStyles () {
        return {
          background: this.shadow
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .lejin {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2019;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, .2);
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    * {
      line-height: 0;
      box-sizing: border-box;
    }

    .shadow {
      content: '';
      width: 100%;
      height: 20%;
      min-width: 5px;
      background: #000;
      opacity: 0.1;
      position: absolute;
      bottom: 0%;
      left: 0;
      border-radius: 50%;
      animation: rotate-square-2-shadow .5s linear infinite;
    }

    .square {
      content: '';
      width: 100%;
      height: 100%;
      background: #41b883;
      animation: rotate-square-2-animate .5s linear infinite;
      position: absolute;
      bottom: 40%;
      left: 0;
      border-radius: 3px;
    }
  }

  @keyframes rotate-square-2-animate {
    17% {
      border-bottom-right-radius: 3px;
    }
    25% {
      transform: translateY(20%) rotate(22.5deg);
    }
    50% {
      transform: translateY(40%) scale(1, .9) rotate(45deg);
      border-bottom-right-radius: 50%;
    }
    75% {
      transform: translateY(20%) rotate(67.5deg);
    }
    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes rotate-square-2-shadow {
    0%, 100% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.2, 1);
    }
  }
</style>
