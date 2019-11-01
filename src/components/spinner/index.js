import spinner from './spinner'

const Spinner = {
  install (Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }

    function spin (color, size, duration) {
      let VueSpinner = Vue.extend(spinner)
      let newSpinner = new VueSpinner({
        data: { // 初始值
          show: true,
          size: '40px',
          color: '#41b883',
          shadow: '#000'
        }
      })
      let vm = newSpinner.$mount()
      document.body.appendChild(vm.$el) // 把生成的 dom 插入 body 中

      // 设置了关闭
      if (duration >= 0) {
        setTimeout(() => {
          newSpinner.show = false
        }, duration * 1000)
      }

      return newSpinner
    }

    // 挂载到 vue 原型上
    Vue.prototype.$spinner = {
      show (duration, color, size) {
        return spin(color, size, duration)
      }
    }
  }
}

export default Spinner
