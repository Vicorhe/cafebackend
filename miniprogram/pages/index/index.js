// miniprogram/pages/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    access_token: '',
    expires_time: 0,
    products: [],
    value: 0
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
    } else { console.log('old token still valid') }
  },

  fetchProducts: function() {
    this.getValidAccessToken();
    wx.cloud.callFunction({
      name: "readproducts",
      data: { access_token: this.data.access_token },
    })
    .then(res => {
      var products = res.result.data.map(s => JSON.parse(s));
      this.setData({ products: products });
    })
    .catch(console.log);
  },

  onChange: function (e) {
    this.setData({ value: e.detail });
  },

  onTapIncreasePoints: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: function (res) {
        that.incrementPoints(res.result);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  incrementPoints: function (id) {
    wx.cloud.callFunction({
      name: "incrementpoints",
      data: {
        access_token: this.data.access_token,
        id: id,
        amount: this.data.value
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.log);
  },


  temp:function () {
    this.fetchProducts();
  }

})