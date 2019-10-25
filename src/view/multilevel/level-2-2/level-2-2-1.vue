<template>
  <div>
    <Card :bordered="false">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        No border title
      </p>
      <p>
        <Table :columns="columns15" :data="data11" border show-summary></Table>
        <br>
        <Table :columns="columns15" :data="data11" border show-summary :summary-method="handleSummary"
               height="200"></Table>
      </p>
    </Card>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        columns15: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Amount1',
            key: 'amount1'
          },
          {
            title: 'Amount2',
            key: 'amount2'
          },
          {
            title: 'Amount3',
            key: 'amount3'
          }
        ],
        data11: [
          {
            id: '100001',
            name: 'John Brown',
            amount1: '123',
            amount2: '1.2',
            amount3: 10
          }, {
            id: '100002',
            name: 'Jim Green',
            amount1: '234',
            amount2: '2.3',
            amount3: 11
          }, {
            id: '100003',
            name: 'Joe Black',
            amount1: '345',
            amount2: '3.4',
            amount3: 12
          }, {
            id: '100004',
            name: 'Jon Snow',
            amount1: '456',
            amount2: '4.5',
            amount3: 13
          }, {
            id: '100005',
            name: 'Jobs',
            amount1: '678',
            amount2: '5.6',
            amount3: 14
          }
        ]
      }
    },
    methods: {
      handleSummary ({ columns, data }) {
        const sums = {}
        columns.forEach((column, index) => {
          const key = column.key
          if (index === 0) {
            sums[key] = {
              key,
              value: '总价'
            }
            return
          }
          const values = data.map(item => Number(item[key]))
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[key] = {
              key,
              value: v + ' 元'
            }
          } else {
            sums[key] = {
              key,
              value: 'N/A'
            }
          }
        })

        return sums
      }
    }
  }
</script>
