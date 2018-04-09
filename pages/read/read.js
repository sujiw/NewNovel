const app = getApp();
var saveScrollTop = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSet: false,
    loading:true,
    fontSize: 40,
    backgroundId:3,
    backgroundGroup: [
      ['262626', 'ede7da', '000000'],
      ['262626', 'e0ce9e', '000000'],
      ['262626', 'cddfcd', '000000'],
      ['262626', 'cfdde1', '000000'],
      ['262626', 'd0d0d0', '000000'],
      ['262626', 'ebcece', '000000'],
      ['666666', '0f1112', 'ffffff'],
    ],
    scrollTop:0,
  },
  onScroll:function(e){
    saveScrollTop = e.detail.scrollTop;
    // this.setData({
    //   saveScrollTop: e.detail.scrollTop
    // });
  },
  isSet: function(){
    var isset = this.data.isSet;
    this.setData({
      isSet: !isset
    });
  },
  setfontSize: function(e){
    var fontSize = e.detail.value;
    if (fontSize != this.data.fontSize) {
      wx.setStorageSync('fontSize', fontSize);
      this.setData({
        fontSize: fontSize
      });
    }
  },
  setBarColor:function(){
    var backgroundGroup = this.data.backgroundGroup;
    var backgroundId = this.data.backgroundId;
    wx.setNavigationBarColor({
      frontColor: '#' + backgroundGroup[backgroundId][2],
      backgroundColor: '#' + backgroundGroup[backgroundId][1],
    })
  },
  setBackground: function(e){
    var backgroundId = e.currentTarget.dataset.color;
    if (backgroundId != this.data.backgroundId){
      this.setData({
        backgroundId: backgroundId
      });
      wx.setStorageSync('backgroundId', backgroundId)
      this.setBarColor();
    }
  },
  HandleContent(chapterid){
    var booklist = this.data.booklist;
    var read = this.data.read;
    var scrollTop = 0;
    saveScrollTop = 0;
    if (!chapterid && chapterid!==0){
      booklist[read].chapterid = booklist[read].chapterid ? booklist[read].chapterid:0;
      scrollTop = booklist[read].chapter[booklist[read].chapterid].scrollTop;
      if (!scrollTop)
        scrollTop = 0;  
    }
    else
      booklist[read].chapterid = parseInt(chapterid);
    var title = booklist[read].chapter[booklist[read].chapterid].name;
    wx.setNavigationBarTitle({
      title: title,
    });

    this.setBarColor();
    this.setData({
      scrollTop: scrollTop
    });
    var _this = this;
    wx.request({
      url: app.adminUrl + 'newcontent',
      data: { webid: booklist[read]._id, url: booklist[read].chapter[booklist[read].chapterid].url },
      success: function (res) {
        var body = res.data.body.split("\n");
        body.unshift(title);
        if (res.data.state) {
          _this.setData({
            content: body
          })
        }
        else
          wx.showToast({
            title: res.data.msg,
          })
      }, complete: function () {
        _this.setData({
          loading: false
        })
      }
    })
  },
  chapterOpen:function(){
    wx.navigateTo({
      url: '/pages/chapter/chapter',
    })
  },
  onLoad: function (options) {
    var backgroundId = wx.getStorageSync('backgroundId');
    var fontSize = wx.getStorageSync('fontSize');
    var booklist = wx.getStorageSync('booklist');
    var read = wx.getStorageSync('read');
    if (!backgroundId)
      backgroundId = 0;
    if (!fontSize)
      fontSize = 40;
    this.setData({
      backgroundId: backgroundId,
      fontSize: fontSize,
      booklist: booklist,
      read: read
    });
    if (JSON.stringify(options) != '{}')
      this.HandleContent(options.id);
    else
      this.HandleContent()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  upperChapter: function (e) {
    var booklist = this.data.booklist;
    var read = this.data.read;
    var bookinfo = booklist[read];
    if (bookinfo.chapterid == 0){
      wx.showToast({
        title: '无章节',
      })
      return;
    }
    this.setData({
      loading: true
    })
    this.HandleContent(bookinfo.chapterid-1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  nextChapter: function (e) {
    var booklist = this.data.booklist;
    var read = this.data.read;
    var bookinfo = booklist[read];
    if (bookinfo.chapterid == bookinfo.chapter.length-1){
      wx.showToast({
        title: '无章节',
      })
      return;
    }
    this.setData({
      loading: true
    })
    this.HandleContent(bookinfo.chapterid + 1)
  },
  onUnload: function () {
    var booklist = this.data.booklist;
    var read = this.data.read;
    delete booklist[read].update;
    booklist[read].chapter[booklist[read].chapterid].scrollTop = saveScrollTop;
    wx.setStorageSync('booklist', booklist);
  },
  onHide: function () {
    this.onUnload();
  },
})