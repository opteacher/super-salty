<template>
  <at-list-item
    class="message-item"
    :thumb="msgInf.other.avatar"
    :title="msgInf.other.account"
    :note="lastMsg.content"
    :extraText="lastMsg.createdAt"
    @click="onMsgItmClicked"
  />
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import Taro from '@tarojs/taro'

export default defineComponent({
  name: 'messageItem',
  props: {
    msgInf: { type: Object, required: true }
  },
  setup(props) {
    const lastMsg = computed(() => {
      if (props.msgInf.messages.length) {
        return props.msgInf.messages[props.msgInf.messages.length - 1]
      } else {
        return { content: '', createdAt: '' }
      }
    })

    function onMsgItmClicked () {
      Taro.navigateTo({
        url: `../chatRoom/chatRoom?gid=${props.msgInf.goodId}&bid=${props.msgInf.buyerId}`
      })
    }
    return {
      lastMsg,
      ...toRefs(props),

      onMsgItmClicked
    }
  }
})
</script>

<style lang="scss">
.message-item .item-thumb__info {
  border-radius: 100%;
}
</style>
