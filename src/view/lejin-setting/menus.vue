<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="md-options"/>
        栏目管理
      </p>
      <div>
        <Row class="marginTop" style="margin-bottom: 15px">
          <Button type="success" ghost @click="resetForm">
            <Icon type="md-add-circle"></Icon>
            添加栏目
          </Button>
          <Button type="primary" ghost class="mleft" @click="exchangeTree">
            <Icon type="md-add" v-if="!flag" />
            <Icon type="md-remove" v-else/>
            {{ !flag ? '展开' : '折叠' }}
          </Button>
          <Button type="error" ghost class="mleft">
            <Icon type="md-trash" />
            删除
          </Button>
        </Row>
        <Row>
          <Col span="6">
            <Alert show-icon>当前选择编辑：{{ tree_dom }}</Alert>
            <Tree
              :data="menu"
              show-checkbox
              @on-select-change="selectTree"
            ></Tree>
          </Col>
          <Col span="12">
            <Form ref="permissionForm" :model="formData" :rules="ruleValidate" :label-width="100" @submit.native.prevent>
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
                <Input v-model="formData.icon" placeholder="请选择栏目图标"></Input>
              </FormItem>
              <FormItem label="组件名称" prop="component">
                <Input v-model="formData.component" placeholder="请输入组件名称"></Input>
              </FormItem>
              <FormItem label="栏目排序" prop="order">
                <Input v-model="formData.order" placeholder="默认为1 数值小的靠前"></Input>
              </FormItem>
              <FormItem label="栏目配置">
                <CheckboxGroup v-model="formData.config">
                  <Checkbox label="栏目缓存" true-value="1" false-value="0" border></Checkbox>
                  <Checkbox label="导航处隐藏" true-value="1" false-value="0" border></Checkbox>
                  <Checkbox label="栏目处隐藏" true-value="1" false-value="0" border></Checkbox>
                </CheckboxGroup>
              </FormItem>
<!--              <FormItem label="授予角色">-->
<!--                <Select v-model="formData.role" multiple placeholder="授予角色 可多选" style="width: 95%;">-->
<!--                  <Option v-for="item in roles" :value="item.name" :key="item.id">{{ item.name }}</Option>-->
<!--                </Select>-->
<!--              </FormItem>-->
              <FormItem>
                <Button type="info" ghost @click="submitForm()" icon="md-checkbox-outline" :loading="sub_load">提交并保存</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
    export default {
        name: "menus",
        data() {
            return {
                menu: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                flag: true, // 切换展开与闭合
                sub_load: false, // 提交 loading
                tree_dom: '', // 进行编辑的节点
                formData: {
                    pid: 0,
                    order: 1,
                    title: '',
                    path: '',
                    name: '',
                    icon: '',
                    component: '',
                    config: ['1', '0', '0'],
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
                        {required: true, message: '栏目图标不能为空', trigger: 'blur'}
                    ],
                    component: [
                        {required: true, message: '组件名称不能为空', trigger: 'blur'}
                    ],
                    order: [
                        {required: true, message: '栏目排序不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            exchangeTree() {
                this.flag = !this.flag
                this.menu = this.treeChangeExpand(this.menu, this.flag);
            },
            // 递归给树设置expand
            treeChangeExpand(treeData, flag) {
                let _this = this;
                for (let i = 0; treeData && i < treeData.length; i++) {
                    treeData[i].expand = flag;
                    if (treeData[i].children) {
                        treeData[i].children = _this.treeChangeExpand(treeData[i].children,flag);
                    }
                }
                return treeData;
            },
            submitForm() {

            },
            selectTree(tree, dom) {
                if (dom.selected) {
                    this.tree_dom = dom.title
                    this.formData = {
                        name: dom.title
                    }
                } else {
                    this.resetForm()
                }
            },
            resetForm() {
                this.tree_dom = ''
                this.formData = {
                    name: ''
                }
            }
        }
    }
</script>

<style>
  .mleft {
    margin-left: 5px;
  }
</style>
