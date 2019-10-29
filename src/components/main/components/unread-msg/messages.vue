<template>
  <div class="msg-dropdown">
    <Dropdown trigger="click">
      <a href="javascript:void(0)" style="color: #000;">
        <Badge :count="count">
          <Icon type="ios-notifications-outline" size="20"></Icon>
        </Badge>
      </a>
      <DropdownMenu slot="list">
        <Tabs value="name1">
          <TabPane :label="`消息 (${count})`" name="name1">
            <List>
              <ListItem>
                <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
                              title="This is title"
                              description="This is description, this is description." />
              </ListItem>
              <ListItem>
                <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
                              title="This is title"
                              description="This is description, this is description." />
              </ListItem>
              <ListItem>
                <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
                              title="This is title"
                              description="This is description, this is description." />
              </ListItem>
            </List>
          </TabPane>
          <TabPane label="标签二" name="name2">标签二的内容</TabPane>
          <TabPane label="标签三" name="name3">标签三的内容</TabPane>
        </Tabs>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    name: 'messages',
    props: {
      count: [String, Number],
      default: 0
    },
    data () {
      return {

      }
    },
    computed: {},
    methods: {}
  }
</script>
<style>
  .msg-dropdown {
    width: auto;
    padding: 0 12px;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
  }
  .msg-dropdown:hover {
    background: #f8f8f9;
  }
  .ivu-badge-count {
    margin-top: 20px !important;
    margin-right: 0 !important;
  }
</style>
