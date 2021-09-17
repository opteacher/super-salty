<template>
  <basic-layout>
    <at-form style="padding: 10rpx 8rpx">
      <upld-img-btn
        class="mb-20"
        :form="formState.form"
        prop="cover"
        placeholder="Upload Cover"
        :complete="imgURL => formState.onFieldChanged('cover', imgURL)"
      />
      <view v-if="formState.errMsgs.cover !== ''" class="at-article__info err-msg">
        {{formState.errMsgs.cover}}
      </view>
      <at-flex class="mb-20" justify="around">
        <at-flex-item :size="9">
          <at-input
            type="number"
            :focus="formState.focusComp.value === 'price'"
            :error="formState.errMsgs.price !== ''"
            placeholder="input good price"
            :value="formState.form.price"
            @change="val => {
              formState.form.price = formState.onFieldChanged('price', val)
            }"
          />
        </at-flex-item>
        <at-flex-item :size="3" style="border-bottom: 1px solid #f0f0f0">
          <at-button class="b-0" @click="onUnitChanged">
            <text style="font-size: 12pt; color: #8DABC4">
              {{formState.form.unit}}
            </text>
          </at-button>
        </at-flex-item>
      </at-flex>
      <view v-if="formState.errMsgs.price !== ''" class="at-article__info err-msg">
        {{formState.errMsgs.price}}
      </view>
      <at-input
        class="mb-20" type="text"
        :focus="formState.focusComp.value === 'name'"
        :error="formState.errMsgs.name !== ''"
        placeholder="input good name"
        :value="formState.form.name"
        @change="val => {
          formState.form.name = formState.onFieldChanged('name', val)
        }"
      />
      <view v-if="formState.errMsgs.name !== ''" class="at-article__info err-msg">
        {{formState.errMsgs.name}}
      </view>
      <picker
        class="loc-picker mb-20"
        mode="region"
        :value="location"
        :onChange="onLocChanged"
      >
        <view v-if="location[0].length">{{location.join('')}}</view>
        <view v-else style="color: #CCCCCC">select good location</view>
      </picker>
      <view v-if="formState.errMsgs.location !== ''" class="at-article__info err-msg">
        {{formState.errMsgs.location}}
      </view>
      <at-textarea
        class="mb-20 b-0 pr-0"
        :focus="formState.focusComp.value === 'desc'"
        :error="formState.errMsgs.desc !== ''"
        style="padding-left: 32rpx"
        :maxLength="formState.rules.desc.max"
        placeholder="input good description"
        :value="formState.form.desc"
        @change="val => {
          formState.form.desc = formState.onFieldChanged('desc', val)
        }"
      />
      <view v-if="formState.errMsgs.desc !== ''" class="at-article__info err-msg">
        {{formState.errMsgs.desc}}
      </view>
      <view class="mb-20">
        <at-tag
          v-for="(tag, idx) in formState.form.tags" :key="tag"
          class="mr-10 good-tag" :active="true" circle
          @click="store.dispatch('showConfirm', {
            content: 'Do you really wanna remove this tag?',
            confirmed: () => { formState.form.tags.splice(idx, 1) }
          })"
        >{{tag}}</at-tag>
        <at-tag class="add-tag" circle :active="true"
          @click="addTagVisible = true"
        >+ add tag</at-tag>
        <at-modal :isOpened="addTagVisible" :closeOnClickOverlay="false">
          <at-modal-header>Add tag</at-modal-header>
          <at-modal-content>
            <at-input
              class="mb-20"
              name="addTag"
              type="text"
              placeholder="input new tag"
              :value="addTagContent"
              @change="val => { addTagContent = val }"
            />
            <at-tag
              v-for="tag in topHotTags" :key="tag"
              class="mr-10 good-tag" :active="true" circle
              :type="addTagContent === tag ? 'primary' : ''"
              @click="addTagContent = tag"
            >{{tag}}</at-tag>
          </at-modal-content>
          <at-modal-action>
            <at-button class="w-100 br-0 b-0"
              @click="addTagVisible = false"
            >Cancel</at-button>
            <at-button class="w-100 br-0 b-0" type="primary"
              @click="onAddTagConfirmed"
            >OK</at-button>
          </at-modal-action>
        </at-modal>
      </view>
      <view v-for="image in formState.form.images" :key="image" class="mb-20">
        <image mode="widthFix" :src="image" style="width: 100%"/>
      </view>
      <upld-img-btn
        class="mb-20"
        :form="formState.form"
        prop="images"
        placeholder="Upload Pictures"
        :display="false"
        height="100rpx"
        direction="horizontal"
        :complete="() => formState.onFieldChanged('images', formState.form.images)"
      />
      <view v-if="formState.errMsgs.images !== ''" class="at-article__info err-msg">
        {{formState.errMsgs.images}}
      </view>
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
import { addNewGood } from '../../api'
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
      addTagVisible: false,
      addTagContent: '',
      topHotTags: ['dsfsdfsdf', 'dsfsdfgdfgdf', 'gdfhtryhtyhty', 'sdfsfdsadsadf', 'sfgfdgdf'],
      priceUnits: ['￥', '$'],
      location: ['', '', '']
    })
    const formState = new FormState({
      cover: { default: '', rule: { required: true } },
      name: { default: '', rule: { required: true } },
      price: { rule: { required: true, pattern: /^(\d+)(.\d{1,2})?$/ } },
      unit: { default: '￥', rule: { required: true, enum: optionState.priceUnits } },
      desc: { default: '', rule: { required: true, max: 500 } },
      location: { default: '', rule: { required: true } },
      images: { default: [], rule: { required: true, min: 1 } },
      tags: { default: [], rule: { required: true } },
      owner: { default: store.getters.loginedUser._index },
      publisher: { default: store.getters.loginedUser.account },
      avatar: { default: store.getters.loginedUser.avatar },
      viewed: { default: 0 },
      liked: { default: 0 }
    })

    async function onFormSubmit () {
      const chkRes = formState.validateForm()
      if (chkRes[0].length) {
        formState.errMsgs[chkRes[0]] = chkRes[1]
      } else {
        const good = await addNewGood(formState.form)
        Taro.navigateTo({
          url: `../addGoodScs/addGoodScs?gid=${good._index}`
        })
      }
    }
    function onAddTagConfirmed () {
      formState.form.tags.push(optionState.addTagContent)
      optionState.addTagVisible = false
      optionState.addTagContent = ''
    }
    function onReviewClicked () {
      Taro.navigateTo({
        url: `../goodDtl/goodDtl?review=1&good=${JSON.stringify(formState.form)}`,
      })
    }
    function onUnitChanged () {
      let index = optionState.priceUnits.indexOf(formState.form.unit) + 1
      if (index >= optionState.priceUnits.length) {
        index = 0
      }
      formState.form.unit = optionState.priceUnits[index]
    }
    function onLocChanged (e) {
      optionState.location = e.detail.value
      formState.form.location = e.detail.value.join('')
    }
    return {
      store,
      formState,
      ...toRefs(optionState),

      onFormSubmit,
      onAddTagConfirmed,
      onReviewClicked,
      onUnitChanged,
      onLocChanged
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

