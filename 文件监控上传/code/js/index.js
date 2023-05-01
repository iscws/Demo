const $ = document.getElementsByClassName.bind(document);
console.log($("preview")[0]);
// 将需要的dom元素保存起来
const doms = {
  img: $("preview")[0],
  container: $("upload")[0],
  select: $("upload-select")[0],
  selectFile: $("upload-input")[0],
  progress: $("upload-progress")[0],
  cancelBtn: $("upload-cancel")[0],
  delBtn: $("upload-del")[0],
};
const xhr = new XMLHttpRequest();

/**
 * 通过添加类名的形式，展示当前文件上传情况的css样式
 * @param {'progress'|'result'|'select'} areaName  progress:正在上传 ，result:上传结束 select：正在选择
 */
function showArea(areaName) {
  doms.container.className = `upload ${areaName}`;
}
/**
 * 传入进度数值，展示当前文件上传进度的css样式
 * @param {number} value 进度
 */
function setProgress(value) {
  doms.progress.style.setProperty("--percent", value);
}

// 对上传文件进行监控
doms.selectFile.onchange = function (e) {
  const file = e.target.files[0];
  // 1. 切换界面
  showArea("progress");
  // 使用filereader实现图片url预览
  const fileReader = new FileReader();
  // 获取缩略图url
  fileReader.readAsDataURL(file);

  fileReader.onload = (e) => {
    doms.img.src = e.target.result;
  };

  xhr.open("post", "http://localhost:9527/upload/single");
  const formData = new FormData();

  // 监听上传请求完成
  xhr.onload = (e) => {
    const body = JSON.parse(e.target.responseText);
    showArea("result");
    doms.img.scr = body.data;
  };

  // 进度置0
  setProgress(0);
  // 监听文件的上传过程
  xhr.upload.onprogress = (e) => {
    setProgress(Math.floor((e.loaded / e.total) * 100));
  };

  // 处理文件并发送
  formData.append("img", file);
  xhr.send(formData);
};

// 取消请求;
doms.cancelBtn.onclick = function (e) {
  console.log(111);
  xhr.abort();
  showArea("select");
  doms.img.src = "";
};
console.log(doms.cancelBtn.onClick);
