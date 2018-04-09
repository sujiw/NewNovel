const app = getApp();
var t = "";
var p = 1;
var s = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    searchList:[],
  },
  onBookInfo: function(e){
    var url = e.currentTarget.dataset.url;
    var webid = e.currentTarget.dataset.webid;
    wx.navigateTo({
      url: '/pages/bookinfo/bookinfo?url='+url+'&webid='+webid,
    })
  },
  onLoad: function (options) {
    p=1;
    s=true;
    t="";
    t = options.search;
    this.search(t,p);
  },
  onReachBottom: function () {
    this.search(t,p);
  },
  search:function(name,page){
    console.log(app.adminUrl + "newsearch?search=" + name + "&page=" + page);
    if(!s)
      return;
    wx.showNavigationBarLoading();
    if(!page)
      page=1;
    var _this = this;
    var searchList = this.data.searchList;
    if (!searchList)
      searchList=[];
    wx.request({
      url: app.adminUrl + "newsearch?search=" + name + "&page="+page,
      success: function (res) {
        console.log(res);
        if (JSON.stringify(res.data.search)=='[]'){
          s=false;
          return;
        }
        p++;
        searchList = searchList.concat(app.handleTitle(res.data.search, true));
        _this.setData({
          searchList: searchList,
        });
      }, complete: function () {
        wx.hideNavigationBarLoading();
        _this.setData({
          loading: false
        })
      }
    })
  }
})