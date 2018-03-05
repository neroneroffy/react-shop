/**
 * Created by web前端 on 2017/8/7.
 */
import 'whatwg-fetch';
import 'es6-promise';

/*
function transParams(obj){
    let result='';
    let item;
    for(item in obj){
        result += '?' + item + '=' + encodeURIComponent(obj[item]);
    }
    if(result){
        result = result.slice(1);
    }
    return result;
    console.log(result)
}
*/

export function post(url, paramsObj){
    let result = fetch(url,{
        method:'POST',
        mode:'cors',
        credentials:'include',
        headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:paramsObj
    });

    return result;
}
