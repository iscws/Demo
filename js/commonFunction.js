//获取随机数
function random(minValue = 10, maxValue = 30) {
    // 通过最大值减去最小值然后加1得到取值的范围可能值的总数
    // 例如取2到10之间的整数，10-2 = 8
    var choices = maxValue - minValue;
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
                container.style.height = ar[index] + 'px';
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