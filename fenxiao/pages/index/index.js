const product = require('../../utils/product.js')

Page({
  data: {
    items: [],
    slides: [{img: "../../images/offline-banner.jpg"},
    {img: "../../images/list-ban01.png"},
    {img: "../../images/list-ban02.png"}
    ],
    navs: [
      {icon: "../../images/img/homenav1.jpg"},
      {icon: "../../images/img/homenav2.jpg"},
      {icon: "../../images/img/homenav3.jpg"},
      {icon: "../../images/img/homenav4.jpg"},
    ],
    navs1: [
      {icon1: "../../images/img/homenav11.jpg"},
      {icon1: "../../images/img/homenav22.jpg"},
      {icon1: "../../images/img/homenav33.jpg"},
      {icon1: "../../images/img/homenav4.jpg"},
    ],
    navs2: [
      {icon2: "../../images/t6.jpg"},
      {icon2: "../../images/t5.jpg"},
      {icon2: "../../images/t14.jpg"},
      {icon2: "../../images/t15.jpg"},
      {icon2: "../../images/shopcar-ph01.png"},
      {icon2: "../../images/detail-pp04.png"},
    ],
    popularity_products: [],
    new_products: [],
    hot_products: [],
    promotions: []
  },

  bindShowProduct: function (e) {
    wx.navigateTo({
      url: `../show_product/show_product?id=${e.currentTarget.dataset.id}`
    })
  },

  catchTapCategory: function (e) {
    wx.navigateTo({
      url: `../category/category?type=${e.currentTarget.dataset.type}`
    })
  },

  onLoad: function() {
    var that = this
     product.getSlides(function(result) {
      var data = getApp().store.sync(result.data)
      that.setData({'slides': data})
      wx.setStorage({
        key:"indexSlides",
        data:data
      })
    })
    //调取接口开始
    wx.request({ 
      url: 'http://www.tjgbank.cn/xiangmu/index.php', //仅为示例，并非真实的接口地址 
      method:'GET',
      header: { 'Content-Type': 'application/json' }, 
      success: 
      function(res) { 
        that.setData({'slides': res.data})
        
        } ,
        fail:
        function(res){
          console.log('no')
        }
 })
   //调取接口结束
    wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
        if (networkType) {
          product.getProducts(function(result) {
            var data = getApp().store.sync(result.data)
            that.setData({
              items: data,
              popularity_products: data.filter(product => product.flag === '最热'),
              new_products:        data.filter(product => product.flag === '新品'),
              hot_products:        data.filter(product => product.flag === '火爆'),
            })
            wx.setStorageSync('products', data)
          })
        } else {
           cache = wx.getStorageSync('products')
           if (cache) {
             that.setData({'items': cache})
           } else {
             that.setData({'items': []})
           }
        }
      }
    })
  }
})
