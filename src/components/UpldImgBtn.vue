<template>
  <at-button class="upld-img-btn" @click="onUploadImgClicked" :style="{ height }">
    <view v-if="!form[prop].length || !display" class="h-100 center-container">
      <view v-if="direction === 'vertical'">
        <at-icon value="add" size="32"/>
        <view>{{placeholder}}</view>
      </view>
      <template v-else-if="direction === 'horizontal'">
        <at-icon value="add" size="20"/>&nbsp;
        <view>{{placeholder}}</view>
      </template>
    </view>
    <image v-else mode="scaleToFill" :src="form[prop]"/>
  </at-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { bkHost } from '../commons'
import Taro from '@tarojs/taro'
import store from '../store'

export default defineComponent({
  name: 'UploadImageButton',
  props: {
    'form': { type: Object, required: true },
    'prop': { type: String, required: true },
    'placeholder': { type: String, default: 'Upload image' },
    'display': { type: Boolean, default: true },
    'complete': { type: Function, default: () => {} },
    'height': { type: String, default: '500rpx' },
    'direction': { type: String, default: 'vertical' }
  },
  setup (props) {
    async function onUploadImgClicked () {
      const res = await Taro.chooseImage({
        count: 1
      })
      store.dispatch('showLoading', true)
      const uploadTask = Taro.uploadFile({
        url: `${bkHost}/super-salty/api/v1/file`, //仅为示例，非真实的接口地址
        filePath: res.tempFilePaths[0],
        name: 'file',
        success (res) {
          const data = JSON.parse(res.data)
          //do something
          console.log(data)
          const ptype = typeof props.form[props.prop]
          if (ptype === 'object') {
            props.form[props.prop].push(data.result)
          } else {
            props.form[props.prop] = data.result
          }
          props.complete(data.result)
          store.dispatch('showLoading', false)
        }
      })
      uploadTask.progress((res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    }

    return {
      ...props,

      onUploadImgClicked
    }
  }
})
</script>

<style lang="scss">
.upld-img-btn {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
  border: 1px dashed #c5d9e8;
  color: #8dabc4;

  .at-button__text {
    width: 100%;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
