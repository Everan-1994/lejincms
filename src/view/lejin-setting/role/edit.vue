<template>
  <div>
    <Form ref="formData" :model="formData" :rules="rules" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" placeholder="请输入角色名称" style="width: 423px;"></Input>
      </FormItem>
      <FormItem label="权限">
        <Transfer
          :list-style="style"
          :titles="titles"
          :data="permission"
          :target-keys="formData.permissions"
          filterable
          @on-change="handleChange">
        </Transfer>
      </FormItem>
      <FormItem label="栏目">
        <Button @click="exchangeTree">
          <Icon type="md-add" v-if="!flag"/>
          <Icon type="md-remove" v-else/>
          {{ !flag ? '展开栏目' : '折叠栏目' }}
        </Button>
        <Tree
          ref="tree"
          :data="menu"
          show-checkbox
          @on-toggle-expand="toggleExpand"
        ></Tree>
      </FormItem>
      <FormItem style="margin-top: 5%;">
        <Button type="primary" @click="submitForm()" icon="md-checkbox-outline" :loading="sub_load">提 交</Button>
        <Button type="dashed" @click="handleGoBack()" style="margin-left: 20px;" icon="md-paper-plane">返 回</Button>
        <Checkbox style="margin-left: 20px;" v-model="stay">留在当前页</Checkbox>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>

<script>
    import {getPermission} from '@/api/permission'
    import {getMenus} from '@/api/menu'
    import {addRole, editRole} from "@/api/role";

    export default {
        name: "edit",
        props: {
            record: {
                type: [Object, String],
                default: 'add'
            }
        },
        data() {
            return {
                titles: ['权限列表', '已授权列表'],
                style: {
                    height: '350px',
                    marginTop: '10px'
                },
                formData: {
                    name: '',
                    menus: [],
                    permissions: []
                },
                rules: {
                    name: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'}
                    ],
                },
                menu: [],
                permission: [],
                loading: true,
                stay: false,
                sub_load: false,
                flag: true, // 切换展开与闭合
            }
        },
        methods: {
            initPermission() {
                // 权限
                getPermission()
                    .then((resp) => {
                        const data = resp.data.data
                        data.forEach((item) => {
                            this.permission.push({
                                key: item.id,
                                label: item.name
                            })
                        })

                        if (this.record !== 'add') {
                            this.formData.id = this.record.id
                            this.formData.name = this.record.name
                            this.record.permissions.forEach((item) => {
                                this.formData.permissions.push(item.id)
                            })
                        }
                        this.loading = false
                    })
                    .catch((err) => {
                        console.log('err', err)
                    })
                // 栏目
                getMenus()
                    .then((resp) => {
                        if (this.record !== 'add') {
                            let ids = []
                            let pids = []
                            this.record.menus.forEach((item) => {
                                ids.push(item.id)
                                pids.push(item.pid)
                            })

                            for (let item of new Set(ids)) {
                                if (!new Set(pids).has(item)) {
                                    this.formData.menus.push(item) // 只要子节点
                                }
                            }

                            this.menu = this.menuInit(resp.data.data, this.formData.menus)
                        } else {
                            this.menu = this.menuInit(resp.data.data)
                        }

                        this.loading = false
                    })
                    .catch((err) => {
                        console.log('err', err)
                    })
            },
            handleGoBack() {
                this.$emit('onGoBack')
            },
            handleChange(newTargetKeys) {
                this.formData.permissions = newTargetKeys;
            },
            submitForm() {
                const nodes = this.$refs.tree.getCheckedAndIndeterminateNodes() // 勾选和半勾选的节点数组
                this.formData.menus = []
                nodes.forEach(item => {
                    this.formData.menus.push(item.id)
                })

                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.sub_load = true
                        if (this.record === 'add') {
                            addRole(this.formData)
                                .then((resp) => {
                                    this.resp('添加成功', false)
                                })
                                .catch((err) => {
                                    this.sub_load = false
                                    console.log('err', err)
                                })
                        } else {
                            editRole(this.formData)
                                .then((resp) => {
                                    this.resp('更新成功', false)
                                })
                                .catch((err) => {
                                    this.sub_load = false
                                    console.log('err', err)
                                })
                        }
                    }
                })
            },
            menuInit(data, menus = []) {
                return data.map(item => {
                    const memu = {
                        expand: true,
                        id: item.id,
                        name: item.name,
                        title: item.meta.title,
                        checked: menus.includes(item.id), // 选中
                    }
                    // 是否有子菜单，并递归处理
                    if (item.children && item.children.length > 0) {
                        // Recursion
                        memu.children = this.menuInit(item.children, menus)
                    }
                    return memu
                })
            },
            exchangeTree() {
                this.flag = !this.flag
                this.menu = this.treeChangeExpand(this.menu, this.flag);
            },
            // 递归给树设置expand
            treeChangeExpand(treeData, flag) {
                let _this = this;
                for (let i = 0; treeData && i < treeData.length; i++) {
                    treeData[i].expand = flag
                    if (treeData[i].children) {
                        treeData[i].children = _this.treeChangeExpand(treeData[i].children, flag)
                    }
                }
                return treeData;
            },
            toggleExpand() {
                let t = 0 // 展开计数
                let f = 0 // 折叠计数
                this.menu.forEach(item => {
                    if (item.expand) {
                        t++
                    } else {
                        f++
                    }
                })
                if (this.menu.length === t) {
                    this.flag = true // 全部展开
                }
                if (this.menu.length === f) {
                    this.flag = false // 全部折叠
                }
            },
            resp(msg, bool) {
                this.$Message.success(msg);
                this.sub_load = bool
                if (!this.stay) {
                    this.handleGoBack() // 跳转角色列表页
                }
            }
        },
        created() {
            this.$nextTick(() => {
                this.initPermission()
            })
        },
    }
</script>

<style>
  .ivu-transfer-list-header {
    z-index: 1;
  }
</style>
