import * as ajax from './ajax.js'
const url = 'http://175.178.51.126:8091';


async function getDirary(uid) {
    let res = await ajax.myAjax({
        url: url + '/smallA/selectAllDiary',
        method: 'post',
        type: 'json',
        data: {
            uid: 206,
        }
    });
    return res;

}

export { getDirary };