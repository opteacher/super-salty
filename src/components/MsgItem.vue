<template>
  <at-list-item
    class="message-item"
    :thumb="message.user.avatar"
    :title="message.user.name"
    :note="message.content"
    :extraText="message.createdAt"
  />
</template>

<script>
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'messageItem',
  props: {
    message: { type: Object, required: true }
  },
  setup(props) {
    return {
      ...toRefs(props)
    }
  }
})
</script>

<style lang="scss">
.message-item .item-thumb__info {
  border-radius: 100%;
}
</style>