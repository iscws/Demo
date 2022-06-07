// 将传递过来的对象转换成字符串
function resolveData(obj) {
    let arr = [];
    for (let k in obj) {
        let str = k + '=' + obj[k];
        arr.push(str);
    }
    return arr.join('&');
}


function ajax(options) {
    let qs = null;
    isSending = true;
    let xhr = new XMLHttpRequest();
    //将要发送的对象转化为字符串
    if (options.type == 'formdata') {
        qs = new FormData(options.data);
    }
    else if (options.type.toUpperCase() == 'JSON') {
        qs = JSON.stringify(options.data);

    }
    else
        qs = resolveData(options.data);

    //判断是get类型还是post类型
    if (options.method.toUpperCase() === 'GET') {
        // 发起GET请求
        xhr.open(options.method, options.url + '?' + qs);
        xhr.send();
    } else if (options.method.toUpperCase() === 'POST') {
        // 发起POST请求
        xhr.open(options.method, options.url);
        // 如果是json格式需要更改请求头
        if (options.type.toUpperCase() == 'JSON')
            xhr.setRequestHeader('Content-Type', 'application/json'); xhr.send(qs);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // if (isSending) xhr.abort();
            let result = JSON.parse(xhr.responseText);
            options.success(result);
        }
    }

}
