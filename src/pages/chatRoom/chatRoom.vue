<template>
  <basic-layout>
    <at-list-item
      class="fix-top good-cut"
      arrow="right"
      :note="cost"
      :title="good.name"
      extraText="More info"
      :thumb="good.cover"
    />
    <scroll-view id="pnlMessages" :scroll-y="true" :style="{
      'margin-top': '140rpx',
      'margin-bottom': msgPanelBtm,
      //'animation-duration': '3s',
      //'animation-name': operVisible ? 'slideup' : 'slidedown'
    }">
      <view class="p-20">
        <template v-for="(message, index) in messages" :key="index">
          <!-- his/her messages -->
          <at-flex
            v-if="message.sender !== lgnUsr._index"
            :class="{'mb-40': index !== messages.length - 1}"
            justify="around"
          >
            <at-flex-item :size="2">
              <at-avatar class="msg-avatar" circle :image="message.sender.avatar"/>
            </at-flex-item>
            <at-flex-item :size="10">
              <view class="msg-container">
                <view class="msg-arrow" style="left: 6rpx"/>
                <view class="msg-content ml-15">
                  <msg-content
                    :good="good" :topic="topic" :lindex="message.index"
                    :senderId="message.sender._index || message.sender"
                    :content="message.content"
                    :orderConfirmed="onOrderConfirmed"
                  />
                </view>
              </view>
              <view class="at-article__info m-0" style="float: right">
                {{message.createdAt.toLocaleString()}}
              </view>
            </at-flex-item>
          </at-flex>
          <!-- my messages -->
          <at-flex
            v-else
            :class="{'mb-40': index !== messages.length - 1}"
            justify="around"
          >
            <at-flex-item v-if="ldgMessage === index" :size="1">
              <at-activity-indicator class="mt-20"/>
            </at-flex-item>
            <at-flex-item :size="ldgMessage === index ? 9 : 10">
              <view class="msg-container">
                <view class="msg-arrow" style="right: 6rpx"/>
                <view class="msg-content mr-15">
                  <msg-content
                    :good="good" :topic="topic" :lindex="message.index"
                    :senderId="message.sender._index || message.sender"
                    :content="message.content"
                    :orderConfirmed="onOrderConfirmed"
                  />
                </view>
              </view>
              <view class="at-article__info m-0" style="float: left">
                {{message.createdAt.toLocaleString()}}
              </view>
            </at-flex-item>
            <at-flex-item :size="2">
              <at-avatar class="msg-avatar" circle :image="message.sender.avatar"/>
            </at-flex-item>
          </at-flex>
        </template>
      </view>
    </scroll-view>
    <view class="fix-bottom p-0" style="z-index: 50; background-color: #FAFBFC">
      <at-flex align="center" style="height: 15vw">
        <at-flex-item :size="8">
          <at-input
            clear
            name="content"
            type="text"
            placeholder="input message"
            :border="false"
            :value="formState.form.content"
            :focus="formState.focusComp.value === 'content'"
            :error="formState.errMsgs.content !== ''"
            @change="val => {
              formState.form.content = formState.onFieldChanged('content', val)
            }"
          />
        </at-flex-item>
        <at-flex-item :size="2" class="pr-10">
          <at-button type="primary" size="normal" @click="onMsgSubmitted">Send</at-button>
        </at-flex-item>
        <at-flex-item :size="2" class="pr-10">
          <at-fab
            class="toolbox-btn" size="small"
            :class="{'toolbox-btn__unact': !operVisible}"
            @click="onToolboxClicked"
          >
            <text class="at-fab__icon at-icon at-icon-add"/>
          </at-fab>
        </at-flex-item>
      </at-flex>
      <view
        v-if="formState.errMsgs.content !== ''"
        class="at-article__info err-msg"
        style="height: 5vw"
      >
        {{formState.errMsgs.content}}
      </view>
      <at-accordion
        class="collapse-toolbox"
        :hasBorder="false"
        :open="operVisible"
      >
        <at-grid
          class="tools-grid"
          :columnNum="4"
          :hasBorder="false"
          :data="toolBox"
          @click="onToolClicked"
        />
      </at-accordion>
    </view>
  </basic-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, Ref, ref, toRefs, onUnmounted } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import MsgContent from '../../components/MsgContent.vue'
