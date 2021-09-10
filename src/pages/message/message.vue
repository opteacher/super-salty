<template>
  <basic-layout class="container">
    <at-list>
      <msg-item v-for="(msg, idx) in messages" :key="idx" :message="msg"/>
    </at-list>
  </basic-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import MsgItem from '../../components/MsgItem'
import BasicLayout from '../../components/BasicLayout'
import { getAllMessages } from '../../api'

export default defineComponent({
  name: 'message',
  components: {
    MsgItem,
    BasicLayout
  },
  setup () {
    const messages = ref(getAllMessages())
    return {
      messages
    }
  }
})
</script>
