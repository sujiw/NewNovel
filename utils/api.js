const adminUrl = "https://book.mdaogo.cn/index.php?g=api&m=book&a=";
function handleTitle(booklist) {
  for (var i = 0; i < booklist.length; i++) {
    if (booklist[i].title.length > 5)
      booklist[i]._title = booklist[i].title.substring(0, 5) + "..."
    else
      booklist[i]._title = booklist[i].title;
  }
  return booklist;
}
function getData(name, success, complete){
  wx.request({
    url: app.adminUrl + name,
    success: success,
    complete: complete
  })
}
module.exports = {
  handleTitle: handleTitle,
  getData: getData
}