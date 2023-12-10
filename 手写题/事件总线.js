// 手写一个事件总线
class Observer {
  constructor() {
    this.message = [];
    console.log("事件总线初始化");
  }

  on(type, callback) {
    if (!this.message[type]) {
      this.message[type] = [];
    }
    this.message[type].push(callback);
    // console.log("添加监听器");
  }

  off(type, callback) {
    if (!this.message[type]) return;
    if (!callback) {
      // 这里不采用delete方法也是考虑到,delete方法的性能要比直接赋undefined要多的多,
      //   this.message[type] = undefined;
      delete this.message[type];
    }
    this.message[type] = this.message[type].filter(
      (value) => value !== callback
    );
  }

  emit(type) {
    // 发布
    if (!this.message[type]) {
      return;
    }

    this.message[type].forEach((cb) => {
      cb();
    });
  }
}

// 使用构造函数创建一个实例
const person1 = new Observer();

// 向这个`person1`委托一些内容，调用`person1 `的`$ON`方法
person1.on("buy", handlerA);
person1.on("buy", handlerB);

person1.on("buy", handlerC);

person1.off("buy", handlerB);

function handlerA() {
  console.log("handlerA");
}

function handlerB() {
  console.log("handlerB");
}

function handlerC() {
  console.log("handlerC");
}

person1.emit("buy");
