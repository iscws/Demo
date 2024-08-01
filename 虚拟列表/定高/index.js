class VirtualList {
  constructor(container, list) {
    //设置内部参数情况
    this.state = {
      dataSource: [],
      itemHeight: 100,
      containerHeight: 0,
      maxShow: 0,
    };
    this.renderList = [];
    //动态样式
    this.dynamicStyle = {};
    //当前节点情况
    this.containerRef = document.querySelector(container);
    console.log(document.querySelector(container));
    this.itemListRef = document.querySelector(list);
    //当前初始索引以及视图内最后一个索引
    this.startIndex = 0;
    this.endIndex = 0;
    this.init();
  }

  init() {
    //首先实现初始化操作:获取元素高度并进行赋值
    this.state.containerHeight = this.containerRef.offsetHeight;

    this.state.maxShow =
      Math.ceil(this.state.containerHeight / this.state.itemHeight) + 1;
    //监听容器的滚动事件
    this.containerRef.addEventListener("scroll", this.onScroll.bind(this));

    this.addData();

    this.render();
    console.log("当前情况：", this);
  }
  computeEndIndex() {
    const end = this.state.maxShow + this.startIndex;
    this.endIndex = this.state.dataSource[end]
      ? end
      : this.state.dataSource.length;
  }

  computeRenderList() {
    this.state.renderList = this.state.dataSource.slice(
      this.startIndex,
      this.endIndex
    );
  }
  render() {
    this.computeEndIndex();
    this.computeRenderList();
    this.computedScrollStyle();

    this.itemListRef.innerHTML = "";
    this.state.renderList.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("item");
      itemElement.textContent = item;
      this.itemListRef.appendChild(itemElement);
    });
    console.log(this.dynamicStyle.height);
    this.itemListRef.style.height = this.dynamicStyle.height;
    this.itemListRef.style.transform = this.dynamicStyle.transform;
  }
  addData() {
    for (let i = 0; i < 20; i++) {
      this.state.dataSource.push(i);
    }
  }
  onScroll() {
    const scrollTop = this.containerRef.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.state.itemHeight);
    this.render();
  }
  computedScrollStyle() {
    const { dataSource, itemHeight } = this.state;
    this.dynamicStyle = {
      height: `${
        dataSource.length * itemHeight - this.startIndex * itemHeight
      }px`,
      transform: `translate3d(0, ${this.startIndex * itemHeight}px, 0)`,
    };
  }
}
