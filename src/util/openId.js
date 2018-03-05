/**
 * Created by web前端 on 2017/10/7.
 */

export function openId (param) {
    let userOpenId = param;
    let index = userOpenId.indexOf('=');
    return userOpenId.slice(index+1);
}