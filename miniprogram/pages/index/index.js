import Dialog from '../../vant/dist/dialog/dialog';
Page({
  /**
   * Page initial data
   */
  data: {
    activeName: '',

    access_token: '',
    expiration_time: 0,
    products: [],
    product: {},
    delta: 0,
    show: false,
    newStatus: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
  },

  onShow: function () {
    this.getValidAccessToken();
  },

  getValidAccessToken: function () {
    const now = Date.now();
    if (this.data.expiration_time < now) {
      console.log('new access token');
      wx.cloud.callFunction({
        name: "getaccesstoken",
        data: {}
      })
      .then(res => {
        this.setData({
          access_token: res.result.response.access_token,
          expiration_time: res.result.response.expires_in * 761 + Date.now()
        });
      })
      .catch(err => console.log(err));
    } else { console.log('old token still valid') }
  },

  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },

  onTapMemberUpgrade: function () {
    this.getValidAccessToken();
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: function(res) {
        that.upgradeMember(res.result);
      }
    });
  },

  upgradeMember: function (userID) {
    wx.cloud.callFunction({ 
      name: "memberupgrade",
      data: {
        access_token: this.data.access_token,
        user_doc_id: userID,
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
    .catch(err => console.log(err));
  },

  onDeltaChange: function (e) {
    this.setData({ delta: e.detail });
  },

  onTapUpdateMemberPoints: function () {
    this.getValidAccessToken();
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: function (res) {
        that.updatePoints(res.result);
      }
    })
  },

  updatePoints: function (userID) {
    wx.cloud.callFunction({
      name: "updatepoints",
      data: {
        access_token: this.data.access_token,
        user_doc_id: userID,
        delta: this.data.delta
      }
    })
    .then(res => {
      wx.showToast({
        title: '成功更改会员积分',
        icon: 'success',
        duration: 3000,
        mask: true,
      });
    })
    .catch(err => console.log(err));
  },

  fetchProducts: function() {
    this.getValidAccessToken();
    wx.cloud.callFunction({
      name: "fetchproducts",
      data: { access_token: this.data.access_token },
    })
    .then(res => {
      var products = res.result.data.map(s => JSON.parse(s));
      this.setData({ products: products });
    })
    .catch(err => console.log(err));
  },

  tapDrink: function (e) {
    var prod_id = e.currentTarget.dataset.id;
    var product = this.data.products.filter(product => product._id == prod_id)[0];

    this.setData({
      show: true,
      product: product
    });
  },

  setProductStatus: function (){
    wx.cloud.callFunction({
      name: "setproductstatus",
      data: {
        access_token: this.data.access_token,
        id: this.data.product._id,
        status: this.data.newStatus
      }
    })
    .then(res => {
      console.log(res);
      this.fetchProducts();
    })
    .catch(console.log);
  },
})