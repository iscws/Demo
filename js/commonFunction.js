//获取随机数
function random(minValue = 10, maxValue = 30) {
    // 通过最大值减去最小值然后加1得到取值的范围可能值的总数
    // 例如取2到10之间的整数，10-2 = 8
    let choices = maxValue - minValue;
    // 然后通过随机数乘以刚才的到的值，
    // 例如：Math.random() * 8，由于得到的是小于1的随机数，所以随机最大值0.99*8得到的数始终小于8
    // 然后使用floor方法向下取正得到的数最大值就是7，然后再加上最小值
    return Math.floor(Math.random() * choices + minValue);
}

function waterFall(ContainerName) {
    // 获取父元素
    let container = document.getElementById(ContainerName);
    //获取子元素；
    let item = document.getElementsByClassName('item');
    // 定义一个数组，存放元素的高度
    let ar = [];

    //获取每一行最多能存放的元素    
    // 浏览器宽度/元素宽度 向下取整
    let clientWidth = document.documentElement.clientWidth;
    let columnCount = Math.floor(clientWidth / item[0].offsetWidth);
    container.style.width = columnCount * item[0].offsetWidth + "px";

    // 添加一个for循环，选取高度最短的放到数组当中
    for (let i = 0; i < item.length; i++) {
        if (i < columnCount) {
            item[i].style.top = "0px";
            item[i].style.left = i * item[0].offsetWidth + "px";
            ar.push(item[i].offsetHeight);
        }

        else {
            // Math作为内置对象不能处理数组，可以用扩展运算符的方法转化格式
            let min = Math.min(...ar);
            // 通过indexOf得到高度最小元素的索引号
            let index = ar.indexOf(min);
            // 将元素放到该元素下方
            item[i].style.top = ar[index] + 'px';
            item[i].style.left = item[index].style.left;
            //将元素放到对应后需要重新找到高度最小的那一个
            ar[index] += item[i].offsetHeight;
            // 给父盒子添加一个高度
            if (i + 1 == item.length) {
                let max2 = Math.max(...ar);
                // 通过indexOf得到高度最大元素的索引号
                let indexMax = ar.indexOf(max2);
                container.style.height = ar[indexMax] + 'px';
            }
        }

    }
}

// 节流函数
function throttle(callback, delay) {
    let flag = true;
    return function () {
        if (flag) {
            flag = false;
            setTimeout(() => {
                callback();
                flag = true;
            }, delay)
        }

    }
}


//加载动画
function loadAnimate(fatherbox, flag, position = 'center') {
    const container = document.getElementById(fatherbox);
    container.classList.add('spinner-container');
    if (flag) {
        let box = `
         <div class="spinner spinner-${position}">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div> `

        container.insertAdjacentHTML('beforeend', box);
    }
    else {
        let box = container.querySelector('.spinner');
        box.remove();
        container.classList.remove('spinner-container');
    }
}

//排他思想
function clearOther(container, name) {
    let item = container.children;
    for (let i = 0; i < item.length; i++) {
        if (name) {
            item[i].classList.remove(name);
        }
        else {
            item[i].style.display = 'none';
        }
    }
}
// 利用promise：只有图片加载完毕才退出异步
function loadImg(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;

        img.onload = function () {
            resolve(img);
        };
        img.onerror = function (img) {
            reject('加载出错啦');

        };
    });

}

//分页模块
class Pages {
    // 默认配置
    static option = {
        //放入分页表的位置
        node: '',
        //页面的位置，
        container: '',
        // 每页显示数据条数（必填）
        limit: 5,
        // 数据总数
        count: 10,
        // 当前页码（选填，默认为1）
        curr: 1,
        // 当前页前后两边可显示的页码个数（选填，默认为2）
        pageShow: 2,
        //放入页面的数据
        data: '',

    }

    constructor(DataOptions) {
        //将默认数据和输入输入数据合并
        this.option = Object.assign(Pages.option, DataOptions);
        //插入位置
        this.node = document.getElementById(this.option.node);
        //页面位置
        this.container = document.getElementById(this.option.container);
        //获取对应节点
        this.list = this.node.querySelector('.main');
        this.nextBtn = this.node.querySelector('.next');
        this.pveBtn = this.node.querySelector('.last');

        // currArray代表目前出现的页码
        this.currArray = [];
        //初始化数据
        this.init();
        // this.showPages();

    }

