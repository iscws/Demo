
let previous = null;
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];

// axios初始化
const instance = axios.create({
    baseURL: 'http://47.113.197.172:80/',
    // timeout: 5000,
    headers: {
        // 'Authorization': getToken(),
    }
})
function axiosHeaders() {
    if (loGet('userId') === null || loGet('userId') === 'null') {
        // console.log('还没登录');
        return '';
    }
    return {
        headers: {
            Authorization: loGet('token'),
        }
    }
}

// 实现无痛刷新token
instance.interceptors.response.use(response => {
    const { code } = response.data;
    return response;
}, reject => {
    // 如果没有用户登录则直接调用登录接口
    if (loGet('userId') === null) {
        $('.hd-login-btn').click();
        return Promise.reject(reject);
    }
    // 如果没有错误返回则直接返回错误
    if (!reject.response) return Promise.reject(reject);

    const { code, msg } = reject.response.data;
    // console.log(reject.response);
    if ((code === 0 || code === '0') && msg === '无身份验证信息或token过期失效') {
        // 获取配置信息
        let config = reject.response.config;
        if (!isRefreshing) {
            isRefreshing = true;
            console.log('token过期了');
            return refreshToken().then(token => {
                config.headers['Authorization'] = token;
                // 已经刷新了token，将所有队列中的请求进行重试
                requests.forEach(value => value(token));
                requests = []
                return instance(config);
            }).finally(() => {
                isRefreshing = false;
            })

        } else {
            // 正在刷新token，将返回一个未执行resolve的promise
            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests.push((token) => {

                    config = reject.response.config;
                    config.headers['Authorization'] = token;
                    resolve(instance(config))
                })
            })
        }

    }

    return Promise.reject(reject);
})


function getToken() {
    const token = window.localStorage.getItem('token')
    return token;
}

// 设置自定义属性
function setAttr(node, name, content) {
    node.setAttribute(name, content)
    return true;
}
// 读取自定义属性
function getAttr(node, name) {
    return node.getAttribute(name);
}
function $(className) {
    return document.querySelector(className);
}
function $all(className) {
    return document.querySelectorAll(className);
}
// 本地存储
function loSet(str, con) {
    window.localStorage.setItem(str, con)
    return true;
}
function loGet(str) {
    return window.localStorage.getItem(str);
}
function loRe(str) {
    window.localStorage.removeItem(str);
    return true;
}




function cacuDay(days, b = 'd') {
    b = b.toLowerCase();
    switch (b) {
        case 'h': num = 3600000;
            break
        case 'm': num = 60000;
            break
        case 'd': num = 86400000;
            break
        case 's': num = 1000;
            break
        default:
            num = 3600000;
    }
    return days * num;
}

function alert(str, callback, flag = true) {
    let container = $('.alert-item');
    container.style.display = 'block';
    container.innerHTML = str;
    if (flag) {
        setTimeout(() => {
            container.style.display = 'none';
            callback && callback();
        }, 3000)
    }
}
function sucess(str, callback) {
    let container = $('.success-item');
    let wordPos = $('.sus-word-pos');
    container.style.display = 'block';
    wordPos.innerHTML = str;
    setTimeout(() => {
        container.style.display = 'none';
        callback && callback();
    }, 2000)
}

function sure(item, callback) {

    const globalCon = $('.global-box');
    globalCon.classList.add('mask');
    const container = $('.sure-alert-box');
    const body = document.body;
    const cancelBtn = $('.sure-alert-cancel');
    clearOther(globalCon);

    const title = $('.sure-title');
    const brief = $('.sure-brief');

    title.innerHTML = item.title;
    brief.innerHTML = item.brief;

    globalCon.style.display = 'flex';
    container.style.display = 'block';
    body.classList.add('hiddenY');
    callback && callback();


    cancelBtn.addEventListener('click', () => {
        globalCon.style.display = 'none';
        body.classList.remove('hiddenY');
        globalCon.classList.remove('mask');

    })
}
// 检查获取过来是字符串还是节点
function checkName(node) {
    if (typeof node === 'string') {
        if (document.querySelectorAll(node).length > 1)
            return document.querySelectorAll(node);
        else
            return document.querySelector(node);
    }
    else
        return node;
}
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

//瀑布流
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
            callback();
            setTimeout(() => {
                flag = true;
            }, delay)
        }

    }
}


//加载动画
function loadAnimate(fatherbox, flag, position = 'center') {
    const container = checkName(fatherbox);
    container.classList.add('spinner-container');
    if (flag) {
        let box = `
         <div class="spinner spinner-${position}">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div> 
        
        `

        container.insertAdjacentHTML('beforeend', box);
    }
    else {
        let box = container.querySelector('.spinner');
        if (!box) return;
        box.remove();
        container.classList.remove('spinner-container');
    }
}

