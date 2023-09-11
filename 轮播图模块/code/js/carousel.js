// 非常粗糙的轮播图
class Carousel2 {
  //节流按钮
  static lock = true;
  static option = {
    // 插入位置
    node: "",
    //是否需要下按钮的位置，默认已有按钮
    circle: true,
    //左右按钮
    slider: true,
    //个数
    count: 5,
    // 自动播放 默认为打开
    autoplay: true,
    //数据来源
    data: "",
    //当前页面,默认为0
    curr: 1,
    //小圆圈的当前页面
    circleCurr: 0,
    //显示的列数，默认为3（第一个占据两列）
    display: 2,
    // 列宽
    rowWidth: 341,
    //过渡动画
    transition: "all 0.7s",
    //边距
    gap: "",
    // 每一列的边距
    margin: "",
  };
  constructor(options) {
    // this.option = Object.assign(Carousel2.option, options);
    this.option = { ...Carousel2.option, ...options };
    this.container = document.getElementById(this.option.node);
    this.imgContainer = this.container.querySelector(".caro-con");

    this.widthArr = [];

    if (this.option.circle === true) {
      this.circle = this.container.querySelector(".caro-cle-b");
    } else this.circle = document.getElementById(this.option.circle);

    if (this.option.slider) {
      this.nextBtn = this.container.querySelector(".caro-sli-next");
      this.lastBtn = this.container.querySelector(".caro-sli-last");
    }

    this.init();
  }

  init() {
    //处理一下列数
    this.initCount();
    // 将item添加到页面当中
    this.initCaro();
    // 处理数据
    // this.dealCaro();
    // 将底部小圆点添加到页面
    if (this.option.circle) {
      this.initCirle();
    }
    // 让轮播图动起来
    this.moveCaro();
  }
  initCount() {
    const dataArr = this.option.data;
    // 显示的列数
    if (dataArr.length > 3) this.option.display = 3;

    let display = this.option.display;
    // console.log(display);
    // console.log(dataArr);
    if (dataArr.length <= 2) this.option.count = 1;
    else this.option.count = Math.floor(dataArr.length / 3 + 1);

    // 当前所在列数，初始为0
    this.option.curr = display + 1;

    // 计算一下边距
    const width = this.option.width;
    const rowWidth = this.option.rowWidth;
    const margin = this.option.margin;
    this.option.gap = (width - (rowWidth * 3 + margin * 2)) / 2;
  }

  initCaro() {
    const display = this.option.display;
    // 过渡动画
    loadAnimate(`#${this.option.node}`, true, "center");
    // 关闭节流阀
    Carousel2.lock = false;
    //给盒子初始化宽度
    const conWidth = (this.option.count + 3) * this.option.width;
    this.imgContainer.style.width = conWidth + "px";

    // 总共的列数
    const length = this.option.data.length;

    const fragment = document.createDocumentFragment();
    for (let value of this.option.data) {
      fragment.appendChild(value);
    }
    // console.log(fragment);

    // 克隆节点，把对应节点放在头部和尾部
    let item = fragment.children[0].cloneNode(true);
    let i = 0,
      j = 0;
    while (i != display) {
      let item = fragment.children[i].cloneNode(true);
      // console.log(item);
      fragment.appendChild(item);

      i++;
    }
    // 放到尾部
    while (j != display + 1) {
      let item = fragment.children[length - 1].cloneNode(true);
      // console.log(item, fragment.children[0]);
      fragment.insertBefore(item, fragment.children[0]);
      j++;
    }

    for (let i = 0; i < fragment.children.length; i++) {
      let cName = fragment.children[i].className;
      if (cName === "bigbox")
        this.widthArr.push(this.option.rowWidth + this.option.margin);
      //如果碰到第一个盒子，则宽度是普通盒子的1/2
      else this.widthArr.push(this.option.rowWidth * 2 + 32);
    }

    // // 关闭动画
    loadAnimate(`#${this.option.node}`, false, "center");
    Carousel2.lock = true;

    this.imgContainer.appendChild(fragment);
    // 初始化
    this.imgContainer.style.transition = "none";
    clearOther(this.imgContainer, "trans");
    this.usualMove();
    setTimeout(() => {
      this.imgContainer.style.transition = this.option.transition;
      addAll(this.imgContainer, "trans");
    }, 700);
  }