    init() {
        //初始化数据
        this.showPage();
        //生成页面
        this.initCon();
        //初始化生成
        this.initPage();
        // 改变页数并触发事件
        this.changePage();
    }
    showPage() {
        this.currArray = [];
        const showOption = this.option;
        //第一种情况：当前页码还没到中间,处于左侧·
        if (showOption.curr < showOption.pageShow + 1) {
            for (let i = 1; i <= showOption.pageShow * 2 + 1; i++) {
                this.currArray.push(i);
            }
            //第二种情况：当前页码大于中间，处于右侧
        } else if (showOption.curr > showOption.count - showOption.pageShow) {
            for (let i = showOption.count - showOption.pageShow * 2; i <= showOption.count; i++) {
                this.currArray.push(i);
            }
        } else {
            for (let i = showOption.curr - showOption.pageShow; i <= showOption.curr + showOption.pageShow; i++) {
                this.currArray.push(i);
            }
        }

    }
    initCon() {
        console.log(this.option.count);
        for (let i = 0; i < this.option.count; i++) {

            let item = `<ul class="list" page=${i + 1} style="width: 300px; height:200px">${i + 1}</ul>`;
            if (i == 0) item = `<ul class="list current" page=${i + 1} style="width: 300px; height:200px">${i + 1}</ul>`;
            this.container.insertAdjacentHTML('beforeend', item);
        }

        this.conList = this.container.querySelectorAll('.list');

    }
    changePage() {

        let pageElement = this.node;
        //通过事件委派实现页码变化
        pageElement.addEventListener('click', (e) => {
            let target = e.target;
            if (target.tagName.toLowerCase() == 'li') {
                //让其他item样式去掉
                this.goPage(parseInt(target.innerHTML));
            }
            else if (target.classList.contains('next')) {
                this.nextPage();
            }
            else if (target.classList.contains('last')) {
                this.pvePage();
            }
        })
    }
    //初始化分页表，跳转页码的主要函数
    initPage() {
        // 让页码全部清空
        this.list.innerHTML = '';
        //消除所有页码的点击样式（排他思想）
        clearOther(this.list, 'current');

        //把当前要显示的页码添加到数组中 currArray
        this.showPage();
        //和页面相绑定
        this.changeCon();


        //判断下一页和上一页的按钮是否需要隐藏（第一页和最后一页需要隐藏）
        if (this.option.curr == 1) {
            changeBtnAllow(this.pveBtn, 'unique', false);
        }
        else if (this.option.count == this.option.curr) {
            changeBtnAllow(this.nextBtn, 'unique', false);
        }
        else {
            changeBtnAllow(this.pveBtn, 'unique', true);
            changeBtnAllow(this.nextBtn, 'unique', true);
        }

        // 通过循环将页码添加到页码当中
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.currArray.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = this.currArray[i];
            if (this.currArray[i] == this.option.curr)
                li.classList.add('current');
            fragment.appendChild(li);
        }
        this.list.append(fragment);
    }
    goPage(num) {
        this.option.curr = num;
        this.initPage();
    }
    pvePage() {
        this.option.curr--;
        this.initPage();

    }

    nextPage() {
        this.option.curr++;
        this.initPage();
    }

    changeCon() {
        clearOther(this.container, 'current');
        clearOther(this.container);
        this.conList[this.option.curr - 1].classList.add('current');
        this.conList[this.option.curr - 1].style.display = 'block';
    }
}
//变透明函数
function opacitybox(container) {
    // 先清除以前的定时器，只保留当前的一个定时器执行
    return new Promise(resolve => {
        clearInterval(container.timer);
        container.style.opacity = 0;
        let init = 0;
        let final = 100;
        //设置一个初始值100，每隔2ms减小以加快速度
        // var num = 0;
        container.timer = setInterval(() => {
            let step = 1 / final;
            if (final > 10)
                final--;
            if (init >= 1) {
                // 停止动画
                clearInterval(container.timer);
                resolve();
            }
            container.style.opacity = init + step;
            init += step;
        }, 2);
    })
}

//最简单的简单处理图片大小
function adaptImg(img, NeedH) {
    if (img.height > NeedH) {
        img.style.width = 100 + '%';
    }
    else {
        img.style.height = 100 + '%';
    }
}

//轮播图模块
class Carousel {
    //节流按钮
    static lock = true;
    static option = {
        // 插入位置
        node: '',
        //是否需要下按钮的位置，默认自带添加按钮
        circle: true,
        //左右按钮
        slider: true,
        // 限定的宽高
        width: 100,
        height: 100,
        //图片总数
        count: 5,
        // 自动播放 默认为否
        autoplay: false,
        //图片来源
        data: '',
        //当前页面,默认为0
        curr: 0,
        //小圆圈的当前页面
        circleCurr: 0,
    }
    constructor(options) {
        this.option = Object.assign(Carousel.option, options);
        this.container = document.getElementById(this.option.node);
        this.imgContainer = this.container.querySelector('.caro-con');
        if (this.option.circle) {
            this.circle = this.container.querySelector('.caro-cle-b');
        }

        if (this.option.slider) {
            this.nextBtn = this.container.querySelector('.caro-sli-next');
            this.lastBtn = this.container.querySelector('.caro-sli-last');
        }
        this.init();
    }

