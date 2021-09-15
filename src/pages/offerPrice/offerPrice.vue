<template>
  <basic-layout>
    <at-form>
      <at-input
        name="price"
        type="number"
        :focus="focusComp === 'price'"
        :value="form.price"
        :placeholder="orgPrice.toString()"
        @change="val => { form.price = onFieldChanged('price', val) }"
      >
        <text>{{unit}}</text>
      </at-input>
      <view
        v-if="errMsgs.price !== ''"
        class="at-article__info err-msg"
      >{{errMsgs.price}}</view>
      <at-switch
        :title="`${form.freeDlv ? 'Free Delivery' : 'Not Free'}`"
        :checked="form.freeDlv"
        @change="e => { form.freeDlv = e }"
      />
      <at-button
        class="mt-20 ml-10 mr-10"
        type="primary"
        :active="true"
        @click="onPriceSubmit"
      >Submit</at-button>
    </at-form>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import Taro from '@tarojs/taro'
import { FormState, isEndsWith, rmvEndsOf } from '../../commons'
import { addMessage, getMessage, setMessage } from '../../api'
import { useStore } from 'vuex'
import BasicLayout from '../../components/BasicLayout.vue'

export default defineComponent({
  name: 'OfferPrice',
  components: {
    BasicLayout
  },
  onShow () {
    this.init()
  },
  setup () {
    const store = useStore()
    const lgnUsr = store.getters.loginedUser
    const params = Taro.getCurrentInstance().router?.params
    const topic = params?.topic as string
    const orgPrice = parseFloat(params?.price || '0')
    const formState = new FormState({
      price: { default: orgPrice.toString(), rule: { required: true, pattern: /^(\d+)(.\d{1,2})?$/ } },
      freeDlv: { default: params?.freeDlv ? JSON.parse(params?.freeDlv) : false }
    }, 'price')
    const optionState = reactive({
      orgPrice,
      unit: params?.unit || '￥'
    })

    async function init () {
      const params = Taro.getCurrentInstance().router?.params
      if (!params?.topic) {
        Taro.navigateBack({ delta: 1 })
        return
      }
      if (!params?.lindex) {
        return
      }
      const message = await getMessage(parseInt(params?.lindex), params?.topic)
      const content = message.content
      if (!isEndsWith(content, '#offerPrice')) {
        Taro.navigateBack({ delta: 1 })
        return
      }
      const ofPrice = JSON.parse(rmvEndsOf(content, '#offerPrice'))
      if (orgPrice === 0) {
        formState.form.price = ofPrice.price
      }
      formState.form.freeDlv = JSON.parse(ofPrice.freeDlv)
    }
    async function onPriceSubmit () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
        return
      } else if (params?.lindex) {
        await setMessage(parseInt(params?.lindex), {
          topic,
          content: JSON.stringify(formState.form) + '#offerPrice',
          sender: lgnUsr._index,
          createdAt: new Date()
        })
      } else {
        await addMessage({
          topic,
          content: JSON.stringify(formState.form) + '#offerPrice',
          sender: lgnUsr._index,
          createdAt: new Date()
        })
      }
      Taro.navigateBack({ delta: 1 })
    }
    return {
      ...formState.toRefs(),
      ...toRefs(optionState),

      init,
      onPriceSubmit
    }
  }
})
</script>