  initCirle() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.option.count; i++) {
      let li = document.createElement("li");
      fragment.appendChild(li);
    }
    fragment.children[0].classList.add("current");
    this.circle.appendChild(fragment);
  }
  moveCaro() {
    if (this.option.circle) {
      for (let i = 0; i < this.option.count; i++) {
        //点击下方悬浮按钮
        this.circle.children[i].addEventListener("click", () => {
          this.moveCurr(i);
          this.option.circleCurr = i;
          this.goCar();
        });
      }
    }

    if (this.option.slider) {
      //点击左右按钮
      this.nextBtn.addEventListener("click", this.nextCar.bind(this));
      this.lastBtn.addEventListener("click", this.lastCar.bind(this));
    }
    if (this.option.autoplay) this.autoplayCaro();
  }

  // 把小圆圈与列数结合起来
  moveCurr(i) {
    this.option.curr = this.option.display + 1;
    let curr = this.option.curr;
    let allCon = this.imgContainer.children;

    for (let j = 0; j < i * 3; j++) {
      if (allCon[curr + j].classList.contains("firstbox")) {
        j++;
      }

      if (this.option.data.length < this.option.curr) {
        break;
      }
      this.option.curr++;
      // console.log('总共列数' + this.option.data.length, this.option.curr);
    }

    // 当页面滚动到最后一页,即将滚动回第一页
    if (this.option.circleCurr > this.option.count - 1) {
      this.option.curr += 3;
      // this.option.circleCurr = 0;
    }
    //当页面滚动到第一页之前
    if (this.option.circleCurr === -1) {
      this.option.curr = 1;
      // this.option.circleCurr = 0;
    }
  }
  //负责移动盒子的主要函数
  usualMove() {
    this.turnOpac();
    //获得每一个盒子
    let allCon = this.imgContainer.children;

    let middle = 0;

    if (this.option.curr === 1) {
      this.imgContainer.style.left =
        -(allCon[0].offsetWidth + this.option.margin - this.option.gap) + "px";
      return;
    }
    for (let i = 0; i < this.option.curr - 1; i++) {
      //357是每一列的宽度加上外边距this.option.margin
      //this.option.gap是边距

      middle += allCon[i].offsetWidth + this.option.margin;
      // console.log(allCon[i]);
      if (i + 1 === this.option.curr - 1) {
        middle +=
          allCon[i + 1].offsetWidth + this.option.margin - this.option.gap;
      }
    }

    this.imgContainer.style.left = -middle + "px";
    // console.log(this.option.curr);
    // this.imgContainer.style.transition = "ease 0.5s";
  }

  nextCar() {
    if (!Carousel2.lock) return;

    this.option.circleCurr++;
    this.moveCurr(this.option.circleCurr);

    //移动轮播图
    this.imgContainer.style.transition = this.option.transition;
    addAll(this.imgContainer, "trans");
    this.usualMove();

    //判断临界值
    if (this.option.circleCurr === this.option.count) {
      this.option.circleCurr = 0;
      // 调整列数
      this.option.curr = this.option.display + 1;
      setTimeout(() => {
        this.imgContainer.style.transition = "none";
        clearOther(this.imgContainer, "trans");
        this.usualMove();
      }, 700);
    }
    // 给小圆点添加效果
    if (this.option.circle) {
      clearOther(this.circle, "current");
      this.circle.children[this.option.circleCurr].className = "current";
    }
    Carousel2.lock = false;
    setTimeout(() => {
      Carousel2.lock = true;
    }, 700);
  }

  lastCar() {
    // console.log(1);
    if (!Carousel2.lock) return;

    this.option.circleCurr--;
    this.moveCurr(this.option.circleCurr);

    //移动轮播图
    this.imgContainer.style.transition = this.option.transition;
    addAll(this.imgContainer, "trans");
    this.usualMove();

    //判断临界值
    if (this.option.circleCurr === -1) {
      // 更新下方圆圈和当前页面的下标
      this.option.circleCurr = this.option.count - 1;
      // this.option.curr = this.option.count - 1;
      this.moveCurr(this.option.count - 1);
      //关闭动画
      setTimeout(() => {
        this.imgContainer.style.transition = "none";
        clearOther(this.imgContainer, "trans");
        this.usualMove();
      }, 700);
    }

    if (this.option.circle) {
      clearOther(this.circle, "current");
      this.circle.children[this.option.circleCurr].className = "current";
    }

    // 关锁
    Carousel2.lock = false;
    setTimeout(() => {
      Carousel2.lock = true;
    }, 700);
  }

  goCar() {
    if (!Carousel2.lock) return;

    this.imgContainer.style.transition = this.option.transition;
    addAll(this.imgContainer, "trans");

    if (this.option.circle) {
      clearOther(this.circle, "current");
      this.circle.children[this.option.circleCurr].className = "current";
    }

    this.usualMove();

    // 关锁
    Carousel2.lock = false;
    setTimeout(() => {
      Carousel2.lock = true;
    }, 700);
  }
  // 缩小和变透明函数
  turnOpac() {
    // 当前所在列数
    const curr = this.option.curr;

    let allCon = this.imgContainer.children;
    let leftCurr = curr;
    let rightCurr = curr;

    for (let i = 0; i < allCon.length; i++) {
      allCon[i].classList.remove("opacity-left");
      allCon[i].classList.remove("opacity-right");
    }
    // 需要移动的列数
    for (let i = 0; i < 2; i++) {
      if (allCon[curr + i].classList.contains("firstbox")) {
        i++;
      }
      rightCurr++;
    }

    // 给左侧和右侧添加变透明的类名
    for (let i = 0; i < leftCurr; i++) {
      allCon[i].classList.add("opacity-left");
    }
    for (let i = rightCurr + 1; i < allCon.length; i++) {
      allCon[i].classList.add("opacity-right");
    }
  }

  autoplayCaro() {
    let timer = setInterval(this.nextCar.bind(this), 2700);
    this.container.addEventListener("mouseenter", () => {
      clearInterval(timer);
      timer = null;
    });
    // 保证鼠标经过按钮时也不会重启定时器
    if (this.option.circle) {
      this.circle.addEventListener("mouseenter", () => {
        clearInterval(timer);
        timer = null;
      });

      this.circle.addEventListener("mouseleave", () => {
        clearInterval(timer);
        timer = setInterval(this.nextCar.bind(this), 2700);
      });
    }
    this.container.addEventListener("mouseleave", () => {
      // 先关掉定时器！！！！！！
      clearInterval(timer);
      timer = setInterval(this.nextCar.bind(this), 2700);
    });
  }
}

