import { createApp } from 'vue'
import store from './store'
import { createUI } from 'taro-ui-vue3'
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtActivityIndicator,
  AtFlex,
  AtFlexItem,
  AtIcon,
  AtDivider,
  AtListItem,
  AtGrid,
  AtForm,
  AtTextarea,
  AtImagePicker,
  AtAccordion,
  AtTag,
  AtSearchBar,
  AtFab,
  AtList,
  AtAvatar,
  AtCard,
  AtVirtualScroll,
  AtButton,
  AtInput,
  AtInputNumber,
  AtCheckbox,
  AtBadge,
  AtMessage,
  AtSkeleton,
  AtSwitch,
  AtSteps
} from 'taro-ui-vue3/lib'
import 'taro-ui-vue3/dist/style/components/modal.scss'
import 'taro-ui-vue3/dist/style/components/activity-indicator.scss'
import 'taro-ui-vue3/dist/style/components/flex.scss'
import 'taro-ui-vue3/dist/style/components/icon.scss'
import 'taro-ui-vue3/dist/style/components/divider.scss'
import 'taro-ui-vue3/dist/style/components/list.scss'
import 'taro-ui-vue3/dist/style/components/grid.scss'
import 'taro-ui-vue3/dist/style/components/form.scss'
import 'taro-ui-vue3/dist/style/components/textarea.scss'
import 'taro-ui-vue3/dist/style/components/image-picker.scss'
import 'taro-ui-vue3/dist/style/components/accordion.scss'
import 'taro-ui-vue3/dist/style/components/tag.scss'
import 'taro-ui-vue3/dist/style/components/search-bar.scss'
import 'taro-ui-vue3/dist/style/components/fab.scss'
import 'taro-ui-vue3/dist/style/components/avatar.scss'
import 'taro-ui-vue3/dist/style/components/card.scss'
import 'taro-ui-vue3/dist/style/components/virtual-scroll.scss'
import 'taro-ui-vue3/dist/style/components/button.scss'
import 'taro-ui-vue3/dist/style/components/input.scss'
import 'taro-ui-vue3/dist/style/components/input-number.scss'
import 'taro-ui-vue3/dist/style/components/checkbox.scss'
import 'taro-ui-vue3/dist/style/components/badge.scss'
import 'taro-ui-vue3/dist/style/components/tabs.scss'
import 'taro-ui-vue3/dist/style/components/article.scss'
import 'taro-ui-vue3/dist/style/components/message.scss'
import 'taro-ui-vue3/dist/style/components/skeleton.scss'
import 'taro-ui-vue3/dist/style/components/switch.scss'
import 'taro-ui-vue3/dist/style/components/steps.scss'
import './app.scss'

const App = createApp({
  onShow (options) {},
  // ??????????????????????????? render ????????????????????????????????? taro ?????????
})

App.use(store)
App.use(createUI({
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtActivityIndicator,
  AtFlex,
  AtButton,
  AtInput,
  AtInputNumber,
  AtCheckbox,
  AtBadge,
  AtFlexItem,
  AtIcon,
  AtDivider,
  AtListItem,
  AtGrid,
  AtForm,
  AtTextarea,
  AtImagePicker,
  AtAccordion,
  AtTag,
  AtSearchBar,
  AtFab,
  AtList,
  AtAvatar,
  AtCard,
  AtVirtualScroll,
  AtMessage,
  AtSkeleton,
  AtSwitch,
  AtSteps
}))

export default App
