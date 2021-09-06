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
  AtBadge,
  AtMessage,
  AtSkeleton
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
import 'taro-ui-vue3/dist/style/components/badge.scss'
import 'taro-ui-vue3/dist/style/components/tabs.scss'
import 'taro-ui-vue3/dist/style/components/article.scss'
import 'taro-ui-vue3/dist/style/components/message.scss'
import 'taro-ui-vue3/dist/style/components/skeleton.scss'
import './app.scss'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
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
  AtSkeleton
}))

export default App