//排他思想
function clearOther(container, name) {
    container = checkName(container);
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

function addAll(container, name) {
    let item = container.children;
    for (let i = 0; i < item.length; i++) {
        if (name) {
            item[i].classList.add(name);
        }
        else {
            item[i].style.display = 'none';
        }
    }
}
// 利用promise：只有图片加载完毕才退出异步
function loadImg(src, size = '100%') {
    return new Promise((resolve, reject) => {
        let img = new Image(size);
        img.src = src;

        img.onload = function () {
            resolve(img);
        };
        img.onerror = function (img) {
            reject('加载出错啦');

        };
    });

}

//点击弹出下方栏，点击其他区域关闭 
function clickAppear(btn, tab, flag, callback) {
    btn = checkName(btn);
    tab = checkName(tab);

    let body = document.body;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // console.log(tab.style.display);
        // console.log(tab.style.display);
        if (callback === 'double') {
            if (tab.style.display === 'block') {
                tab.style.display = 'none';
                return;
            }
            else {
                // 这一步的目的是清除之前的
                body.click();
                tab.style.display = 'block';
                // btn.classList.add('appeared');
                return;
            }
        }
        tab.style.display = 'block';

        callback && callback();

    })

    document.addEventListener('click', (e) => {
        tab.style.display = 'none';
        // btn.classList.remove('appeared');

        if (callback === 'double') return;
        callback && callback();
    })

    // 点击tab区域不关闭盒子
    if (flag && flag === true) {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
        })
    }


}

// 点击input边框变色
function clickChangeColor(container, className, flag) {
    container = checkName(container);

    let input = null, box = null;

    if (flag && flag === true) {
        box = container;
        if (!box.querySelector('input')) input = box.querySelector('textarea');
        else input = box.querySelector('input');
    }
    // 如果直接传入一个input就直接改变input的边框颜色即可
    else {
        input = container;
        box = input;
    }

    input.addEventListener('focus', () => {
        box.classList.add(className);
    })
    input.addEventListener('blur', () => {
        box.classList.remove(className);
    })
}
//导航栏隐藏
function navHidden(container, height) {
    const header = checkName(container);

    document.addEventListener('scroll', throttle(() => {
        let pageY = window.pageYOffset;
        if (pageY >= height) {
            header.classList.add('moveY');
        }
        else
            header.classList.remove('moveY');
    }, 10))
}

//----------------- 让页面逐渐滚动到指定区域的函数--------
function animate_scroll(move_scrollbox, final, callback) {
    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(move_scrollbox.timer);
    move_scrollbox.timer = setInterval(function () {
        let step = (final - window.pageYOffset) / 10;
        if (step > 0)
            step = Math.ceil(step);
        else
            step = Math.floor(step);
        if (move_scrollbox.pageYOffset === final) {
            // 停止动画
            clearInterval(move_scrollbox.timer);
            callback && callback();
        }
        // 这个步长值为一个慢慢变小的值  步长公式：(目标值 - 现在的位置) / 10
        // obj.style.left = window.pageYOffset + step + 'px';
        window.scrollTo(0, window.pageYOffset + step);
    }, 10);
}

// 检查字数
function wordNumCheck(input, flag) {
    let inputBox = null;
    inputBox = checkName(input);

    input = inputBox.children[0];
    if (!inputBox.querySelector('.judge-num')) return false;
    let numBox = inputBox.querySelector('.judge-num');
    let num = input.getAttribute('maxlength');


    if (flag && flag === true) {
        numBox.innerHTML = `${input.value.length}/${num}`;
    }

    else {
        input.addEventListener('input', throttle(() => {
            numBox.innerHTML = `${input.value.length}/${num}`;
        }, 100))
    }
}
// 链接跳转
function hrefChange(className, url, flag = true, callback) {
    const btn = document.querySelectorAll(className);
    for (let i = 0; i < btn.length; i++) {
        // Location.href(url)
        btn[i].addEventListener('click', () => {
            callback && callback();
            // 链接跳转
            if (flag && flag === true)
                location.href = url;
            else
                window.open(url)
        })
    }
}

// 点击关闭盒子
function clickCancel(btn, container, callback) {
    container = checkName(container);
    btn = checkName(btn);
    btn.addEventListener('click', () => {
        container.remove();
        callback && callback();
    })
}

function clickNone(btn, container, callback,) {
    container = checkName(container);
    btn = checkName(btn);
    btn.addEventListener('click', () => {
        container.style.display = 'none';
        callback && callback();
    })
}

//打开全局栏里的东西
function globalContainer(startBtn, cancelBtn, container, callback) {
    startBtn = checkName(startBtn);
    cancelBtn = checkName(cancelBtn);
    container = checkName(container);


    const globalCon = document.querySelector('.global-box');
    const body = document.body;

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearOther(globalCon);
        globalCon.style.display = 'flex';
        setTimeout(() => {
            globalCon.classList.add('mask');
        }, 0)
        // console.log('damn');
        container.style.display = 'block';
        body.classList.add('hiddenY');
        // 添加从左侧滑入的效果
        if (container.className === 'user-note-box') {
            setTimeout(() => {
                $('.user-note').classList.add('move_in');
            }, 0)
        }
        callback && callback();
    })

    cancelBtn.addEventListener('click', () => {
        if (container.className === 'user-note-box') {
            $('.user-note').classList.remove('move_in');
            globalCon.classList.remove('mask');
            setTimeout(() => {
                globalCon.style.display = 'none';
                body.classList.remove('hiddenY');
            }, 300);
        }
        else {
            globalCon.classList.remove('mask');
            body.classList.remove('hiddenY');
            globalCon.style.display = 'none';

        }

    })
}

