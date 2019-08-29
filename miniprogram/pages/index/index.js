// miniprogram/pages/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    access_token: '',
    expires_time: 0,
    products: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
    this.getValidAccessToken();
  },

  onShow: function () {
    this.getValidAccessToken();
  },

  onTapMemberUpgrade: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: function(res) {
        that.upgradeMember(res.result);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  upgradeMember: function (id) {
    wx.cloud.callFunction({ 
      name: "memberupgrade",
      data: {
        id: id
      }
    })
    .then(res => {
      wx.showToast({
        title: '成功升级会员',
        icon: 'success',
        duration: 3000,
        mask: true,
      });
    })
    .catch(err => console.log(err))
  },

  getValidAccessToken: function () {
    const now = Date.now();
    if (this.data.expires_time < now){
      console.log('new access token');
      wx.cloud.callFunction({
        name: "getaccesstoken",
        data: {}
      })
      .then(res => {
        this.setData({
          access_token: res.result.response.access_token,
          expires_time: res.result.response.expires_in * 761 + Date.now()
        });
      })
      .catch(console.log);
    }
  },

  temp:function () {
    this.getValidAccessToken();
  }

})