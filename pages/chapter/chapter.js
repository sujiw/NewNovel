// pages/chapter/chapter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort:true,
    bookinfo:{},
  },
  onSort:function(){
    var bookinfo = this.data.bookinfo;
    bookinfo.chapter = bookinfo.chapter.reverse();
    this.setData({
      bookinfo:bookinfo,
      sort:!this.data.sort,
    });
  },
  toChapter:function(e){
    var id = e.currentTarget.dataset.id;
    var bookinfo = this.data.bookinfo;
    if (!this.data.sort)
      id = (bookinfo.chapter.length-1) - id;
    wx.navigateBack();
    wx.redirectTo({
      url: '/pages/read/read?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var booklist = wx.getStorageSync('booklist');
    var read = wx.getStorageSync('read');
    var bookinfo = booklist[read];
    for (var i = 0; i < bookinfo.chapter.length;i++){
      if (bookinfo.chapter[i].name.length > 18)
        bookinfo.chapter[i].name = bookinfo.chapter[i].name.substring(0, 18) + "..."
    }
    this.setData({
      bookinfo: bookinfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})