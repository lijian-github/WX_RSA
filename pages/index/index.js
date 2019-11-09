//index.js
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
Page({
  data: {
    nowcity:'',
    weatherdata:'',
    showdaydata:'',
    update_time:'',
    inputvalue:'',
    index:0,
    StatusBar: app.globalData.StatusBar,
  },
  tapday:function(e){
    this.setData({
      showdaydata: this.data.weatherdata.data[e.currentTarget.dataset.item],
      update_time: this.data.weatherdata.update_time,
      index: e.currentTarget.dataset.item
    })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }, 
  getsearch:function(e){
    wx.showLoading({
      title: '正在加载',
    })
    this.getnowweather(e.detail.value)
    this.getweather(e.detail.value)
    this.setData({
      inputvalue:''
    })
  } ,
  getweather:function(e){
    var that=this
    wx.request({
      url: 'https://www.tianqiapi.com/api',
      data: {
        "version": 'v1',
        "city":e
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (e) {
        wx.hideLoading()
        console.log(e.data)
        for (var i in e.data.data){
          e.data.data[i].tem = e.data.data[i].tem.substr(0, e.data.data[i].tem.length-1)
          e.data.data[i].tem1 = e.data.data[i].tem1.substr(0, e.data.data[i].tem1.length - 1)
          e.data.data[i].tem2 = e.data.data[i].tem2.substr(0, e.data.data[i].tem2.length - 1)
        }
        that.setData({ weatherdata: e.data, nowcity:e.data.city})
      },
      fail: function () {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    })
  },
  getnowweather: function (e) {
    var that = this
    wx.request({
      url: 'https://www.tianqiapi.com/api',
      data: {
        "version": 'v6',
        "city": e
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (e) {
        console.log(e.data)
        var somedata = [{ "title": "当前温度", "data": e.data.tem }, { "title": "空气质量", "data": e.data.air },
          { "title": "PM2.5", "data": e.data.air_pm25 },
          { "title": "空气等级", "data": e.data.air_level },
          { "title": "湿度", "data": e.data.humidity },
          { "title": "能见度", "data": e.data.visibility },
          { "title": "气压hPa", "data": e.data.pressure },
          { "title": "风向", "data": e.data.win },
          { "title": "风速等级", "data": e.data.win_speed },
          { "title": "当前温度", "data": e.data.tem },
          { "title": "风速", "data": e.data.win_meter }]
        that.setData({
          update_time: e.data.update_time, showdaydata: e.data,
          somedata: somedata })
      },
      fail: function () {
        wx.showToast({
          title: '失败',
          icon: 'none'
        })
      }
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this
    var qqmapsdk = new QQMapWX({
      key: 'XVIBZ-RKPKV-SVQP3-UPHIV-COTQV-AXBTK' // 必填
    });
    wx.getLocation({
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (r) {
            var location = r.result.address_component.district
            location = location.substr(0, location.length - 1)
            console.log(r)
            that.setData({
              location:location
            })
            that.getweather(location)
            that.getnowweather(location)
          }
        })
      },
    })
  },
  onPullDownRefresh: function () {
    this.getweather(this.data.location)
    this.getnowweather(this.data.location)
    this.setData({
      index:0
    })
    wx.stopPullDownRefresh();
  },
})