function globalCancel(cancelBtn, container, callback) {
    cancelBtn = checkName(cancelBtn);
    container = checkName(container);

    const globalCon = document.querySelector('.global-box');
    const body = document.body;

    cancelBtn.addEventListener('click', () => {
        globalCon.style.display = 'none';
        globalCon.classList.remove('mask');
        body.classList.remove('hiddenY');
    })
}

// 关闭placeholder
function closePlace(input, postBtn) {
    input = checkName(input);
    postBtn && (postBtn = checkName(postBtn));
    // 输入关闭placeholder
    input.addEventListener('input', () => {
        if (input.innerHTML != '')
            input.classList.remove('empty-input');
        else
            input.classList.add('empty-input');

    })

    input.addEventListener('keyup', throttle(() => {
        if (input.innerText != '' && input.innerText != ' \n') {
            if (postBtn) {
                postBtn.classList.remove('not-submit');
                postBtn.disabled = false;
            }
        }
        else {
            if (postBtn) {
                postBtn.classList.add('not-submit');
                postBtn.disabled = true;
            }
        }
    }, 200))
}
// 首页和搜索界面的导航栏上移
function navChange(height) {
    const header = $('.main-header-box');
    const nav = $('.main-view-nav');

    let flag = true;
    document.addEventListener('scroll', throttle(() => {

        let pageY = window.pageYOffset;

        if (pageY >= height) {
            if (flag) {
                flag = false;
                header.classList.add('moveY');
                nav.classList.add('moveT');

                flag = true;

            }

        }
        else {
            if (flag) {
                flag = false;
                header.classList.remove('moveY');
                nav.classList.remove('moveT');

                flag = true;

            }

        }
    }, 10))

}
// 返回图片地址
async function returnImgUrl(input) {
    input = checkName(input);

    let formData = new FormData();
    // 向 formData 对象中添加文件
    formData.append('picture', input.files[0]);


    let res = await instance.post('upload/picture', formData, {
        headers: {
            Authorization: loGet('token'),
        }
    })
    let { data: { data: { url: pictureUrl } } } = res;

    console.log(pictureUrl);
    return pictureUrl;

}


// 按下回车键
function enter(container, btn) {
    container = checkName(container);
    btn = checkName(btn);
    container.addEventListener('keydown', (e) => {
        if (e.keyCode === 13)
            btn.click();
    })
}

// 点击打开，再点击关闭
function doubleClickAppear(btn, container, callback, name = 'current') {
    btn = checkName(btn);
    container = checkName(container);


    btn.addEventListener('click', () => {
        if (btn.classList.contains(name)) {
            container.style.display = 'none';
            btn.classList.remove(name);
        }

        else {
            container.style.display = 'block';
            btn.classList.add(name);
        }

        callback && callback();
    })



}

function quitUser() {
    // loSet('islogin', '1');
    loRe('userName');
    loRe('userPsd');
    loRe('token');
    loRe('userId');
    loRe('userRole');
    // loRe('currId');
    loRe('userAvatar');
    loRe('userRole');
    loRe('deleteNote');
    loRe('watchMore');
    // localStorage.clear();
}

function refreshToken() {
    return new Promise((resolve, reject) => {
        // if (!loGet('userId')) reject('没有登录~');
        let params = {
            name: loGet('userName'),
            password: loGet('userPsd'),
        }
        instance.post('/user/login', params).then(res => {
            let { data: { token } } = res;
            loSet('token', token);
            console.log('刷新token完毕');
            resolve(token);
        })
    })
}


// 毫秒转成日期
function formatMsToDate(ms) {
    if (ms) {
        var oDate = new Date(ms),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay) + ' ' + addZero(oHour) + ':' +
                addZero(oMin) + ':' + addZero(oSen);
        return oTime;
    } else {
        return ""
    }
}

function addZero(num) {
    if (parseInt(num) < 10) {
        num = "0" + num
    }
    return num
}

function checkRes(res) {
    if (res === null)
        return '';
    else if (res === undefined)
        return 0;
}

function axiosUserInfo(id) {
    return instance.get(`/user/info/${id}`)
}

