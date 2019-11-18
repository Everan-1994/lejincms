<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="md-contacts"/>
        管理员列表
      </p>
      <div>
        <Row class="marginTop" style="margin-bottom: 10px">
          <Col span="4">
            <Button type="primary" @click="adminUserModal(false)" icon="md-add-circle">添加管理员</Button>
          </Col>
          <Col span="20" style="margin-bottom: 15px;">
              <span style="">
                  <Input v-model="search.name" placeholder="名称" class="mleft" style="width: 150px"/>
                  <Input v-model="search.username" placeholder="账号" class="mleft" style="width: 150px"/>
                  <Select v-model="search.status" placeholder="账号状态" class="mleft" style="width:100px">
                      <Option value="1">正常</Option>
                      <Option value="0">冻结</Option>
                  </Select>
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
      <Form ref="adminUserForm"
            :model="formData"
            :rules="ruleValidate"
            :hide-required-mark="true"
            :label-width="100"
            :label-colon="true"
            @submit.native.prevent>
        <FormItem label="头像" prop="avatar">
          <Upload type="drag"
                  name="file"
                  :action="upload_url"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleFormatError"
                  :max-size="2048"
                  :on-exceeded-size="handleMaxSize"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :headers="headers"
                  style="width: 160px; height: 160px; margin-left: 63px;">
            <img v-if="formData.full_url" :src="formData.full_url" alt="头像"
                 style="width: 100%; height: 100%; overflow: hidden; border: none;"
                 ref="avatar">
            <div v-else style="padding: 35px 0">
              <Icon type="md-images" size="52" style="color: #3399ff"/>
              <p>{{ uploading ? '上传中...' : '上传头像' }}</p>
            </div>
            <Input v-model="formData.avatar" type="text" style="display: none;"></Input>
          </Upload>
          <Spin fix v-if="uploading" style="width: 160px; height: 160px; margin-left: 63px;"></Spin>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="formData.name" placeholder="请输入管理员名称" style="width: 95%;"></Input>
        </FormItem>
        <FormItem label="账号" prop="username">
          <Input v-model="formData.username" placeholder="请输入登录账号" style="width: 95%;"></Input>
        </FormItem>
        <FormItem label="密码" v-bind:prop="add_or_edit ? 'password': ''">
          <Input v-model="formData.password" placeholder="请输入初始密码" style="width: 95%;">
            <Button slot="append" icon="ios-repeat" @click="randPwd">随机生成</Button>
          </Input>
        </FormItem>
        <FormItem label="授予角色">
          <Select v-model="formData.role" placeholder="请选择角色" style="width: 95%;">
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
    import {getAdminUser, addAdminUser, editAdminUser, delAdminUser, updateStatus} from '@/api/user'
    import {getRole} from '@/api/role'
    import {getValue} from '@/libs/util'
    import config from '@/config'

    const {baseUrl} = config

    export default {
        name: "admin_user",
        components: {
            LeJinTable
        },
        data() {
            return {
                upload_url: baseUrl.dev + '/upload',
                headers: {
                    'Authorization': getValue('token')
                },
                uploading: false,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        key: 'avatar',
                        title: '用户',
                        render: (h, params) => {
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        src: params.row.full_url
                                    }
                                }),
                                h('span', {
                                    style: 'margin-left: 10px;'
                                }, params.row.name)
                            ])
                        }
                    },
                    {
                        title: '账号',
                        key: 'username'
                    },
                    {
                        title: '角色',
                        key: 'role',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: params.row.roles.length > 0
                                        ? this.color[Math.floor((Math.random() * this.color.length))]
                                        : 'default'
                                }
                            }, params.row.roles.length > 0 ? params.row.roles[0].name : '未分配')
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('i-switch', {
                                props: {
                                    size: 'large',
                                    value: params.row.status,
                                    'true-value': 1,
                                    'false-value': 0,
                                    'true-color': '#13ce66',
                                    'false-color': '#ff4949',
                                    'loading': params.row.loading || false,
                                    'before-change': () => this.switchBeforeChange(params.row)
                                },
                                scopedSlots: {
                                    open: () => h('span', '正常'),
                                    close: () => h('span', '禁用')
                                },
                                on: {
                                    'on-change': (value) => {
                                        this.changeStatus(params.row.id, value, params);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.created_at)
                        }
                    },
                    {
                        title: '操作',
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
                                            this.adminUserModal(true, params.row)
                                        }
                                    }
                                }, '编辑'),
                            ])
                        }
                    }
                ],
                ruleValidate: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'change'}
                    ],
                    avatar: [
                        {required: true, message: '请上头像', trigger: 'blur'}
                    ],
                },
                data: [],
                loading: false,
                showPage: false,
                total: 0,
                page: 1,
                pageSize: 10,
                pageSizeOpts: [10, 20, 30, 50, 100],
                selectArr: [], // 选择的数据 id 集合
                formData: {
                    name: '', // 昵称
                    username: '', // 账号
                    password: '', // 密码
                    role: '', // 单角色
                    status: 1, // 状态
                    avatar: '', // 头像
                    full_url: ''
                },
                color: ['primary', 'success', 'warning', 'error'],
                modal_title: '添加管理员',
                add_or_edit: true, // 新增或编辑
                show: false, // modal
                sub_load: false, // 提交状态
                search: {
                    name: '',
                    username: '',
                    status: ''
                },
                roles: [], // 角色集合
            }
        },
        created() {
            this.tableDataInit() // 获取管理员列表
            this.roleDataInit() // 获取角色列表
        },
        methods: {
            tableDataInit() {
                this.loading = true
                getAdminUser(this.search)
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
            adminUserModal(bool, row) {
                this.show = true
                this.add_or_edit = true
                if (bool) {
                    this.modal_title = '编辑管理员'
                    this.add_or_edit = false

                    this.formData = {
                        id: row.id,
                        name: row.name, // 昵称
                        username: row.username, // 账号
                        password: row.password, // 密码
                        role: row.roles[0].name, // 单角色
                        avatar: row.avatar, // 头像
                        full_url: row.full_url, // 头像完整 url
                    }
                }
            },
            submitForm() {
                this.$refs.adminUserForm.validate((valid) => {
                    if (valid) {
                        this.sub_load = true
                        if (this.add_or_edit) {
                            addAdminUser(this.formData)
                                .then((resp) => {
                                    this.$Message.success('添加成功');
                                    this.sub_load = this.show = false
                                    setTimeout(this.tableDataInit(), 1000) // 更新列表
                                })
                                .catch((err) => {
                                    this.sub_load = false
                                })
                        } else {
                            editAdminUser(this.formData)
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
            changeStatus(id, status, params) {
                this.$set(params.row, 'loading', true)
                updateStatus({id, status})
                    .then((resp) => {
                        this.$set(params.row, 'loading', false)
                        this.$Message.success('状态更新成功');
                    })
                    .catch((err) => {
                        this.$set(params.row, 'loading', false)
                        this.data = []
                        this.tableDataInit()
                        this.$Message.error('状态更新失败');
                    })
            },
            switchBeforeChange(row) {
                let msg = row.status === 1 ? `冻结` : `启用`
                return new Promise((resolve) => {
                    this.$Modal.confirm({
                        title: '系统提示',
                        content: `您确认要 ${msg} ${row.name} 的用户吗？`,
                        onOk: () => {
                            resolve();
                        }
                    });
                });
            },
            query() {
                this.tableDataInit()
            },
            resetQuery() {
                this.search = {
                    name: '',
                    username: '',
                    status: ''
                }
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
                        delAdminUser(ids).then(function (res) {
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
            },
            handleError(error, file) {
                this.uploading = false
                this.$Notice.error({
                    title: '上传失败',
                    desc: '系统错误。'
                })
            },
            handleSuccess(res, file) {
                this.uploading = false
                if (res.code === 10000) {
                    this.formData.full_url = res.data.urls[0]
                    this.formData.avatar = res.data.paths[0]
                    this.$Notice.success({
                        title: '温馨提示',
                        desc: '图片： ' + file.name + ' 上传成功。'
                    })
                } else {
                    this.$Notice.error({
                        title: '温馨提示',
                        desc: '图片： ' + file.name + ' 上传失败。'
                    })
                }
            },
            handleFormatError(file) {
                this.uploading = false
                this.$Notice.warning({
                    title: '温馨提示',
                    desc: '文件： ' + file.name + ' 格式不正确，请上传 jpg , png 或 jpeg 格式的图片。'
                }, 1.5)
            },
            handleMaxSize(file) {
                this.uploading = false
                this.$Notice.warning({
                    title: '温馨提示',
                    desc: '图片： ' + file.name + ' 太大，不能超过 2M。'
                }, 1.5)
            },
            beforeUpload() {
                this.uploading = true
            },
            randPwd() {
                const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                const maxPos = chars.length;
                var pwd = '';
                for (let i = 0; i < 8; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                this.formData.password = pwd
            }
        },
        watch: {
            show() {
                if (!this.show) {
                    this.$refs.adminUserForm.resetFields()
                    this.formData = {
                        name: '', // 昵称
                        username: '', // 账号
                        password: '', // 密码
                        role: '', // 单角色
                        status: 1, // 状态
                        avatar: '', // 头像
                        full_url: ''
                    }
                }
            },
        }
    }
</script>

<style>
  .mleft {
    margin-left: 5px;
  }

  .ivu-upload-drag {
    height: 100% !important;
    border-radius: 50% !important;
  }
</style>
