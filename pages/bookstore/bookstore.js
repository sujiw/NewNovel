// pages/bookstore/bookstore.js
const app = getApp()
Page({
  data: {
    loading: false,
    currentTab: 0,
  },
  getRecommendData(){
    var _this = this;
    _this.setData({
      loading: true
    });
    console.log(app.adminUrl + "qidianrecommend");
    wx.request({
      url: app.adminUrl + "qidianrecommend",
      success: function (res) {
        console.log(res);
        var male = app.handleTitle(res.data.male, true);
        var female = app.handleTitle(res.data.female, true);
        var order = {};
        order.male = male;
        order.female = female;
        _this.setData({
          recommendData: order,
          loading: false
        });
      },
      fail: function(error){
        console.log(error);
      }
    })
  },
  getClassData() {
    var _this = this;
    _this.setData({
      loading: true
    });
    wx.request({
      url: app.adminUrl + "qidianclass",
      success: function (res) {
        _this.setData({
          classData: res.data,
          loading: false
        });
      }
    })
  },
  getRankingData() {
    var _this = this;
    _this.setData({
      loading: true
    });
    wx.request({
      url: app.adminUrl + "qidianrankinglist",
      success: function (res) {
        _this.setData({
          rankingData: res.data,
          loading: false
        });
      }
    })
  },
  getFinishData() {
    var _this = this;
    _this.setData({
      loading: true
    });
    wx.request({
      url: app.adminUrl + "qidianfinish",
      success: function (res) {
        var male = app.handleTitle(res.data.male, true);
        var female = app.handleTitle(res.data.female, true);
        var order = {};
        order.male = male;
        order.female = female;
        _this.setData({
          finishData: order,
          loading: false
        });
      }
    })
  },
  toSearch: function(e){
    var search = e.detail.value;
    if(!search)
      search = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '/pages/search/search?search=' + search,
    })
  },
  onLoad: function (options) {
    this.getRecommendData()
  },

  onShareAppMessage: function () {
  
  },
  onCurrentTab: function(e){
    var current = -1;
    if (e.detail.current!= undefined)
      current = e.detail.current;
    else
      current = e.target.dataset.current;
    if (this.data.currentTab == current)
      return;
    var data = { currentTab: current };
    current = parseInt(current);
    switch (current) {
      case 0: if (!this.data.recommendData) this.onLoad(); break;
      case 1: if (!this.data.classData) this.getClassData();; break;
      case 2: if (!this.data.rankingData) this.getRankingData();; break;
      case 3: if (!this.data.finishData) this.getFinishData();; break;
    }
    this.setData(data);
  }
})