<template>
  <basic-layout>
    <at-list-item
      class="fix-top good-cut"
      arrow="right"
      :note="cost"
      :title="good.name"
      extraText="More info"
      :thumb="good.cover"
      style=""
    />
    <scroll-view id="pnlMessages" :scroll-y="true" :style="{
      'margin-top': '140rpx',
      'margin-bottom': msgPanelBtm
    }">
      <view class="p-20">
        <template v-for="(message, index) in messages" :key="index">
          <!-- owner's messages -->
          <at-flex
            v-if="message.sender === 'seller'"
            :class="{'mb-40': index !== messages.length - 1}"
            justify="around"
          >
            <at-flex-item :size="2">
              <at-avatar class="msg-avatar" circle :image="message.good.owner.avatar"/>
            </at-flex-item>
            <at-flex-item :size="10">
              <view class="msg-container">
                <view class="msg-arrow" style="left: 6rpx"/>
                <view class="msg-content ml-15">{{message.content}}</view>
              </view>
              <view class="at-article__info m-0" style="float: right">
                {{message.createdAt.toLocaleString()}}
              </view>
            </at-flex-item>
          </at-flex>
          <!-- my messages -->
          <at-flex
            v-else-if="message.sender === 'buyer'"
            :class="{'mb-40': index !== messages.length - 1}"
            justify="around"
          >
            <at-flex-item v-if="ldgMessage === index" :size="1">
              <at-activity-indicator class="mt-20"/>
            </at-flex-item>
            <at-flex-item :size="ldgMessage === index ? 9 : 10">
              <view class="msg-container">
                <view class="msg-arrow" style="right: 6rpx"/>
                <view class="msg-content mr-15">{{message.content}}</view>
              </view>
              <view class="at-article__info m-0" style="float: left">
                {{message.createdAt.toLocaleString()}}
              </view>
            </at-flex-item>
            <at-flex-item :size="2">
              <at-avatar class="msg-avatar" circle :image="message.good.owner.avatar"/>
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
            :value="form.content"
            :focus="focusComp === 'content'"
            @change="val => { form.content = onFieldChanged('content', val) }"
          />
        </at-flex-item>
        <at-flex-item :size="2" class="pr-10">
          <at-button type="primary" size="normal" @click="onMsgSubmitted">Send</at-button>
        </at-flex-item>
        <at-flex-item :size="2" class="pr-10">
          <at-fab
            class="toolbox-btn" size="small"
            :class="{'toolbox-btn__unact': !operVisible}"
            @click="operVisible = !operVisible"
          >
            <text class="at-fab__icon at-icon at-icon-add"></text>
          </at-fab>
        </at-flex-item>
      </at-flex>
      <view v-if="errMsgs.content !== ''" class="at-article__info err-msg" style="height: 5vw">
        {{errMsgs.content}}
      </view>
      <at-accordion
        class="collapse-toolbox"
        :hasBorder="false"
        :open="operVisible"
        :isAnimation="false"
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
import { computed, defineComponent, reactive, Ref, ref, toRefs } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import Taro from '@tarojs/taro'
import { copyGood, FormState, Good, newGood, Message } from '../../commons'
import { getIdenGood } from '../../api/good'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    BasicLayout
  },
  onShow () {
    this.refresh()
  },
  setup () {
    const store = useStore()
    const good: Good = reactive(newGood())
    const formState = new FormState({
      content: { default: '', rule: { required: true } },
    }, 'content')
    const optionState = reactive({
      operVisible: false,
      owner: computed(() => {
        return good.owner ? good.owner.username || good.owner.phone : ''
      }),
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
      ldgMessage: -1
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

    setInterval(() => {
      messages.value.push({
        content: 'aslksdlfksmdlfksdlkfsdlkfmlsdkmf',
        sender: 'seller',
        good,
        buyer:  store.getters.loginedUser,
        createdAt: new Date()
      })
      scrollToEnd()
    }, 10000)

    async function refresh () {
      const queryParams = Taro.getCurrentInstance().router?.params || {}
      if (!queryParams.gid) {
        Taro.navigateBack({ delta: 1 })
        return
      }
      copyGood(await getIdenGood(queryParams.gid), good)
    }
    function scrollToEnd () {
      Taro
        .createSelectorQuery()
        .select('#pnlMessages')
        .fields({ scrollOffset: true }, fields => {
          console.log(fields)
          Taro.pageScrollTo({
            selector: '#pnlMessages',
            scrollTop: fields.scrollHeight,
            duration: 300,
            success: res => {
              console.log(res)
            }
          })
        })
        .exec()
    }
    function onMsgSubmitted () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        messages.value.push({
          content: formState.form.content,
          sender: 'buyer',
          good,
          buyer: store.getters.loginedUser,
          createdAt: new Date()
        })
        formState.form.content = ''
        optionState.ldgMessage = messages.value.length - 1
        setTimeout(() => {
          optionState.ldgMessage = -1
        }, 1000)
        scrollToEnd()
        // const good = await addNewGood(formState.form)
        // Taro.navigateTo({
        //   url: `../../pages/addGoodScs/addGoodScs?gid=${good._index}`
        // })
      }
    }
    function onToolClicked (item: object, index: number): void {
      console.log(item)
      const callback = toolBox[index].callback
      callback && callback()
    }
    function ChoosePicture () {
      console.log('Choose a picture')
    }
    function RequirePrice () {
      console.log('Require a price')
    }
    return {
      good,
      toolBox,
      messages,
      ...formState.toRefs(),
      ...toRefs(optionState),

      refresh,
      onMsgSubmitted,
      onToolClicked
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
</style>
