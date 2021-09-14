<template>
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
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import Taro from '@tarojs/taro'
import { FormState } from '../../commons'
import { addMessage } from '../../api'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'OfferPrice',
  setup () {
    const store = useStore()
    const lgnUsr = store.getters.loginedUser
    const params = Taro.getCurrentInstance().router?.params
    const orgPrice = parseFloat(params?.price || '0')
    const freeDlv = params?.freeDlv ? JSON.parse(params?.freeDlv) : false
    const formState = new FormState({
      price: { default: orgPrice.toString(), rule: { required: true, pattern: /^(\d+)(.\d{1,2})?$/ } },
      freeDlv: { default: freeDlv }
    }, 'price')
    const optionState = reactive({
      orgPrice,
      unit: params?.unit || '￥'
    })

    async function onPriceSubmit () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        await addMessage({
          topic: params?.topic,
          content: JSON.stringify(formState.form) + '#offerPrice',
          sender: lgnUsr._index,
          createdAt: new Date()
        })
        Taro.navigateBack({ delta: 1 })
      }
    }
    return {
      ...formState.toRefs(),
      ...toRefs(optionState),

      onPriceSubmit
    }
  }
})
</script>
