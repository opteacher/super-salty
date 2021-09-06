<template>
  <basic-layout>
    <at-list-item
      class="fix-top good-cut"
      arrow="right"
      :note="cost"
      :title="good.name"
      extraText="More info"
      :thumb="good.cover"
      style="border-bottom: 3rpx solid #f0f0f0"
    />
    <view class="scroll-container p-50 msg-panel" :style="{
      top: '140rpx',
      bottom: operVisible ? '65vw' : '15vw'
    }">
      <!-- owner's messages -->
      <!-- <at-flex class="mb-40" justify="around">
        <at-flex-item :size="2">
          <at-avatar class="msg-avatar" circle
            image="http://cdn.opteacher.top/super-salty/assets/images/my_light.png"
          />
        </at-flex-item>
        <at-flex-item :size="10">
          <view class="msg-container">
            <view class="msg-arrow" style="left: 6rpx"/>
            <view class="msg-content ml-15">dsfsdfdsfsdfsd</view>
          </view>
          <view class="at-article__info m-0" style="float: right">2021/9/6 12:34:33</view>
        </at-flex-item>
      </at-flex> -->
      <!-- my messages -->
      <!-- <at-flex class="mb-40" justify="around">
        <at-flex-item :size="1">
          <at-activity-indicator class="mt-20"/>
        </at-flex-item>
        <at-flex-item :size="9">
          <view class="msg-container">
            <view class="msg-arrow" style="right: 6rpx"/>
            <view class="msg-content mr-15">dsfsdfdsfsdfsdddf;ksdfjksogjodigjodjgpsdjfposkfpospfkepofkweokesfsfdssdfsdfsdfsfsdfsdfsdfsfrgrfsfsefefesfsefsfsefsefesfesfsefsefes</view>
          </view>
          <view class="at-article__info m-0" style="float: left">2021/9/6 12:34:33</view>
        </at-flex-item>
        <at-flex-item :size="2">
          <at-avatar class="msg-avatar" circle
            image="http://cdn.opteacher.top/super-salty/assets/images/my_light.png"
          />
        </at-flex-item>
      </at-flex> -->
    </view>
    <view class="fix-bottom p-0">
      <at-flex align="center" style="height: 15vw">
        <at-flex-item :size="8">
          <at-input
            name="content"
            type="text"
            placeholder="input message"
            :border="false"
            v-model:value="form.content"
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
      <at-accordion
        class="collapse-toolbox"
        :hasBorder="false"
        :open="operVisible"
        :isAnimation="false"
      >
        <at-grid
          class="tools-grid mt-20"
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
import { computed, defineComponent, reactive, toRefs } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import Taro from '@tarojs/taro'
import { copyGood, FormState, Good, newGood } from '../../commons'
import { getIdenGood } from '../../api/good'
export default defineComponent({
  components: {
    BasicLayout
  },
  onShow () {
    this.refresh()
  },
  setup () {
    const good: Good = reactive(newGood())
    const owner = computed(() => {
      return good.owner ? good.owner.username || good.owner.phone : ''
    })
    const cost = computed(() => {
      return good.price ? good.unit + good.price : ''
    })
    const formState = new FormState({
      content: { default: '', rule: { required: true } },
    })
    const optionState = reactive({
      operVisible: false
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

    async function refresh () {
      const queryParams = Taro.getCurrentInstance().router?.params || {}
      if (!queryParams.gid) {
        Taro.navigateBack({ delta: 1 })
        return
      }
      copyGood(await getIdenGood(queryParams.gid), good)
    }
    function onMsgSubmitted () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
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
      cost,
      owner,
      toolBox,
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
.good-cut .item-thumb {
  width: 100rpx;
  height: 100rpx;
}
.msg-panel {
  background-color: #ecf5fd;
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
    background-color: #f1e4ed;
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
    background: #f1e4ed;
    border-style: solid;
    border-width: 1rpx;
    border-color: #f1e4ed;
    transform: rotate(45deg);
    top: 40rpx;
  }
}

.collapse-toolbox .at-accordion__header {
  display: none !important;
}

.tools-grid .content-inner__text {
  margin-top: 0 !important;
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
