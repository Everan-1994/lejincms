<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick"  @on-visible-change="down = !down">
      <Avatar :src="userAvatar"/>
      {{ userName }}
      <Icon type="md-arrow-dropdown" v-if="down"/>
      <Icon type="md-arrow-dropup" v-else/>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          <Icon type="ios-contact-outline" size="16" />
          <span style="margin-left: 3px;">个人中心</span>
        </DropdownItem>
        <DropdownItem name="message">
          <Icon type="ios-settings-outline" size="16" />
          <span style="margin-left: 3px;">设置</span>
        </DropdownItem>
        <DropdownItem name="logout" divided>
          <Icon type="md-power" size="16" />
          <span style="margin-left: 3px;">退出登录</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userName: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      down: true
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
        this.$Modal.confirm({
            title: '系统提示',
            content: '<p>确定要退出吗？</p>',
            loading: true,
            onOk: () => {
                this.handleLogOut().then(res => {
                    this.$Modal.remove();
                    this.$router.push({
                        name: 'login'
                    })
                }).catch(err => {
                    this.$Modal.remove();
                    this.$router.push({
                        name: 'login'
                    })
                })
            }
        });
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>

<style>
  .user-avator-dropdown {
    width: auto;
    padding: 0 12px;
  }
  .user-avator-dropdown:hover {
    background: #f8f8f9;
  }
  .ivu-dropdown-item {
    margin: 5px 0 !important;
  }
</style>
