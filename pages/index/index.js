//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    booklist: [],
    admin: false,
    delectnum: 0,
    read:-1,
    speed: 0,
  },
  onLoad: function (o) {
    var booklist = wx.getStorageSync('booklist');
    var read = wx.getStorageSync('read');
    var speed = 0;
    if (!read && read !== 0)
      read = -1;
    if (!booklist)
      booklist=[];
    else if (read!=-1)
      speed = booklist[read].chapterid ? ((parseInt(booklist[read].chapterid) + 1) / booklist[read].chapter.length * 100).toFixed(2) : 0
    this.setData({
      booklist: booklist,
      read: read,
      speed: speed
    });
    if(o){
      this.onPullDownRefresh()
    }
  },
  onShow: function () {
    this.onLoad(false);
  },
  onAdmin: function(e){
    var admin = this.data.admin;
    this.setData({
      admin: !admin
    });
  },
  onBookAdd:function(){
    wx.switchTab({
      url: '/pages/bookstore/bookstore'
    })
  },
  onSelected:function(e){
    var id = e.currentTarget.dataset.id;
    var booklist = this.data.booklist;
    var delectnum = 0;
    booklist[id].selected = !booklist[id].selected;
    for (var i = 0; i < booklist.length; i++){
      if (booklist[i].selected)
        delectnum++;
    }
    this.setData({
      booklist: booklist,
      delectnum: delectnum
    });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onDelete:function(e){
    var booklist = this.data.booklist;
    var read = this.data.read;
    var newBooklist = [];
    for (var i = 0; i < booklist.length; i++) {
      if (!booklist[i].selected){
        if (i == read)
          read = newBooklist.length;
        newBooklist.push(booklist[i]);
      }else if(i==read)
        read = -1;
    }
    if (newBooklist.length==0)
      read = -1;
    wx.setStorageSync('booklist', newBooklist);
    wx.setStorageSync('read', read);
    this.setData({
      booklist: newBooklist,
      delectnum: 0,
      read: read,
      admin:false
    });
  },
  onRead:function(e){
    var id = e.currentTarget.dataset.id;
    if(id!=this.data.read){
      wx.setStorageSync('read', id);
      this.setData({
        read: id
      });
    }
    wx.navigateTo({
      url: '/pages/read/read'
    }) 
  },  
  onPullDownRefresh: function(e){
    wx.showNavigationBarLoading();
    var booklist = this.data.booklist
    var newBooklist = [];
    for(var i=0;i<booklist.length;i++){
      // for (var j = 0; j < booklist[i].chapter.length;j++)
      //   if (booklist[i].chapter[j].body)
      //     delete booklist[i].chapter[j].body;
      var newBook = {};
      newBook.chapterlength = booklist[i].chapter.length;
      newBook.webid = booklist[i]._id;
      newBook.url = booklist[i].url;
      newBooklist.push(newBook);
    }
    var _this = this;
    wx.request({
      url: app.adminUrl +"bookupdate",
      method:'POST',
      data: newBooklist,
      success:function(res){
        var array = res.data;
        for (var i = 0; i < array.length;i++){
          if (array[i].update>0){
            booklist[i].update = array[i].update + (booklist[i].update ? booklist[i].update:0);
            for (var s = 0; s < array[i].chapter.length;s++)
              booklist[i].chapter.push(array[i].chapter[s]);
          }
        }
        _this.setData({
          booklist: booklist,
        });
        wx.setStorageSync('booklist', booklist);
      },
      complete:function(e){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  }
})
