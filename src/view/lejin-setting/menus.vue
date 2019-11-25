<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="md-options"/>
        栏目管理
      </p>
      <div>
        <Row class="marginTop" style="margin-bottom: 15px">
          <Col span="24">
            <Button type="primary" ghost @click="exchangeTree">
              <Icon type="md-add" v-if="!flag"/>
              <Icon type="md-remove" v-else/>
              {{ !flag ? '展开栏目' : '折叠栏目' }}
            </Button>
            <Button type="error" ghost class="mleft" @click="delTree">
              <Icon type="md-trash"/>
              删除栏目
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <Alert show-icon>当前选择编辑：<span v-if="tree_dom">【{{ tree_dom }}】</span></Alert>
            <Tree
              ref="tree"
              :data="menu"
              show-checkbox
              @on-select-change="selectTree"
              @on-toggle-expand="toggleExpand"
              @on-check-change="changeSelect"
            ></Tree>
            <Spin size="large" fix v-if="loading"></Spin>
          </Col>
          <Col span="12">
            <Form ref="menuForm" :model="formData" :rules="ruleValidate" :label-width="100"
                  @submit.native.prevent>
              <FormItem label="父级栏目">
                <Select v-model="formData.pid">
                  <Option :value="0">顶级栏目</Option>
                  <Option v-for="item in select_menu" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="栏目名称" prop="title">
                <Input v-model="formData.title" placeholder="请输入栏目名称"></Input>
              </FormItem>
              <FormItem label="栏目路由" prop="path">
                <Input v-model="formData.path" placeholder="请输入栏目路由"></Input>
              </FormItem>
              <FormItem label="路由名称" prop="name">
                <Input v-model="formData.name" placeholder="请输入路由名称"></Input>
              </FormItem>
              <FormItem label="栏目图标" prop="icon">
                <icon-choose v-model="formData.icon"></icon-choose>
              </FormItem>
              <FormItem label="组件名称" prop="component">
                <Input v-model="formData.component" placeholder="请输入组件名称"></Input>
              </FormItem>
              <FormItem label="栏目排序" prop="order">
                <Input v-model="formData.order" placeholder="默认为1 数值小的靠前"></Input>
              </FormItem>
              <FormItem label="栏目配置">
                <CheckboxGroup v-model="formData.config">
                  <Checkbox label="not_cache" border>栏目缓存</Checkbox>
                  <Checkbox label="hide_in_bread" border>导航处隐藏</Checkbox>
                  <Checkbox label="hide_in_menu" border>栏目处隐藏</Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem>
                <Button type="success" ghost @click="submitForm()" icon="md-checkbox-outline" :loading="sub_load">
                  提交并保存
                </Button>
                <Button type="default" class="mleft" @click="resetForm">
                  <Icon type="md-refresh"></Icon>
                  表单重置
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
    import {getMenus, addMenu, editMenu, delMenu} from '@/api/menu'
    import IconChoose from "_c/lejin-icon-choose"
    export default {
        name: "menus",
        components: {
            IconChoose
        },
        data() {
            return {
                menu: [],
                select_menu: [], // 下拉栏目选项
                floor: 0, // 层级
                flag: true, // 切换展开与闭合
                sub_load: false, // 提交 loading
                loading: false,
                tree_dom: '', // 进行编辑的节点
                select_count: 0, // 勾选的数量
                select_list: [], // 勾选集合
                formData: {
                    id: 0,
                    pid: 0,
                    order: 1,
                    title: '',
                    path: '',
                    name: '',
                    icon: '',
                    component: '',
                    config: ['not_cache'],
                },
                ruleValidate: {
                    title: [
                        {required: true, message: '栏目名称不能为空', trigger: 'blur'}
                    ],
                    path: [
                        {required: true, message: '栏目路由不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '路由名称不能为空', trigger: 'blur'}
                    ],
                    icon: [
                        {required: true, message: '栏目图标不能为空', trigger: 'click'}
                    ],
                    component: [
                        {required: true, message: '组件名称不能为空', trigger: 'blur'}
                    ],
                    order: [
                        {
                            required: true,
                            type: 'number',
                            message: '栏目排序不能为空',
                            trigger: 'blur',
                            transform: (value) => Number(value)
                        }
                    ],
                }
            }
        },
        created() {
            this.tableDataInit() // 获取栏目列表
        },
        methods: {
            tableDataInit() {
                this.loading = true
                getMenus()
                    .then((resp) => {
                        this.menu = this.menuInit(resp.data.data)
                        this.selectMenuInit(resp.data.data)
                        this.loading = false
                    })
                    .catch((err) => {
                        this.loading = false
                        console.log('err', err)
                    })
            },
            menuInit(data) {
                return data.map(item => {
                    const memu = {
                        expand: true,
                        id: item.id,
                        pid: item.meta.pid,
                        path: item.path,
                        name: item.name,
                        component: item.component,
                        title: item.meta.title,
                        icon: item.meta.icon,
                        order: item.meta.order,
                        hide_in_bread: item.meta.hide_in_bread,
                        hide_in_menu: item.meta.hide_in_menu,
                        not_cache: item.meta.not_cache,
                    }
                    // 是否有子菜单，并递归处理
                    if (item.children && item.children.length > 0) {
                        // Recursion
                        memu.children = this.menuInit(item.children)
                    }
                    return memu
                })
            },
            selectMenuInit(data) {
                data.forEach((item) => {
                    if (this.floor > 0) {
                        let s = '-'
                        var str = s.repeat(this.floor * 6)
                    } else {
                        var str = ''
                    }
                    const memu = {
                        value: item.id,
                        label: str + item.meta.title,
                        disabled: false,
                    }
                    this.select_menu.push(memu)
                    // 是否有子菜单，并递归处理
                    if (item.children && item.children.length > 0) {
                        // Recursion
                        this.floor++
                        memu.children = this.selectMenuInit(item.children)
                    }
                })
                // 重置层级
                this.floor = 0
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
            submitForm() {
                this.$refs.menuForm.validate((valid) => {
                    if (valid) {
                        this.sub_load = true
                        if (this.formData.id > 0) {
                            editMenu(this.formData)
                                .then((resp) => {
                                    this.resp('更新成功')
                                })
                                .catch((err) => {
                                    this.$Message.error('更新失败，请刷新后重试');
                                    this.sub_load = false
                                    console.log('err', err)
                                })
                        } else {
                            addMenu(this.formData)
                                .then((resp) => {
                                    this.resp('添加成功')
                                })
                                .catch((err) => {
                                    this.$Message.error('添加失败，请刷新后重试');
                                    this.sub_load = false
                                    console.log('err', err)
                                })
                        }
                    }
                })
            },
            changeSelect(t) {
                this.select_count = t.length
                this.select_list = t;
            },
            delTree() {
                if (this.select_count <= 0) {
                    this.$Message.warning("请勾选要删除的栏目");
                    return;
                }
                this.$Modal.confirm({
                    title: '系统提示',
                    content: '<p>确定要删除吗？</p>',
                    loading: true,
                    onOk: () => {
                        let ids = [];
                        this.select_list.forEach(function(e) {
                            ids.push(e.id);
                        });
                        delMenu({ids}).then(res => {
                            this.$Modal.remove();
                            this.select_list = [];
                            this.select_count = 0;
                            this.resp('删除成功');
                        }).catch(err => {
                            this.$Message.error("删除失败");
                            console.log('err', err)
                        });
                    }
                });
            },
            toggleExpand(dom) {
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
            selectTree(tree, dom) {
                if (dom.selected) {
                    this.tree_dom = dom.title
                    // 配置处理
                    let config = []
                    if (dom.not_cache) {
                        config.push('not_cache')
                    }
                    if (dom.hide_in_bread) {
                        config.push('hide_in_bread')
                    }
                    if (dom.hide_in_menu) {
                        config.push('hide_in_menu')
                    }
                    this.formData = {
                        id: dom.id,
                        pid: dom.pid,
                        order: dom.order,
                        title: dom.title,
                        path: dom.path,
                        name: dom.name,
                        icon: dom.icon,
                        component: dom.component,
                        config: config,
                    }
                    this.selectMenuSetDisabled(dom.id) // 设置自身不可选
                } else {
                    this.resetForm()
                }
            },
            selectMenuSetDisabled(id) {
                const menu = this.select_menu
                this.select_menu = []
                menu.forEach(item => {
                    const _memu = {
                        value: item.value,
                        label: item.label,
                        disabled: id === item.value ? true : false
                    }
                    this.select_menu.push(_memu)
                })
            },
            resetForm() {
                this.tree_dom = ''
                this.formData = {
                    id: 0,
                    pid: 0,
                    order: 1,
                    title: '',
                    path: '',
                    name: '',
                    icon: '',
                    component: '',
                    config: ['not_cache'],
                }
                this.selectMenuSetDisabled(-1) // 初始化
                // 去除选中状态
                let data = this.$refs.tree.getSelectedNodes()[0];
                if (data) {
                    data.selected = false;
                }
            },
            resp(msg, bool = false) {
                this.$Message.success(msg);
                this.sub_load = bool
                this.resetForm()
                this.menu = []
                this.select_menu = []
                this.tableDataInit()
            }
        }
    }
</script>

<style>
  .mleft {
    margin-left: 5px;
  }
</style>
