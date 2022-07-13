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
function loadAnimate(fatherbox, flag) {
    const container = document.getElementById(fatherbox);
    if (flag) {
        let box = `
         <div class="spinner">
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
    }
}

//排他思想
function clearOther(container, name) {
    let item = container.children;
    for (let i = 0; i < item.length; i++) {
        item[i].classList.remove(name);
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
        // 每页显示数据条数（必填）
        limit: 5,
        // 数据总数
        count: 10,
        // 当前页码（选填，默认为1）
        curr: 1,
        // 当前页前后两边可显示的页码个数（选填，默认为2）
        pageShow: 2,
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

            let item = `<ul class="list" page=${i + 1} style="width: 300px; height:200px"></ul>`;
            if (i == 0) item = `<ul class="list current" page=${i + 1} style="width: 300px; height:200px"></ul>`;
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
        this.conList[this.option.curr - 1].classList.add('current');

    }
}


