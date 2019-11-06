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
            <Button type="primary" @click="permissionModal(false)" icon="md-add-circle">添加权限</Button>
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
          :select="selectChange"
        >
        </le-jin-table>
      </div>
    </Card>
    <Modal
      v-model="show"
      :title="modal_title"
      :mask-closable="false"
      :closable="false"
      ok-text="提交"
      :loading="sub_load"
      :on-ok="submitFrom"
    >
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>

<script>
    import LeJinTable from '@/components/lejin-table'
    import {getPermission} from '@/api/permission'
    import { getRole, getRoleByPermission } from '@/api/role'

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
                                        size: 'small'
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
                data: [],
                loading: false,
                showPage: false,
                pageSize: 1000,
                name: '',
                selectArr: [], // 选择的数据 id 集合
                fromData: {
                    id: 0,
                    name: '', // 权限名称
                    role: '' // 角色名称
                },
                modal_title: '添加权限',
                show: false, // modal
                sub_load: false // 提交状态
            }
        },
        created() {
            this.tableDataInit() // 获取权限列表
            this.roleDataInit() // 获取角色列表
        },
        methods: {
            tableDataInit() {
                getPermission({name: this.name})
                    .then((resp) => {
                        // console.log('resp', resp)
                    })
                    .catch((err) => {
                        // console.log('err', err)
                    })
            },
            roleDataInit () {

            },
            roleData(permission) {

            },
            permissionModal(bool, row) {
                this.show = true
                if (bool) {
                    this.modal_title = '编辑权限'
                    this.roleData(row.name)
                } else {
                    this.roleData()
                }
            },
            submitFrom () {

            },
            query() {
                this.tableDataInit()
            },
            resetQuery() {
                this.name = ''
                this.loading = false
            },
            selectChange(arr) {
                this.selectArr = arr
            },
            deleteSome() {
                const ids = {}
                ids.ids = this.selectArr
            }
        }
    }
</script>

<style scoped>
  .mleft {
    margin-left: 5px;
  }
</style>
