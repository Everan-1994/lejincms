<template>
    <div>
      <Table ref="tables" :columns="columns" :data="data" :loading="loading" :no-data-text="loading ? '数据加载中...' : '暂无数据'"
             @on-selection-change="selectChange"></Table>
      <Row class="marginTop">
        <Col span="6">
          <div style="padding-bottom: 1px; overflow: hidden;">
            <Button type="error" @click="deleteData" icon="md-trash">删除</Button>
          </div>
        </Col>
        <Col span="18" v-show="showPage">
          <div style="margin: 10px; padding-bottom: 1px; overflow: hidden;">
            <div style="float: right; width: 80%; text-align: right;">
              <Page :total="total"
                    :current="page"
                    :page-size="pageSize"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    show-sizer
                    show-elevator
                    show-total
                    :page-size-opts="pageSizeOpts"
                    :placement="'top'">
              </Page>
            </div>
          </div>
        </Col>
      </Row>
    </div>
</template>

<script>
    export default {
        name: "tables",
        props: {
            pageSizeOpts: {
                type: Array,
                default: () => [10, 20, 30, 50, 100]
            },
            page: {
                type: [String, Number],
                default: 1
            },
            pageSize: {
                type: [String, Number],
                default: 10
            },
            total: {
                type: [String, Number],
                default: 0
            },
            loading: {
                type: Boolean,
                default: false
            },
            showPage: {
                type: Boolean,
                default: false
            },
            columns: {
                type: Array,
                default: []
            },
            data: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectChange (selection) {
                const arr = []
                for (let i = 0; i < selection.length; i++) {
                    arr.push(selection[i].id)
                }
                this.$emit('select-change', arr)
            },
            deleteData () {
                const list = this.$refs.tables.getSelection()
                if (list.length === 0) {
                    this.$Message.error('请勾选要删除的数据')
                    return false
                }
                this.$emit('delete-data')
            },
            changePage (value) {
                this.$emit('change-page', value)
            },
            changePageSize (value) {
                this.$emit('change-page-size', value)
            }
        }
    }
</script>

<style scoped>
  .marginTop {
    margin-top: 20px;
  }
</style>
