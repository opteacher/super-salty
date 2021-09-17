<template>
  <basic-layout>
    <at-form style="padding: 10rpx 8rpx">
      <at-textarea
        class="mb-20 b-0 pr-0"
        :focus="focusComp === 'content'"
        :error="errMsgs.content !== ''"
        style="padding-left: 32rpx"
        :maxLength="rules.content.max"
        placeholder="input news content"
        :value="form.content"
        @change="val => { form.content = onFieldChanged('content', val) }"
      />
      <view v-if="errMsgs.content !== ''" class="at-article__info err-msg">
        {{errMsgs.content}}
      </view>
      <at-image-picker
        multiple
        :files="form.images"
        @change="onUpldImgChanged"
      />
      <at-flex>
        <at-flex-item :size="6">
          <at-button class="mr-5" type="primary" formType="submit" @click="onFormSubmit">Submit</at-button>
        </at-flex-item>
        <at-flex-item :size="6">
          <at-button class="ml-5" formType="submit" @click="onReviewClicked">Review</at-button>
        </at-flex-item>
      </at-flex>
    </at-form>
  </basic-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import BasicLayout from '../../components/BasicLayout.vue'
import { FormState } from '../../commons'
import UpldImgBtn from '../../components/UpldImgBtn.vue'
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'addGood',
  components: {
    BasicLayout,
    UpldImgBtn
  },
  setup() {
    const store = useStore()
    const optionState = reactive({

    })
    const formState = new FormState({
      content: { default: '', rule: { required: true} },
      images: { default: [], rule: { required: true, min: 2 } },
      author: { default: store.getters.logined.user._index },
      autName: { default: store.getters.logined.account },
      avatar: { default: store.getters.logined.user.avatar }
    })

    async function onFormSubmit () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        // const good = await addNewGood(formState.form)
        // Taro.navigateTo({
        //   url: `../addGoodScs/addGoodScs?gid=${good._index}`
        // })
      }
    }
    function onUpldImgChanged (e) {
      console.log(e)
    }
    return {
      store,
      ...formState.toRefs(),
      ...toRefs(optionState),

      onFormSubmit,
      onUpldImgChanged
    }
  }
})
</script>

<style lang="scss">
.field-title {
  margin-left: 0;
  padding-left: 30rpx;
  border-left: 10rpx solid #6190e8;
  color: #8dabc4;
}

.add-tag {
  font-size: 10pt;
  margin-bottom: 10rpx;
  border: 1px dashed #6190e8;
}

.good-tag {
  font-size: 10pt;
  margin-bottom: 10rpx;
}

.loc-picker {
  font-size: 32rpx;
  padding: 24rpx 0;
  margin-left: 32rpx;
  border-bottom: 1px solid #f0f0f0;
}
</style>

