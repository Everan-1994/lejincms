<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <span @click="refreshPage" class="i-layout-header-trigger i-layout-header-trigger-min">
      <Icon type="ios-refresh-circle-outline" />
    </span>
    <custom-bread-crumb show-icon :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    },
    refreshPage () {
      this.$emit('refres-content', false)
    }
  }
}
</script>
<style>
  .i-layout-header-trigger-min {
    padding: 0 5px;
  }
  .i-layout-header-trigger-min:hover {
    background: #f8f8f9;
  }
  .i-layout-header-trigger {
    display: inline-block;
    width: 45px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all .2s ease-in-out;
    vertical-align: top;
  }
</style>
