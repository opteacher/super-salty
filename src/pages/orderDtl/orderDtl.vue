<template>
  <basic-layout>
    <view class="scroll-container" style="bottom: 132rpx">
      <at-steps
        class="pt-20"
        :items="orderSteps"
        :current="step"
      />
      <at-card class="card-with-nohead mt-20">
        <at-flex>
          <at-flex-item :size="3" is-auto>
            <image
              v-if="order.good.cover"
              :src="order.good.cover"
              mode="aspectFill"
              :style="{
                'width': '200rpx',
                'height': '200rpx',
                'border-radius': '10rpx'
              }"
            />
          </at-flex-item>
          <at-flex-item :size="5">
            <view>
              <view class="at-article__h2 mt-0 mr-0">
                {{order.good.name}}
              </view>
              <view class="at-article__info mr-0">
                {{order.good.tags.join(' & ')}}
              </view>
            </view>
          </at-flex-item>
          <at-flex-item :size="3">
            <view class="at-article__h2 m-0 text-right">
              <text style="font-size: 10pt">
                {{order.good.unit}}
              </text>
              {{order.price}}
            </view>
          </at-flex-item>
        </at-flex>
      </at-card>
      <at-card class="mt-20" title="Order Information">
        <info-litem
          v-if="order._index"
          title="NO"
          :value="order._index"
        />
        <info-litem
          v-if="order.createdAt"
          title="Time"
          :value="order.createdAt"
        />
        <info-litem
          v-if="order.buyer._index"
          title="Buyer"
        >
          <at-flex align="center">
            <at-flex-item :offset="5" :size="2">
              <image :src="order.buyer.avatar" mode="scaleToFill" :style="{
                'border-radius': '100%',
                width: '50rpx',
                height: '50rpx'
              }"/>
            </at-flex-item>
            <at-flex-item :size="5" is-auto>
              <text>{{order.buyer.account}}</text>
            </at-flex-item>
          </at-flex>
        </info-litem>
      </at-card>
      <at-card v-if="isSending" class="mt-20" title="Delivery Information">
        <info-litem
          v-if="order.delivery"
          title="Deliver ID"
          :value="order.delivery"
        />
      </at-card>
    </view>
    <view class="fix-bottom">
      <at-button
        v-if="isWaitForPay"
        type="primary" :active="true"
        @click="onPayClicked"
      >Pay</at-button>
      <at-button
        v-else-if="isWaitForSend"
        type="primary" :active="true"
        @click="sendDlgVisible = true"
      >Send</at-button>
      <at-button
        v-else-if="isWaitForRecv"
        type="primary" :active="true"
        @click="onRecvClicked"
      >Confirm Received</at-button>
      <at-button
        v-else-if="isWaitForEval"
        type="primary" :active="true"
        @click="onEvalClicked"
      >Evaluate</at-button>
    </view>
    <at-modal :isOpened="sendDlgVisible">
      <at-modal-header>Input Delivery ID</at-modal-header>
      <at-modal-content>
        <valid-input :formState="sendFormState" field="delivery"/>
      </at-modal-content>
      <at-modal-action>
        <at-button
          class="w-100 br-0 b-0"
          @click="sendDlgVisible = false"
        >Cancel</at-button>
        <at-button
          class="w-100 br-0 b-0"
          @click="onSendSubmit"
        >OK</at-button>
      </at-modal-action>
    </at-modal>
  </basic-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import Taro from '@tarojs/taro'
import BasicLayout from '../../components/BasicLayout.vue'
import InfoLitem from '../../components/InfoLitem.vue'
import ValidInput from '../../components/ValidInput.vue'
import { FormState, newOrder } from '../../commons'
import { getOrder, updateOrder } from '../../api'
import { useStore } from 'vuex'
const orderSteps = [
  { title: 'Pay' },
  { title: 'Send' },
  { title: 'Sending' },
  { title: 'Receive' },
  { title: 'Evaluate' },
]
export default defineComponent({
  name: 'OrderDetail',
  components: {
    BasicLayout,
    InfoLitem,
    ValidInput
  },
  onShow () {
    this.refresh()
  },
  setup () {
    const store = useStore()
    const params = Taro.getCurrentInstance().router?.params
    if (!params?.oid) {
      Taro.navigateBack({ delta: 1 })
    }
    const orderId = params?.oid as string
    const order = reactive(newOrder())
    const step = computed(() => {
      return orderSteps.findIndex(res => res.title === order.status)
    })
    const lgnUsrIdx = store.getters.loginedUser._index
    const isWaitForPay = computed(() => {
      return step.value === 0 && lgnUsrIdx === order.buyer._index
    })
    const isWaitForSend = computed(() => {
      return step.value === 1 && lgnUsrIdx === order.good.owner
    })
    const isSending = computed(() => step.value === 2)
    const isWaitForRecv = computed(() => {
      return step.value === 3 && lgnUsrIdx === order.buyer._index
    })
    const isWaitForEval = computed(() => {
      return step.value === 4 && lgnUsrIdx === order.buyer._index
    })
    const optionState = reactive({
      sendDlgVisible: false
    })
    const sendFormState = new FormState({
      delivery: { default: '', rule: { required: true } },
      status: { default: 'Sending' }
    })

    async function refresh () {
      await getOrder(orderId, order)
    }
    function onPayClicked () {
      store.dispatch('showConfirm', {
        content: 'Start some kind of payment logic',
        confirmed: async () => {
          await updateOrder(orderId, { status: 'Send'})
          await refresh()
        }
      })
    }
    async function onSendSubmit () {
      const chkRes = sendFormState.validateForm()
      if (chkRes[0].length) {
        sendFormState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        await updateOrder(orderId, sendFormState.form)
        optionState.sendDlgVisible = false
        await refresh()
      }
    }
    function onRecvClicked () {
      store.dispatch('showConfirm', {
        content: 'Are you sure? If you confirm received good, the money will send to seller\'s wallet',
        confirmed: async () => {
          await updateOrder(orderId, { status: 'Evaluate'})
          await refresh()
        }
      })
    }
    function onEvalClicked () {

    }
    return {
      order,
      orderSteps,
      step,
      isWaitForPay,
      isWaitForSend,
      isSending,
      isWaitForRecv,
      isWaitForEval,
      ...toRefs(optionState),
      sendFormState,

      refresh,
      onPayClicked,
      onSendSubmit,
      onRecvClicked,
      onEvalClicked
    }
  }
})
</script>

<style lang="scss">
.card-with-nohead {
  .at-card__header {
    display: none !important;
  }
}
</style>
