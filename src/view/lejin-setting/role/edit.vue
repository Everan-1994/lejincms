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
                    permissions: []
                },
                rules: {
                    name: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'}
                    ],
                },
                permission: [],
                loading: true,
                stay: false,
                sub_load: false
            }
        },
        methods: {
            initPermission() {
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
            },
            handleGoBack() {
                this.$emit('onGoBack')
            },
            handleChange(newTargetKeys) {
                this.formData.permissions = newTargetKeys;
            },
            submitForm() {
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.sub_load = true
                        if (this.record === 'add') {
                            addRole(this.formData)
                                .then((resp) => {
                                    this.resp('添加成功', false)
                                })
                                .catch((err) => {
                                    this.$Message.error('添加失败，请刷新后重试');
                                    this.sub_load = false
                                    console.log('err', err)
                                })
                        } else {
                            editRole(this.formData)
                                .then((resp) => {
                                    this.resp('更新成功', false)
                                })
                                .catch((err) => {
                                    this.$Message.error('更新失败，请刷新后重试');
                                    this.sub_load = false
                                    console.log('err', err)
                                })
                        }
                    }
                })
            },
            resp(msg, bool) {
                this.$Message.success(msg);
                this.sub_load = bool
                if (this.stay) {
                    this.initPermission() // 初始化页面
                } else {
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
