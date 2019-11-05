<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="后台登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :load="loading"></login-form>
          <p class="login-tip">欢迎使用乐进后台管理系统</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
    import LoginForm from '_c/login-form'
    import {mapActions} from 'vuex'

    export default {
        components: {
            LoginForm
        },
        data() {
            return {
                loading: false
            }
        },
        methods: {
            ...mapActions([
                'handleLogin',
                'getUserInfo'
            ]),
            handleSubmit({userName, password}) {
                this.loading = true
                this.handleLogin({userName, password}).then(res => {
                    if (res.code === 10000) {
                        setTimeout(() => {
                            this.loading = false
                                this.$router.push({
                                name: this.$config.homeName
                            })
                        }, 1500)
                    } else {
                        // 登录失败
                        setTimeout(() => {
                            this.loading = false
                            this.$Message.error(res.message || '系统错误')
                        }, 1000)
                    }
                }).catch(err => {
                    console.log(err)
                    setTimeout(() => {
                        this.loading = false
                        this.$Message.error('请求出错');
                    }, 1000)
                })
            }
        },
        created() {

            // setTimeout(() => {
            //   vm.show = false
            // }, 1500)
        }
    }
</script>
