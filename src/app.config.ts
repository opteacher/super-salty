export default {
  pages: [
    'pages/login/login',
    'pages/index/index',
    'pages/chatRoom/chatRoom',
    'pages/offerPrice/offerPrice',
    'pages/news/news',
    'pages/message/message',
    'pages/my/my',
    'pages/goodDtl/goodDtl',
    'pages/addGood/addGood',
    'pages/addGoodScs/addGoodScs',
    'pages/addNews/addNews',
    'pages/orderList/orderList',
    'pages/genOrderScs/genOrderScs',
    'pages/orderDtl/orderDtl',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#6190E8",
    selectedColor: "#6190E8",
    position: 'bottom',
    list: [{
      "pagePath": "pages/index/index",
      "text": "home",
      "iconPath":"assets/images/home_light.png",
      "selectedIconPath":"assets/images/home_fill_light.png"
    }, {
      "pagePath": "pages/news/news",
      "text": "news",
      "iconPath":"assets/images/goods_new_light.png",
      "selectedIconPath":"assets/images/goods_new_fill_light.png"
    }, {
      "pagePath": "pages/message/message",
      "text": "message",
      "iconPath":"assets/images/message_light.png",
      "selectedIconPath":"assets/images/message_fill_light.png"
    }, {
      "pagePath": "pages/my/my",
      "text": "my",
      "iconPath":"assets/images/my_light.png",
      "selectedIconPath":"assets/images/my_fill_light.png"
    }]
  }
}
