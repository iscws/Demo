// 将传递过来的对象转换成字符串
function resolveData(obj) {
    let arr = [];
    for (let k in obj) {
        let str = k + '=' + obj[k];
        arr.push(str);
    }
    return arr.join('&');
}
//对象转化为formdata数据
function objToFormdata(obj) {
    let formdata = new FormData();
    for (let k in obj) {
        formdata.append(k, obj[k]);
    }
    return formdata;
}



function myAjax(options) {
    let promise = new Promise((resolve, reject) => {
        // 不需要发送值则让data置空
        if (!options.data) options.data = '';
        if (!options.type) options.type = '';

        let qs = null;
        let xhr = new XMLHttpRequest();

        // 先转换为大写形式，方便判断
        let method = options.method.toUpperCase();
        let type = options.type.toUpperCase();

        //处理传输数据格式
        switch (type) {
            case 'JSON':
                qs = JSON.stringify(options.data);
                break;
            case 'FORMDATA':
                // 判断传入的是表单还是对象
                if (options.dataType && options.dataType == 'form')
                    qs = new FormData(options.data);

                else
                    qs = objToFormdata(options.data);

            default:
                qs = resolveData(options.data);
        };
        //判断是post还是Get
        switch (method) {
            case 'POST':
                xhr.open(method, options.url);
                // 如果是json格式则更换一下请求头
                if (type == 'JSON')
                    xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(qs);
                break;
            case 'GET':
                xhr.open(method, options.url + '?' + qs);
                // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send();

                break;
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    let result = JSON.parse(xhr.responseText);
                    resolve(result);
                } else {
                    reject(new Error("error"))
                }
            }
        }


    })

    return promise
}




// 封装一个登录查询的函数