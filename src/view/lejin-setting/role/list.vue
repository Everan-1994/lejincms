<template>
  <div>
    <Row class="marginTop" style="margin-bottom: 10px">
      <Col span="4">
        <Button type="primary" ghost @click="handleEdit('add')" icon="md-add-circle">添加角色</Button>
      </Col>
      <Col span="20" style="margin-bottom: 15px;">
              <span style="">
                  <Input v-model="name" placeholder="角色名称" class="mleft" style="width: 200px"/>
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
      @change-page="changePage"
      @change-page-size="changePageSize"
    >
    </le-jin-table>
    <Modal v-model="showModal" :mask-closable="false" :closable="false">
      <div v-if="showType === 'menu'">
        <Divider orientation="left"><Tag type="dot" color="primary">{{ menu_info.name }}</Tag> 角色拥有的栏目</Divider>
        <div v-if="menu_info.menu.length > 0">
          <Tag type="border"
               :color="color[Math.floor((Math.random() * color.length))]"
               v-for="m in menu_info.menu"
               :key="m.id"
          >
            {{ m.title }}
          </Tag>
        </div>
        <div v-else style="text-align: center;"><Tag type="border">暂未分配栏目</Tag></div>
      </div>
      <div v-else>
        <Divider orientation="left"><Tag type="dot" color="primary">{{ permission_info.name }}</Tag> 角色拥有的权限</Divider>
        <div v-if="permission_info.permission.length > 0">
          <Tag type="border"
               :color="color[Math.floor((Math.random() * color.length))]"
               v-for="p in permission_info.permission"
               :key="p.id"
          >
            {{ p.name }}
          </Tag>
        </div>
        <div v-else style="text-align: center;"><Tag type="border">暂未分配权限</Tag></div>
      </div>
      <div slot="footer">
        <Button type="error" size="small" @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
    import LeJinTable from '@/components/lejin-table'
    import {getRole, delRole} from '@/api/role'

    export default {
        name: "list",
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
                        title: '角色名称',
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
                                        type: 'warning',
                                        size: 'small',
                                        icon: 'ios-keypad'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.showModal = true
                                            this.showAllPermission('menu', params.row)
                                        }
                                    }
                                }, '栏目'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                        icon: 'md-finger-print'
                                    },
                                    style: {
                                        marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.showModal = true
                                            this.showAllPermission('permission', params.row)
                                        }
                                    }
                                }, '权限'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.$emit('onEdit', params.row)
                                        }
                                    }
                                }, '编辑'),
                            ])
                        }
                    }
                ],
                ruleValidate: {
                    name: [
                        {required: true, message: '角色名称不能为空', trigger: 'blur'}
                    ],
                },
                data: [],
                loading: false,
                showPage: false,
                showModal: false,
                showType: '', // 权限或栏目
                permission_info: {
                    name: '',
                    permission: []
                },
                menu_info: {
                    name: '',
                    menu: []
                },
                color: [
                    'default', 'primary', 'success', 'warning', 'error', 'blue', 'green', 'red', 'yellow',
                    'magenta', 'volcano', 'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple'
                ],
                total: 0,
                page: 1,
                pageSize: 10,
                pageSizeOpts: [10, 20, 30, 50, 100],
                selectArr: [], // 选择的数据 id 集合
                name: '', // 角色名称
            }
        },
        created() {
            this.tableDataInit() // 获取角色列表
        },
        methods: {
            handleEdit(record) {
                this.$emit('onEdit', record)
            },
            tableDataInit() {
                this.loading = true
                getRole({name: this.name})
                    .then((resp) => {
                        const data = resp.data
                        this.data = data.data
                        this.total = data.total
                        this.showPage = data.total > this.pageSize
                        this.loading = false
                    })
                    .catch((err) => {
                        this.loading = false
                        console.log('err', err)
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
                        delRole(ids).then(function (res) {
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
            showAllPermission(type, row) {
                if (type === 'menu') {
                    this.showType = 'menu'
                    this.menu_info = {
                        name: row.name,
                        menu: row.menus
                    }
                } else {
                    this.showType = 'permission'
                    this.permission_info = {
                        name: row.name,
                        permission: row.permissions
                    }
                }
            },
            closeModal() {
                this.showModal = false
                this.permission_info = {
                    name: '',
                    permission: []
                }
                this.menu_info = {
                    name: '',
                    menu: []
                }
            },
            changePage(value) {
                this.loading = true
                this.page = value
                this.tableDataInit()
            },
            changePageSize(value) {
                this.loading = true
                this.pageSize = value
                this.tableDataInit()
            },
        }
    }
</script>

<style scoped>
  .mleft {
    margin-left: 5px;
  }
</style>