let num = 1;

// 轮播图数据处理
async function showdata(data, firstData, returnArr) {
  // 获取背景图片,title
  let { pcLargeImage, title, brief, brightPoints } = firstData;
  let firstbox = `
      <div class="FboxCon" style="background:url(${pcLargeImage}) no-repeat;">
          <div class="first-title">
                     ${title}
                  </div>
                  <div class="first-brief">
                      ${brief}
                  </div>
                  <div class="first-desc">
                      <ul>
                          <li>
                              ${brightPoints[0]}
                          </li>
                          <li>
                              ${brightPoints[1]}
                          </li>
                          <li>
                              ${brightPoints[2]}
                          </li>
                          <li>
                              ${brightPoints[3]}
                          </li>

                      </ul>
                  </div>

          </div>
      `;
  let div = document.createElement("div");
  div.className = "firstbox caro-item trans";
  div.insertAdjacentHTML("beforeend", firstbox);

  returnArr.push(div);

  let i = 0;
  while (i != data.length) {
    let div2 = document.createElement("div");
    div2.className = "bigbox caro-item trans";
    for (let j = 0; j < 2; j++) {
      // console.log(data[j]);
      // console.log(j);
      // console.log(i);
      if (i >= data.length) break;
      let box = `
              <div class="smallbox" style="background:url('${data[i].pcLargeImage}') no-repeat;">
                  <div class="small-title">

                      ${data[i].title}

                  </div>
                      <div class="small-brief">
                          ${data[i].brief}

                      </div>    
              </div>
              `;
      div2.insertAdjacentHTML("beforeend", box);
      i++;
    }

    returnArr.push(div2);
  }

  new Carousel2({
    // 放的位置
    node: "main-caro-list",
    // 限定的宽高
    width: 1200,
    height: 300,
    //图片列数
    count: returnArr.length,
    // 自动播放 默认为true
    autoplay: false,
    //数据来源
    data: returnArr,
    //每一列的宽度
    rowWidth: 341,
    //底部小圆圈的位置，默认是直接在盒子里查找
    circle: "main-caro-circle",
    margin: 16,
  });
}

async function appear() {
  let element = `
  <div id="container">
      <div class="main-caro-box">
        <div class="main-caro-list" id="main-caro-list">
          <ul class="caro-con"></ul>

          <div class="caro-sli-last">&lt;</div>
          <div class="caro-sli-next">&gt;</div>
        </div>

        <ol class="caro-cle-b" id="main-caro-circle"></ol>
      </div>
    </div>
  `;

  let returnArr = [];
  let {
    data: { data },
  } = await axios.get("http://43.139.230.42:8001/slider");

  let firstData = data.shift();

  // 控制数据的数量
  let addItem = data[data.length - 1];
  for (let i = 0; i < num; i++) {
    data.push(addItem);
  }
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);
  // data.push(addItem);

  document.querySelector(".area").innerHTML = element;

  showdata(data, firstData, returnArr);
}

async function addData() {
  num++;
  appear();
}

document.querySelector("#addbtn").addEventListener("click", addData);

appear();

axios({
  method: "post",
  url: "http://localhost:8080/login",
  data: {
    username: "node",
    password: "123456",
  },
}).then((response) => {
  console.log(response);
});
