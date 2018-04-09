const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    hasSave:false,
    read:-1,
    bookinfo:{}
  }, 
  onRead: function (e) {
    if (!this.data.hasSave){
      this.onAddBook();
    }
    var read = this.data.read;
    wx.setStorageSync('read', read);
    wx.navigateTo({
      url: '/pages/read/read'
    })
  }, 
  chapterOpen:function(){
    if (!this.data.hasSave) {
      this.onAddBook();
    }
    var read = this.data.read;
    wx.setStorageSync('read', read);
    wx.navigateTo({
      url: '/pages/chapter/chapter'
    })
  },
  onAddBook:function(){
    var booklist = wx.getStorageSync('booklist');
    if (!booklist)
      booklist = [];
    booklist.unshift(app.handleTitle(this.data.bookinfo));
    
    wx.setStorageSync('booklist', booklist);
    wx.showToast({
      title: '已添加',
    });
    this.setData({
      hasSave:true,
      read: 0,
    });
  },
  onLoad: function (options) {
    var _this = this;
    var booklist = wx.getStorageSync('booklist');
    wx.request({
      url: app.adminUrl+'newbook',
      data: options,
      success:function(res){
        var hasSave = false;
        var read = -1;
        var book = res.data.book;
        wx.setNavigationBarTitle({
          title: book.title,
        })
        for (var i = 0; i < booklist.length;i++){
          if (booklist[i].author == book.author && booklist[i].title == book.title){
            read = i;
            hasSave = true;
            break;
          }
        }
        _this.setData({
          read: read,
          bookinfo: book,
          hasSave: hasSave
        });
      }, complete: function () {
        _this.setData({
          loading: false
        })
      }
    })
  }
})