// miniprogram/pages/index.js
Page({

  /**
   * Page initial data
   */
  data: {
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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
  }

})