import Taro from '@tarojs/taro'
import { FormState, newGood, uploadImage, newUser, Message, copyMessage, isEndsWith, rmvEndsOf } from '../../commons'
import { getIdenGood, genNewOrder, getUserByIdx, getAllMessages, addMessage, setMessage } from '../../api'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    BasicLayout,
    MsgContent,
  },
  onShow () {
    this.init()
  },
  setup () {
    const store = useStore()
    const lgnUsr = store.getters.loginedUser
    const qryPam = Taro.getCurrentInstance().router?.params || {}
    const topic = `${qryPam.gid}.${qryPam.bid}`

    const good = reactive(newGood())
    const buyer = reactive(newUser())
    const formState = new FormState({
      topic: { default: topic },
      content: { default: '', rule: { required: true } },
      sender: { default: lgnUsr._index }
    }, 'content')
    const optionState = reactive({
      lgnUsr,
      topic,
      operVisible: false,
      cost: computed(() => {
        return good.price ? good.unit + good.price : ''
      }),
      msgPanelBtm: computed(() => {
        return optionState.operVisible ? `${
          70 + (formState.errMsgs.content.length ? 5 : 0)
        }vw` : `${
          15 + (formState.errMsgs.content.length ? 5 : 0)
        }vw`
      }),
      ldgMessage: -1,
    })
    const toolBox = [
      {
        image: 'http://cdn.opteacher.top//super-salty/assets/images/pic_fill.png',
        value: 'Choose a picture',
        callback: ChoosePicture
      },
      {
        image: 'http://cdn.opteacher.top//super-salty/assets/images/camera_fill.png',
        value: 'Take a photo'
      },
      {
        image: 'http://cdn.opteacher.top//super-salty/assets/images/redpacket_fill.png',
        value: 'Send a redpacket'
      },
      {
        image: 'http://cdn.opteacher.top//super-salty/assets/images/location_fill.png',
        value: 'Send location'
      },
      {
        image: 'http://cdn.opteacher.top//super-salty/assets/images/sponsor_fill.png',
        value: 'Require a price',
        callback: RequirePrice
      }
    ]
    const messages: Ref<Message[]> = ref([])

    const itvlHdl = setInterval(async () => {
      await refresh()
    }, 5000)
    onUnmounted(() => {
      clearInterval(itvlHdl)
    })

    async function init () {
      if (!qryPam.gid) {
        Taro.navigateBack({ delta: 1 })
        return
      }
      await getIdenGood(qryPam.gid, good)
      if (!qryPam.bid) {
        Taro.navigateBack({ delta: 1 })
        return
      }
      await getUserByIdx(qryPam.bid, buyer)
      await refresh()
    }
    async function refresh () {
      messages.value = await getAllMessages(topic)
      Taro.nextTick(scrollToEnd)
    }
    function scrollToEnd () {
      Taro
        .createSelectorQuery()
        .select('#pnlMessages')
        .fields({ scrollOffset: true }, fields => {
          if (!fields) {
            return
          }
          Taro.pageScrollTo({
            selector: '#pnlMessages',
            scrollTop: fields.scrollHeight,
            duration: 300,
          })
        })
        .exec()
    }
    async function onMsgSubmitted () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        await addMsgToBked()
      }
    }
    function onToolClicked (item: object, index: number): void {
      console.log(item)
      const callback = toolBox[index].callback
      callback && callback()
    }
    async function ChoosePicture () {
      console.log('Choose a picture')
      const imgURL = await uploadImage()
      await addMsgToBked(imgURL + '#image')
    }
    async function addMsgToBked (msgContent?: string) {
      const message = copyMessage(formState.form)
      if (msgContent) {
        message.content = msgContent
      }
      messages.value.push(message)
      formState.form.content = ''
      optionState.ldgMessage = messages.value.length - 1
      await addMessage(message)
      optionState.ldgMessage = -1
      Taro.nextTick(scrollToEnd)
    }
    function RequirePrice () {
      console.log('Require a price')
      const params = [
        `topic=${topic}`,
        `price=${good.price}`,
        `unit=${good.unit}`,
      ].join('&')
      Taro.navigateTo({
        url: `../offerPrice/offerPrice?${params}`
      })
    }
    function onToolboxClicked () {
      optionState.operVisible = !optionState.operVisible
      if (optionState.operVisible) {
        scrollToEnd()
      }
    }
    async function onOrderConfirmed (finPrice: number) {
      // 禁用之前所有报价消息
      if (optionState.ldgMessage !== -1) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      for (let i = messages.value.length - 1; i >= 0; i--) {
        const message = messages.value[i]
        if (isEndsWith(message.content, '#offerPrice')) {
          const ofPrice = JSON.parse(rmvEndsOf(message.content, '#offerPrice'))
          ofPrice.ordered = true
          message.content = JSON.stringify(ofPrice) + '#offerPrice'
          await setMessage(message.index as number, message)
        }
      }
      const order = await genNewOrder({
        price: finPrice,
        good: qryPam.gid,
        buyer: qryPam.bid,
        status: 'WaitForSend',
      })
      console.log(order)
      Taro.navigateTo({
        url: '../genOrderScs/genOrderScs'
      })
    }
    return {
      good,
      toolBox,
      messages,
      formState,
      ...toRefs(optionState),

      init,
      refresh,
      onMsgSubmitted,
      onToolClicked,
      onToolboxClicked,
      onOrderConfirmed,
    }
  }
})
</script>

<style lang="scss">
.good-cut {
  border-bottom: 3rpx solid #f0f0f0;
  z-index: 50;
  background-color: #fafbfc;

  .item-thumb {
    width: 100rpx;
    height: 100rpx;
  }
}

.msg-avatar {
  margin: 0 auto;
  background-color: #eef0f0;
  border: 5rpx solid #6190e8;
  padding: 10rpx;
  width: 70rpx;
  height: 70rpx;
}

.msg-container {
  position: relative;

  .msg-content {
    min-height: 80rpx;
    padding: 15rpx 20rpx;
    background-color: #ecf5fd;
    border-radius: 10rpx;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    color: #3f536e;
    font-size: 12pt;
  }
  .msg-arrow {
    position: absolute;
    display: block;
    width: 20rpx;
    height: 20rpx;
    background: #ecf5fd;
    border-style: solid;
    border-width: 1rpx;
    border-color: #ecf5fd;
    transform: rotate(45deg);
    top: 40rpx;
  }
}

.collapse-toolbox .at-accordion__header {
  display: none !important;
}

.tools-grid {
  margin-top: 5vw;
  .content-inner__text {
    margin-top: 0 !important;
  }
}

.toolbox-btn {
  margin: 0 auto;
  box-shadow: none;
}

.toolbox-btn__unact {
  border: 5rpx solid #6190e8;
  background-color: #fafbfc;
  color: #6190e8;
}

@keyframes slideup {
  from {
    margin-bottom: 15vw;
  }
  to {
    margin-bottom: 70vw;
  }
}
@keyframes slidedown {
  from {
    margin-bottom: 70vw;
  }
  to {
    margin-bottom: 15vw;
  }
}
</style>
