<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="ios-medal-outline" />
        {{ currentComponet === 'List' ? '角色列表' : '角色管理' }}
      </p>
      <component @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
    </Card>
  </div>
</template>

<script>
    // 动态切换组件
    import List from './role/list'
    import Edit from './role/edit'

    export default {
        name: 'role',
        components: {
            List,
            Edit
        },
        data () {
            return {
                currentComponet: 'List',
                record: 'add'
            }
        },
        created () {

        },
        methods: {
            handleEdit (record) {
                this.record = record
                this.currentComponet = 'Edit'
            },
            handleGoBack () {
                this.record = ''
                this.currentComponet = 'List'
            }
        },
        watch: {
            '$route.path' () {
                this.record = ''
                this.currentComponet = 'List'
            }
        }
    }
</script>

