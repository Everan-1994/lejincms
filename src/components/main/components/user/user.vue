<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator"/>
        乐进科技
      </Badge>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          <Icon type="ios-paper-plane-outline" />
          系统设置
        </DropdownItem>
        <DropdownItem name="message">
          <Icon type="ios-contact-outline" />
          个人中心
        </DropdownItem>
        <DropdownItem name="logout" class="logout">
          <Icon type="ios-log-out" /> 退出登录
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
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
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
  .logout {
    margin-top: 5px;
    border-top: 1px solid #e8eaec;
  }
</style>