    init() {
        // 将图片添加到页面当中
        this.initCaro();
        // 将底部小圆点添加到页面
        this.initCirle();
        //让轮播图动起来
        this.moveCaro();

    }

    async initCaro() {
        console.log(this.container);

        loadAnimate(this.option.node, true, 'center');
        Carousel.lock = false;
        //给盒子初始化宽度
        const conWidth = (this.option.count + 1) * this.option.width;
        this.imgContainer.style.width = conWidth + 'px';
        this.imgContainer.style.transition = '0.5s ease';

        const fragment = document.createDocumentFragment();
        await Promise.all(this.option.data.map(async value => {
            let li = document.createElement('li');

            li.style.width = this.option.width + 'px';
            li.style.height = this.option.height + 'px';


            let img = await loadImg(value);
            //简单处理一下图片大小
            adaptImg(img, this.option.height);
            li.appendChild(img);

            fragment.appendChild(li);
        }))
        let item = fragment.children[0].cloneNode(true);
        fragment.appendChild(item);

        // 关闭动画
        loadAnimate(this.option.node, false, 'center');
        Carousel.lock = true;

        this.imgContainer.appendChild(fragment);


    }

    initCirle() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.option.count; i++) {
            let li = document.createElement('li');
            fragment.appendChild(li);
        }
        fragment.children[0].classList.add('current');
        this.circle.appendChild(fragment);
    }
    moveCaro() {
        for (let i = 0; i < this.option.count; i++) {
            //点击下方悬浮按钮
            this.circle.children[i].addEventListener('click', () => {
                this.option.curr = i;
                this.option.circleCurr = i;
                this.goCar();
            })
        }
        //点击左右按钮
        this.nextBtn.addEventListener('click', this.nextCar.bind(this));
        this.lastBtn.addEventListener('click', this.lastCar.bind(this));

        if (this.option.autoplay)
            this.autoplayCaro();
    }
    nextCar() {
        if (!Carousel.lock) return;
        this.option.curr++;
        this.option.circleCurr++;

        //移动轮播图
        this.imgContainer.style.left = -(this.option.curr) * this.option.width + 'px';
        this.imgContainer.style.transition = "ease 0.5s";
        //判断临界值
        if (this.option.curr == this.option.count) {
            this.option.circleCurr = 0;
            this.option.curr = 0;
            setTimeout(() => {
                this.imgContainer.style.transition = "none";
                this.imgContainer.style.left = 0;
            }, 500)
        }
        clearOther(this.circle, 'current');
        this.circle.children[this.option.circleCurr].className = 'current';

        // 关锁
        Carousel.lock = false;
        setTimeout(() => {
            Carousel.lock = true;
        }, 500);
    }

    lastCar() {
        if (!Carousel.lock) return;

        this.option.curr--;
        this.option.circleCurr--;
        // 页面从第一张到最后一张
        if (this.option.curr == -1) {
            //更新下方圆圈和当前页面的下标
            this.option.circleCurr = this.option.count - 1;
            this.option.curr = this.option.count - 1;

            //关闭动画
            this.imgContainer.style.transition = "none";
            //将容器移动至最后一张假图片
            this.imgContainer.style.left = -(this.option.count) * this.option.width + 'px';
            setTimeout(() => {
                this.imgContainer.style.left = -(this.option.curr) * this.option.width + 'px';
                this.imgContainer.style.transition = "ease 0.5s";

            }, 0)
        }
        else {
            this.imgContainer.style.transition = "ease 0.5s";
            this.imgContainer.style.left = -(this.option.curr) * this.option.width + 'px';
        }

        clearOther(this.circle, 'current');
        this.circle.children[this.option.circleCurr].className = 'current';

        // 关锁
        Carousel.lock = false;
        setTimeout(() => {
            Carousel.lock = true;
        }, 500);
    }

    goCar() {
        if (!Carousel.lock) return;
        clearOther(this.circle, 'current');
        this.circle.children[this.option.circleCurr].className = 'current';
        this.imgContainer.style.left = -(this.option.curr) * this.option.width + 'px';

        // 关锁
        Carousel.lock = false;
        setTimeout(() => {
            Carousel.lock = true;
        }, 500);
    }

    autoplayCaro() {
        let timer = setInterval(this.nextCar.bind(this), 2000);
        this.container.addEventListener('mouseenter', () => {
            clearInterval(timer);
            timer = null;

        })
        // 保证鼠标经过按钮时也不会重启定时器
        this.circle.addEventListener('mouseenter', () => {
            clearInterval(timer);
            timer = null;
        })
        this.container.addEventListener('mouseleave', () => {
            // 先关掉定时器！！！！！！
            clearInterval(timer);
            timer = setInterval(this.nextCar.bind(this), 1000)
        })
    }
}


