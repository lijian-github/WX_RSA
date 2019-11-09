//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
      }
    })

    
  },
  globalData: {
    userInfo: null,
    StatusBar:0
  }
})