// 毫秒转为日期
function formatDuring(millisecond) {
    let days = parseInt(millisecond / (1000 * 60 * 60 * 24));
    let hours = parseInt((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = (millisecond % (1000 * 60)) / 1000;
    if (days > 30)
        return (days % 30) + '月前';
    else if (days > 0)
        return days + '天前';
    else if (hours > 0)
        return hours + '小时前';
    else if (minutes > 0)
        return minutes + '分钟前';
    else
        return '刚刚';
    // else if(hours===)    
    // return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
}

// 将日期转换为距离今天的天数
function timeChange(createTime) {
    let a = new Date(createTime).getTime();
    let b = new Date().getTime();
    let c = formatDuring(b - a);

    return c;
}

// 时间戳转换为日期
function formatDate(date) {
    main = date.slice(0, 10);
    time = date.slice(11, 16);

    main = new Date(main);
    let year = main.getFullYear();
    let month = main.getMonth() + 1;
    let days = main.getDate();

    return year + '年' + month + '月' + days + '日' + '&nbsp;&nbsp;' + time;
}

// 新建收藏夹页面和编辑页面的初始化
function starlistBtn(submitBtn, input) {
    // '.new-button-sure' '.starlist-name-input'
    submitBtn = $(submitBtn);
    input = $(input);
    window.addEventListener('keyup', throttle(() => {
        // console.log(input.value);
        if (input.value != '') {
            submitBtn.disabled = false;
            submitBtn.classList.remove('finished');
            submitBtn.classList.add('submit');
        }
        else {
            submitBtn.classList.remove('submit');
            submitBtn.classList.add('finished');
            submitBtn.disabled = true;
        }

    }, 300))
}

function avoidReload(callback) {

    document.addEventListener('keydown', (e) => {
        e = e || window.event;
        if (e.keyCode == 116) {//116 是f5按键代码
            callback();
        }
    })
    window.addEventListener('beforeunload', (e) => {
        // 鼠标右键的刷新
        e = e || window.event;
        callback();
        return true;
    })

}
// 加载
function clickLoad(callback) {
    window.addEventListener('load', () => {
        callback();
        previous = null;
    })
}

// 返回文章item
function indexItem(item) {
    // 关于稍后再看
    let watchWord = '稍后再看';
    let watchClass = '';

    if (checkWatchmore(item.id)) {
        watchWord = '取消稍后再看';
        watchClass = 'watched'
    }

    let isNote = 0;
    if (item.isNote && item.isNote == true) {
        isNote = 1;
    }

    let starlist = 'display:none';
    let watchafter = '';
    let isDelete = 'display:none';
    if (item.userId == loGet('userId')) isDelete = '';
    if (item.starlist === true && item.flag === true) { starlist = ''; watchafter = 'display:none' };
    if (item.isOrigin) console.log(1);
    let current = '';
    if (item.isLike) current = 'current';
    if (item.coverUrl === null) {
        return `                              
        <div class="item-container">
            <div class="item-base-info">
                <a href="javascript:;" class="item-user active" userId=${item.userId}>${item.name}</a>
                <div class="item-date">${item.createTime}</div>
                <div class="item-category active">${item.category}</div>

                <div class="cl-starlist-item" style=${starlist}>
                    <div class="cl-starlist-btn cl-starlist-move">
                        <i class="iconfont" style="font-size: 14px;">&#xe8f8;</i>
                        <span class="cl-words">转移</span>
                    </div>            
                    <div class="cl-starlist-btn cl-starlist-delete">
                        <i class="iconfont" style="font-size: 14px;">&#xe606;</i>
                        <span class="cl-words">删除</span>
                    </div>
              </div>

              <div class="cl-watchafter-item" style=${watchafter}>
                <span class="article-mote-btn" id="btn">...</span>
                <div class="cl-watchafter-list-box" style="display: none;">
                    <ul class="cl-watchafter-list">
                        <li class="watchafter-item watchafter-later ${watchClass}" articleid=${item.id} isNote=${isNote}>
                            <i class="iconfont">&#xe6c1;
                            </i>
                            <span class="watchafter-word">${watchWord}</span>
                        </li>


                        <li class="watchafter-item watchafter-delete"  articleId=${item.id} style=${isDelete}>
                            <i class="iconfont">&#xe606;</i>
                            <span class="watchafter-word">永久删除</span>
                        </li>

                    </ul>
                </div>
            </div>

            </div>
            <div class="item-content-info">
                <div class="item-content-main">
                    <div class="item-title">
                        <a href="javascript:;">${item.title}</a>
                    </div>
                    <div class="item-content">
                        <a href="javascript:;">${item.brief}</a>
                    </div>
                    <ul class="item-action-info">
                        <li class="item-view">
                            <i class="iconfont">&#xe63c;</i>
                            <span>1.0w</span>
                        </li>
                        <li class="item-like active ${current}" articleId=${item.id} userId=${item.userId}>
                            <i class="iconfont" style="font-size: 13px;">&#xe603;</i>
                            <span>${item.likeCount}</span>
                        </li>
                        <li class="item-comments active">
                            <i class="iconfont">&#xe669;</i>
                            <span>${item.commentCount}</span>
                        </li>
                    </ul>
                </div>
            </div>
        
        </div>
        `
    }
    return `                              
    <div class="item-container" >
        <div class="item-base-info">
            <a href="javascript:;" class="item-user active" userId=${item.userId}>${item.name}</a>
            <div class="item-date">${item.createTime}</div>
            <div class="item-category active">${item.category}</div>

            <div class="cl-starlist-item" style=${starlist}>
                <div class="cl-starlist-btn cl-starlist-move">
                    <i class="iconfont" style="font-size: 14px;">&#xe8f8;</i>
                    <span class="cl-words">转移</span>
                </div>            
                <div class="cl-starlist-btn cl-starlist-delete">
                    <i class="iconfont" style="font-size: 14px;">&#xe606;</i>
                    <span class="cl-words">删除</span>
                </div>
            </div>

            <div class="cl-watchafter-item" style=${watchafter}>
                <span class="article-mote-btn" id="btn">...</span>

                <div class="cl-watchafter-list-box" style="display: none;">
                    <ul class="cl-watchafter-list">
                        <li class="watchafter-item watchafter-later ${watchClass}" articleId=${item.id} isNote=${isNote}>
                            <i class="iconfont">&#xe6c1;
                            </i>
                            <span class="watchafter-word">${watchWord}</span>
                        </li>

                        <li class="watchafter-item watchafter-delete"   articleId=${item.id} style=${isDelete}>
                            <i class="iconfont">&#xe606;</i>
                            <span class="watchafter-word">永久删除</span>
                        </li>

                    </ul>
                </div>
            </div>

        </div>
        <div class="item-content-info">
            <div class="item-content-main">
                <div class="item-title">
                    <a href="javascript:;">${item.title}</a>
                </div>
                <div class="item-content">
                    <a href="javascript:;">${item.brief}</a>
                </div>
                <ul class="item-action-info">
                    <li class="item-view">
                        <i class="iconfont">&#xe63c;</i>
                        <span>1.0w</span>
                    </li>
                    <li class="item-like active ${current}" articleId=${item.id} userId=${item.userId}>
                        <i class="iconfont" style="font-size: 13px;">&#xe603;</i>
                        <span>${item.likeCount}</span>
                    </li>
                    <li class="item-comments active">
                        <i class="iconfont">&#xe669;</i>
                        <span>${item.commentCount}</span>
                    </li>
                </ul>
            </div>
            <img src="${item.coverUrl}" alt="" loading="lazy" onerror="this.src='error.png'">
        </div>
    
    </div>
    `
}

// 返回沸点的样式
function firepotItem(item) {
    item.createAt = timeChange(item.createAt);
    let label = '';
    let role = '';
    if (item.avatar === null || item.avatar === '') item.avatar = 'images/icon/avatar-null.png';
    if (item.label != null && item.label != '') label = `#<span class="label-item-pos">${item.label}</span>#&nbsp;&nbsp;&nbsp;`;
    if (item.comments === null) item.comments = {};

    if (item.isRole == 0) role = 'display:none';
    return `
    <div class="firepot-item-con">
        <div class="firepot-header">
            <div class="firepot-user">
                <div class="firepot-user-avat">
                    <img src=${item.avatar} alt="" onerror="this.src='error.png'">
                </div>
                <div class="firepot-user-info">
                    <div class="firepot-username">${item.name}</div>
                    <div class="firepot-date">${item.createAt}</div>
                </div>
            </div>
        </div>

        <div class="firepot-cont">
            <div class="firepot-cont-box">
            <span class="firepot-label">${label}</span>${item.content}
            </div>
        </div>

        <div class="firepot-images">
            <div class="firepot-img-box">
                <!-- <img src="images/test/test1.webp" alt="">
                <img src="images/test/test2.webp " alt="" onerror="this.src='error.png'"> -->
            </div>
        </div>

        <div class="firepot-middle-row">
            <div class="firepot-middle-box">
                <a href="javasript:;" class="club-advice-icon">
                    <i class="iconfont">&#xe7e8;</i>
                    <span>&nbsp;反馈 & 建议&nbsp;</span>
                    <i class="iconfont" style="font-size: 14px;">&#xe665;</i>
                </a>
            </div>
        </div>

        <div class="firepot-bottom-row">
            <div class="firepot-bottom-box">
                <div class="firepot-share-box">
                    <span class="iconfont">&#xe625;</span>
                    <span>分享</span>
                </div>
                <div class="firepot-comment-box reply-btn">
                    <span class="iconfont">&#xe669;</span>
                    <span class="firepot-comment-num">${Object.keys(item.comments).length}</span>
                </div>
                <div class="firepot-like-box">
                    <span class="iconfont">&#xe624; </span>
                    <span class="firepot-like-num">0</span>
                </div>
            </div>
        </div>

        <div class="firepot-comment-list reply-tab" style="display:none" >
            <div class="article-comment-formcon" style=${role}>
                <div class="article-formavatar-box">
                    <img src="${loGet('userAvatar')}"alt="" onerror="this.src='error.png'">
                </div>

                <div class="article-form-detail">
                    <div class="article-input">
                        <div contenteditable="true" spellcheck="false" class="article-input-area empty-input firepot-main-input" placeholder="输入评论" style="resize: none;">
                        </div>

                        <div class="article-imgbox">
                            <div class="comment-imgsrc" style="background-image: url(images/test/test1.webp
                            );">
                            </div>

                            <span class="comment-clear-btn">x</span>
                        </div>
                    </div>

                    <div class="article-form-actionbox">
                        <div class="emoji-btn">
                            <i class="iconfont"></i>
                            <span>表情</span>
                        </div>
                        <div class="image-btn" style="display:none">
                            <i class="iconfont"></i>
                            <span>图片</span>

                            <form action="" class="form-comment-img">
                                <input type="file" class="comment-img" name="picture" accept="image/jpg,image/png,image/gif">
                            </form>
                        </div>
                        <div class="article-form-submit">
                            <button class="post-comment-btn not-submit post-main-comment-btn" disabled="disabled">发表评论</button>
                        </div>
                    </div>
                </div>

            </div>

            <div class="article-comment-list" style="display:none">

            </div>

        </div>
    </div>
    `
}

// 沸点的整个回复框的初始化
function initPostBox(container, flag = true) {


    let postImg = container.querySelector('.comment-img');
    let commentInput = container.querySelector('.article-input-area');
    let postBtn = container.querySelector('.post-comment-btn');
    let inputBox = container.querySelector('.article-input');

    let cancelImgBtn = container.querySelector('.comment-clear-btn');
    let imgbox = container.querySelector('.article-imgbox');

    let imgBox = container.querySelector('.article-imgbox');
    let imgSrc = imgBox.querySelector('.comment-imgsrc');
    closePlace(commentInput, postBtn)

    // 边框颜色变化
    commentInput.addEventListener('focus', () => {
        commentInput.classList.add('bgc-white');
        inputBox.classList.add('bgc-white');

        inputBox.classList.add('border-blue');
    })

    commentInput.addEventListener('blur', () => {
        commentInput.classList.remove('bgc-white');
        inputBox.classList.remove('bgc-white');

        inputBox.classList.remove('border-blue');
    })


    if (flag === true) {
        // 添加图片
        postImg.addEventListener('change', async () => {
            let url = await returnImgUrl(postImg);
            imgBox.style.display = 'inline-block';
            imgSrc.style.backgroundImage = `url(${url})`;
        });

        // 删除图片
        clickCancel(cancelImgBtn, imgbox);
    }
}

// 把收藏夹名单晒出来
function deleteStarlist(userid, articleid) {
    articleid = Number(articleid);
    return new Promise(resolve => {
        instance.get(`/collect/detail/${userid}`).then(res => {
            // console.log('执行了n次');
            let arr = [];
            // console.log(res);
            let { data: { data } } = res;
            data.forEach(value => {
                let { id, article } = value;
                if (article === null) article = [{ article_id: -1 }];
                if (article.some(item => {
                    let { article_id } = item;
                    return (article_id === articleid)
                })) arr.push(id);

            })
            resolve(arr);
        })
    })
}

// 评论样式
function returnComment(item) {

    let deleteBtn = 'display:none';
    let pictureBtn = ``;
    if (item.userId === Number(loGet('userId'))) deleteBtn = '';
    if (item.pictureUrl === null) {
        pictureBtn = 'display:none';
        item.pictureUrl = 'images/icon/avatar-null.png';
    }
    if (item.replyCount === 0) item.replyCount = '回复';
    item.createTime = timeChange(item.createTime);

    if (item.level === 1 || item.level === 2)
        return `
    <div class="comment-user-avatar">
        <a href="javascript:;" class="to-user comment-avatar-box" userId=${item.userId} >
            <img src="${item.avatar}" alt="" onerror="this.src='error.png'">
        </a>
    </div>

    <div class="comment-content-box">
        <div class="comment-content-main">
            <span class="comment-delete" style=${deleteBtn}>删除</span>
            <div class="comment-user-box">
                <div class="comment-user">${item.name}</div>
                <img src="images/icon/jueyouLevel.svg" alt=""
                    class="coment-jueyou-icon" >
                <span class="comment-user-info">${item.job}</span>
                <time class="comment-time">${item.createTime}</time>
            </div>

            <div class="comment-cotent-detail">
                ${item.content}
            </div>

            <div class="comment-content-img" style="${pictureBtn}">
                <img src="${item.pictureUrl}" alt="" onerror="this.src='error.png'">
              
            </div>

            <div class="comment-action-box">
                <div class="comment-like-btn">
                    <i class="iconfont" style="font-size: 14px;">&#xe603;</i>
                    <span class="comment-like-num">0</span>
                </div>

                <div class="comment-post-btn">
                    <i class="iconfont">&#xe669;</i>
                    <span class="comment-post-num">${item.replyCount}</span>
                </div>
            </div>
        </div>


        <div class="comment-subcomment-wrap" >
            <div class="subcomment-post  article-form-detail">
                <div class="article-input">
                    <div contenteditable="true" spellcheck="false"
                        class="article-input-area empty-input" placeholder="输入评论"
                        style="resize: none;">
                    </div>

                    <div class="article-imgbox">
                        <div class="comment-imgsrc not-bgi" style="background-image: url(
                        );">
                        </div>

                        <span class="comment-clear-btn">x</span>
                    </div>
                </div>

                <div class="article-form-actionbox">
                    <div class="emoji-btn">
                        <i class="iconfont">&#xf2bb;</i>
                        <span>表情</span>
                    </div>
                    <div class="image-btn">
                        <i class="iconfont">&#xe605;</i>
                        <span>图片</span>

                        <form action="" class="form-comment-img">
                            <input type="file" class="comment-img" name="picture" accept="image/jpg,image/png,image/gif">
                        </form>
                    </div>
                    <div class="article-form-submit">
                        <button class="post-comment-btn not-submit"
                            disabled="disabled">发表评论</button>
                    </div>
                </div>
            </div>

            <div class="subcomment-list" style="display:none" level=${item.level}>
            </div>
        </div>
    </div>   `

    else
        return `
<div class="subcomment-item comment-item">
    <div class="comment-user-avatar">
        <a href="javascript:;" class="to-user comment-avatar-box" >
            <img src="${item.avatar}" alt="" userId=${item.userId} onerror="this.src='error.png'">
        </a>
    </div>
    <div class="comment-content-box">
        <div class="comment-content-main">
            <span class="comment-delete" style=${deleteBtn}>删除</span>
            <div class="comment-user-box">
                <div class="comment-user">${item.name}</div>
                <div class="subcomment-reply-hidden" style="display: none;">
                    <img src="images/icon/jueyouLevel.svg" alt="" class="coment-jueyou-icon">
                    <span class="comment-user-info">${item.job}</span>
                </div>
                <div class="subcomment-reply-visable">
                    <span class="sc-reply-title">回复</span>
                    <span class="sc-reply-user comment-user">
                       ${item.replyUser}</span>
                </div>
                <time class="comment-time">${item.createTime}</time>
            </div>
            <div class="comment-cotent-detail">
                ${item.content}
            </div>

            <div class="comment-content-img" style="${pictureBtn}">
            <img src="${item.pictureUrl}" alt="" onerror="this.src='error.png'">
          
            </div>

            <div class="subcomment-parent-wrapper">
                <div>"</div>
                <div class="sc-parent-cont">${item.replyContent}</div>
                <div>"</div>
            </div>
            <div class="comment-action-box">
                <div class="comment-like-btn">
                    <i class="iconfont" style="font-size: 14px;"></i>
                    <span class="comment-like-num">0</span>
                </div>
                <div class="comment-post-btn">
                    <i class="iconfont"></i>
                    <span class="comment-post-num">${item.replyCount}</span>
                </div>
            </div>
        </div>
        <div class="comment-subcomment-wrap">
            <div class="subcomment-post  article-form-detail">
                <div class="article-input">
                    <div contenteditable="true" spellcheck="false" class="article-input-area empty-input" placeholder="输入评论" style="resize: none;">
                    </div>
                    <div class="article-imgbox">
                        <div class="comment-imgsrc" style="background-image: url(images/test/test1.webp
                        );">
                        </div>
                        <span class="comment-clear-btn">x</span>
                    </div>
                </div>
                <div class="article-form-actionbox">
                    <div class="emoji-btn">
                        <i class="iconfont"></i>
                        <span>表情</span>
                    </div>
                    <div class="image-btn">
                        <i class="iconfont"></i>
                        <span>图片</span>
                        <form action="" class="form-comment-img">
                            <input type="file" class="comment-img" name="picture" accept="image/jpg,image/png,image/gif">
                        </form>
                    </div>
                    <div class="article-form-submit">
                        <button class="post-comment-btn not-submit" disabled="disabled">发表评论</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
    // if(item.level)
}

// 当用户没有文章时显示的盒子
function returnEmpty(text, imgSrc = 'images/icon/empty-img.svg') {
    return `
        <div class="empty-box">
        <img src="${imgSrc}" alt="" onerror="this.src='error.png'">
        <div class="empty-text">
            ${text}
        </div>
        </div>
`;
}


// 获取用户的所有收藏夹
function returnStarlistItem(item) {
    if (!item.isDefault)
        return `
    <a href="javascript:;">
    <div class="starlist-item-con">
        <div class="starlist-title-box">
            <span class="starlist-title">${item.name}</span>
            <i class="iconfont lock" style="display: none;">&#xe6c0;</i>
            <div class="default" style="display: none;">默认</div>
        </div>
        <div class="starlist-content-box"></div>
        <div class="starlit-footer-box">
            <div class="starlist-footer-left">
                <div class="last-time-box">
                    <span class="last-time">${item.updateAt}</span> 更新
                    ·
                </div>

                <div class="article-num-box">
                    <span class="article-num">${Object.keys(item.article).length}</span>篇文章
                </div>
            </div>
        </div>
    </div>
</a>
<div class="add-starlist-checkbox"></div>
`
    else
        return `
    <a href="javascript:;">
    <div class="starlist-item-con">
        <div class="starlist-title-box">
            <span class="starlist-title">${item.name}</span>
            <i class="iconfont lock" >&#xe6c0;</i>
            <div class="default" >默认</div>
        </div>
        <div class="starlist-content-box"></div>
        <div class="starlit-footer-box">
            <div class="starlist-footer-left">
                <div class="last-time-box">
                    <span class="last-time">${item.updateAt}</span> 更新
                    ·
                </div>

                <div class="article-num-box">
                    <span class="article-num">${Object.keys(item.article).length}</span>篇文章
                </div>
            </div>
        </div>
    </div>
    </a>
    <div class="add-starlist-checkbox"></div>
    `
}


function addComment(list, container) {
    // console.log(container);
    container = checkName(container);
    // let subLevel = level;
    const fragment = document.createDocumentFragment();
    if ((list.length === 0 || list === null)) {
        container.innerHTML = returnEmpty('快来评论吧');
        // $('.comment-num').innerHTML = 0;
        return;
    }

    list.forEach(item => {
        let { id, comment, userInfo: { user_id, name, avatar } } = item;
        let job = '';
        // console.log(articleId, createTime);
        let div = document.createElement('div');
        div.className = 'comment-item';
        setAttr(div, 'commentId', id);
        setAttr(div, 'userId', user_id);

        div.innerHTML = returnComment({
            id: id,
            createTime: '5分钟前',
            pictureUrl: null,
            name: name,
            avatar: avatar,
            job: job,
            content: comment,
            replyCount: 0,
            userId: user_id,
            level: 1,
        })
        // getInfo(container, commentId)
        initFireComment(div);
        fragment.appendChild(div);


    })

    // 初始化方法
    // new clubComment(div);
    container.appendChild(fragment);
}


// 给沸点评论添加点击事件
function initFireComment(container) {
    let avatar = container.querySelector('.comment-avatar-box');
    let name = container.querySelector('.comment-user');
    let id = getAttr(container, 'userid');

    avatar.addEventListener('click', () => {
        loSet('currId', id);
        window.open('user.html');
    })
    name.addEventListener('click', () => {
        avatar.click();
    })
}

function returnNoteItem(item) {
    // let favorited = '';
    // if (item.isStar) favorited = 'favorited';
    if (item.delete && item.delete === 1) item.updateTime;
    else
        item.updateTime = formatDate(item.updateTime);

    let favorited = '星标';
    if (item.isStar) favorited = '取消星标'

    let dropdownlist = `
    <li class="note-dropdown-option dropdown-star">
        <i class="iconfont"></i>
        <span class="dropdown-word">${favorited}</span>
    </li>
    <li class="note-dropdown-option dropdown-edit">
        <i class="iconfont"></i>
        <span class="dropdown-word">编辑</span>
    </li>
    <li class="note-dropdown-option dropdown-delete">
        <i class="iconfont"></i>
        <span class="dropdown-word">删除</span>
    </li>
    `

    if (item.delete === 1) {
        dropdownlist = `
        <li class="note-dropdown-option dropdown-recover">
            <i class="iconfont"></i>
            <span class="dropdown-word">还原</span>
        </li>
        <li class="note-dropdown-option dropdown-delete">
            <i class="iconfont"></i>
            <span class="dropdown-word">彻底删除</span>
         </li>

        `
    }
    let res =
        `
    <div class="note-item-time">${item.updateTime}</div>
    <div class="note-item-body">
        <div class="note-item-title">${item.title}</div>
        <div class="note-item-cont">${item.content}</div>
    </div>

    <div class="note-item-meta">
        <div class="note-meta-label">
            <ul class="note-meta-tags">
            </ul>
        </div>

        <div class="note-meta-action">
            <span class="note-meta-more">
                ...
            </span>

            <div class="note-meta-dropdown" style="display: none;">
                <ul class="note-dropdown-list">
                    ${dropdownlist}
                </ul>
            </div>
        </div>
    </div>`

    return res;
}

// 添加稍后再看
function addWatchmore(id) {


    let list = JSON.parse(loGet('watchMore'));
    list.data.unshift(id);

    loSet('watchMore', JSON.stringify(list));
    sucess('添加成功');

}

function cancelWatchmore(id) {
    let list = JSON.parse(loGet('watchMore'));
    let data = list.data;
    data.some((value, index) => {
        console.log(value);
        if (value == id) {
            list.data.splice(index, 1);
            return true;
        }
    })
    console.log(list.data);
    loSet('watchMore', JSON.stringify(list));
    sucess('取消成功');
}

function checkWatchmore(id) {
    if (loGet('watchMore') === null) return false;
    let list = JSON.parse(loGet('watchMore'));
    let data = list.data;
    // if()

    if (data.length === 0) return false;

    return data.some(value => (value == id));
}