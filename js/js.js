
var register = document.querySelector('.register');
var none = document.querySelector('.none');
// 定义一个开前门和关后门的变量 
var open = true;
var close = false;
register.addEventListener('mouseenter', function (e) {
    if (open) {
        // 开前门了就把后门关上
        close = false;
        none.className = '';
        none.className = 'in';

        var inbox = document.querySelector('.in');
        // 获取鼠标位置
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        inbox.style.left = x + 'px';
        inbox.style.top = y + 'px';


        // 任务做完了就把前门关上后门打开
        open = false;
        close = true;
    }
})
register.addEventListener('mouseleave', function (e) {
    if (close) {
        close = false;
        none.className = '';
        none.className = 'out';

        var outbox = document.querySelector('.out');
        // 获取鼠标位置
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        outbox.style.left = x + 'px';
        outbox.style.top = y + 'px';
        open = true;

    }

})