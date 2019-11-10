<template>
    <div>
      edit
      <Button type="primary" @click="handleGoBack()" icon="md-add-circle">返回</Button>
    </div>
</template>

<script>
    export default {
        name: "edit",
        props: {
            record: {
                type: [Object, String],
                default: 'add'
            }
        },
        methods: {
            handleGoBack () {
                this.$parent.$parent.handleGoBack()
            },
        },
        mounted () {
            this.$nextTick(() => {
                console.log(1, this.record)
            })
        },
    }
</script>

<style scoped>

</style>
