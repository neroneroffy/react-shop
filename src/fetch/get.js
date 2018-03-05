/**
 * Created by web前端 on 2017/8/7.
 */
import 'whatwg-fetch';
import 'es6-promise';
export function get(url,params){
    let result=fetch(url,{
        credentials:'include',
        mode:'cors',
        headers:{
            'Accept': 'application/json, text/plain, */*'
        },
        body:params
    })
    return result;
}