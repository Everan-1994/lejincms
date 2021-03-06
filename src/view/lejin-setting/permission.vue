<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-lock"></Icon>
        权限管理
      </p>
      <div>
        <Row class="marginTop" style="margin-bottom: 10px">
          <Col span="4">
            <Button type="primary" ghost @click="permissionModal(false)" icon="md-add-circle">添加权限</Button>
          </Col>
          <Col span="20" style="margin-bottom: 15px;">
              <span style="">
                  <Input v-model="name" placeholder="权限名称" class="mleft" style="width: 200px"/>
                  <Button type="info" icon="ios-search" class="mleft" @click="query">查询</Button>
                  <Button type="default" icon="md-refresh" class="mleft" @click="resetQuery">重置查询</Button>
              </span>
          </Col>
        </Row>
        <Divider/>
        <le-jin-table
          :columns="columns"
          :data="data"
          :loading="loading"
          :showPage="showPage"
          @select-change="selectChange"
          @delete-data="deleteData"
        >
        </le-jin-table>
      </div>
    </Card>
    <Modal
      v-model="show"
      :title="modal_title"
      :mask-closable="false"
    >
      <Form ref="permissionForm" :model="formData" :rules="ruleValidate" :label-width="100" @submit.native.prevent>
        <FormItem label="权限名称" prop="name">
          <Input v-model="formData.name" placeholder="请输入权限名称" style="width: 95%;"></Input>
        </FormItem>
        <FormItem label="授予角色">
          <Select v-model="formData.role" multiple placeholder="授予角色 可多选" style="width: 95%;">
            <Option v-for="item in roles" :value="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="sub_load" @click="submitForm">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
    import LeJinTable from '@/components/lejin-table'
    import {getPermission, addPermission, editPermission, delPermission} from '@/api/permission'
    import {getRole} from '@/api/role'

    export default {
        name: "permission",
        components: {
            LeJinTable
        },
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '权限名称',
                        key: 'name'
                    },
                    {
                        title: '添加时间',
                        key: 'created_at',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            return h('span', [
                                params.row.created_at
                            ])
                        }
                    },
                    {
                        title: '操作',
                        width: 300,
                        align: 'center',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.permissionModal(true, params.row)
                                        }
                                    }
                                }, '编辑'),
                            ])
                        }
                    }
                ],
                ruleValidate: {
                    name: [
                        {required: true, message: '权限名称不能为空', trigger: 'blur'}
                    ],
                },
                data: [],
                loading: false,
                showPage: false,
                pageSize: 1000,
                selectArr: [], // 选择的数据 id 集合
                formData: {
                    name: '', // 权限名称
                    role: [] // 选中的角色
                },
                modal_title: '添加权限',
                add_or_edit: true, // 新增或编辑
                show: false, // modal
                sub_load: false, // 提交状态
                name: '', // 权限名称
                roles: [], // 角色集合
            }
        },
        created() {
            this.tableDataInit() // 获取权限列表
            this.roleDataInit() // 获取角色列表
        },
        methods: {
            tableDataInit() {
                this.loading = true
                getPermission({name: this.name})
                    .then((resp) => {
                        this.data = resp.data.data
                        this.loading = false
                    })
                    .catch((err) => {
                        this.loading = false
                        console.log('err', err)
                    })
            },
            roleDataInit() {
                getRole('')
                    .then((resp) => {
                        this.roles = resp.data.data
                    })
                    .catch((err) => {
                        console.log('role_err', err)
                    })
            },
            permissionModal(bool, row) {
                this.show = true
                this.add_or_edit = true
                if (bool) {
                    this.modal_title = '编辑权限'
                    this.add_or_edit = false

                    const roles = []
                    row.roles.forEach((item) => {
                        roles.push(item.name)
                    })

                    this.formData = {
                        id: row.id,
                        name: row.name,
                        role: roles,
                        old_role: roles
                    }
                }
            },
            submitForm() {
                this.$refs.permissionForm.validate((valid) => {
                    if (valid) {
                        this.sub_load = true
                        if (this.add_or_edit) {
                            addPermission(this.formData)
                                .then((resp) => {
                                    this.$Message.success('添加成功');
                                    this.sub_load = this.show = false
                                    setTimeout(this.tableDataInit(), 1000) // 更新列表
                                })
                                .catch((err) => {
                                    this.sub_load = false
                                })
                        } else {
                            editPermission(this.formData)
                                .then((resp) => {
                                    this.$Message.success('更新成功');
                                    this.sub_load = this.show = false
                                    setTimeout(this.tableDataInit(), 1000) // 更新列表
                                })
                                .catch((err) => {
                                    this.sub_load = false
                                })
                        }
                    }
                })
            },
            query() {
                this.tableDataInit()
            },
            resetQuery() {
                this.name = ''
                this.tableDataInit()
            },
            selectChange(arr) {
                this.selectArr = arr
            },
            deleteData() {
                const _this = this
                this.$Modal.confirm({
                    title: '温馨提示',
                    content: '确定要执行删除动作吗？',
                    loading: true,
                    onOk: () => {
                        const ids = {}
                        ids.ids = _this.selectArr
                        delPermission(ids).then(function (res) {
                            _this.data = _this.data.filter(item => !_this.selectArr.some(ele => ele === item.id))
                            setTimeout(() => {
                                _this.$Modal.remove();
                                _this.$Message.success('删除成功')
                            }, 1000)
                        }).catch(function (err) {
                            console.log(err)
                        })
                    }
                })
            }
        },
        watch: {
            show() {
                if (!this.show) {
                    this.$refs.permissionForm.resetFields();
                    this.formData = { name: '',  role: [] }
                }
            }
        }
    }
</script>

<style scoped>
  .mleft {
    margin-left: 5px;
  }
</style>
