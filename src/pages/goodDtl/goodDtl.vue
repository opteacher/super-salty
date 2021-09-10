<template>
  <basic-layout>
    <view class="scroll-container p-0" :style="{ bottom: review ? '' : '132rpx' }">
      <at-skeleton v-if="!good.name"
        style="margin: 10px"
        type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
      />
      <view v-else class="at-article">
        <at-flex align="center" justify="around">
          <at-flex-item :size="6" class="pl-20">
            <text style="font-size: 10pt; color: #FF4949">{{good.unit}}</text>
            <text style="font-size: 15pt; color: #FF4949">{{good.price}}</text>
          </at-flex-item>
          <at-flex-item :size="6" class="pr-20">
            <view class="at-article__info m-0 text-right">
              <text>
                <at-icon value="eye" size="20"/>&nbsp;{{good.viewed}}
              </text>&nbsp;
              <text>
                <at-icon value="heart" size="20"/>&nbsp;{{good.liked}}
              </text>
            </view>
          </at-flex-item>
        </at-flex>
        <view class="at-article__h1 mt-0">{{good.name}}</view>
        <view style="margin: 0 30rpx">
          <at-tag
            v-for="(tag, idx) in good.tags" :key="idx.toString()"
            class="good-tag" circle :active="true"
          >{{tag}}</at-tag>
        </view>
        <at-flex align="center" justify="around">
          <at-flex-item :size="6">
            <at-list-item class="owner" :thumb="good.owner.avatar"
              :title="good.owner.username || good.owner.phone"/>
          </at-flex-item>
          <at-flex-item :size="6">
            <view class="at-article__info text-right">
              <at-icon value="map-pin" size="20"/>&nbsp;{{good.location}}
            </view>
          </at-flex-item>
        </at-flex>
        <view class="at-article__content">
          <view class="at-article__section">
            <view class="at-article__p">{{good.desc}}</view>
          </view>
          <view class="at-article__section">
            <image v-for="(img, idx) in good.images" :key="idx.toString()"
              class="at-article__img" :src="img" mode="widthFix"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="fix-bottom p-0" v-if="!review">
      <at-flex justify="around" align="center">
        <at-flex-item :size="3">
          <view :hover-class="{'click-bkgd': !isOwner}" class="oper-link right-border">
            <at-icon value="heart" size="25" color="#A8C6DF"/>
            <text class="inner-text">&nbsp;Like</text>
          </view>
        </at-flex-item>
        <at-flex-item :size="3">
          <view hover-class="click-bkgd" class="oper-link">
            <at-icon value="external-link" size="25" color="#A8C6DF"/>
            <text class="inner-text">&nbsp;Share</text>
          </view>
        </at-flex-item>
        <at-flex-item :size="6" style="padding: 20rpx 20rpx 20rpx 0">
          <at-button v-if="!isOwner" type="primary" @click="onToChatClicked">
            <at-icon value="message" size="30"/>&nbsp;Chat now
          </at-button>
          <at-button v-else type="primary" @click="onToEditClicked">
            <at-icon value="settings" size="30"/>&nbsp;Go To Edit
          </at-button>
        </at-flex-item>
      </at-flex>
    </view>
  </basic-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import Taro from '@tarojs/taro'
import { copyGood, Good, newGood } from '../../commons'
import { getIdenGood } from '../../api'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'goodDetail',
  components: {
    BasicLayout
  },
  onShow () {
    this.refresh()
  },
  setup() {
    const store = useStore()
    const good: Good = reactive(newGood())
    const queryParams = Taro.getCurrentInstance().router?.params || {}
    const lgnUsrIdx = store.getters.loginedUser._index
    const isOwner = computed(() => good.owner._index === lgnUsrIdx)

    async function refresh () {
      if (queryParams.gid) {
        copyGood(await getIdenGood(queryParams.gid), good)
      }
      if (queryParams.good) {
        copyGood(JSON.parse(queryParams.good), good)
      }
      if (!good.name) {
        Taro.navigateBack({ delta: 1 })
      }
    }
    function onToChatClicked () {
      Taro.navigateTo({
        url: `../../pages/chatRoom/chatRoom?gid=${queryParams.gid}&bid=${lgnUsrIdx}`
      })
    }
    function onToEditClicked () {

    }
    return {
      good,
      isOwner,
      review: queryParams.review,

      refresh,
      onToChatClicked,
      onToEditClicked
    }
  }
})
</script>

<style lang="scss">
.oper-link {
  text-align: center;
  padding: 20rpx 5rpx;

  .inner-text {
    font-size: 10pt;
    color: #a8c6df;
    vertical-align: middle;
  }
}

.right-border {
  border-right: 1px solid #ccc5;
}

.good-tag {
  margin-right: 10rpx;
  border-color: #78a4fa;
  color: #78a4fa;
}

.owner .item-thumb__info {
  border-radius: 100%;
}
</style>
