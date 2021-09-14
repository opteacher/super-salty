<template>
  <basic-layout class="container">
    <at-list>
      <msg-item
        v-for="(msgInf, index) in msgInfs"
        :key="index"
        :msgInf="msgInf"
      />
    </at-list>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MsgItem from '../../components/MsgItem.vue'
import BasicLayout from '../../components/BasicLayout.vue'
import { getAllMessages, getAllMsgsByUsr, getIdenGood, getUserByIdx } from '../../api'
import { useStore } from 'vuex'
import { Message, User } from 'src/commons'

interface MsgInf {
  goodId: string
  buyerId: string
  other: User
  messages: Message[]
}

export default defineComponent({
  name: 'message',
  components: {
    MsgItem,
    BasicLayout
  },
  onShow () {
    this.refresh()
  },
  setup () {
    const store = useStore()
    const msgInfs = ref([] as MsgInf[])
    async function refresh () {
      const lgnUsr = store.getters.loginedUser
      const msgInfsTmp: MsgInf[] = []
      for (const topic of await getAllMsgsByUsr(lgnUsr._index)) {
        const messages = await getAllMessages(topic)
        const tpcInf = topic.split('.')
        const goodId = tpcInf[0]
        const buyerId = tpcInf[1]
        let other: any
        if (buyerId === lgnUsr._index) {
          other = await getUserByIdx(buyerId)
        } else {
          other = (await getIdenGood(goodId)).owner
        }
        msgInfsTmp.push({
          other, goodId, buyerId,
          messages: messages as Message[]
        })
      }
      msgInfs.value = msgInfsTmp
    }
    return {
      msgInfs,

      refresh
    }
  }
})
</script>
