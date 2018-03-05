/**
 * Created by web前端 on 2017/8/5.
 */

import createStore from 'react-redux'
export default function (){
    function counter(state=0,action){
        switch (action.type){
            case 'increase':
                return state+1;
            case 'decrease':
                return state=1;
            default:
                return state=1;

        }
    }
    let store = createStore(counter())
    store.subscribe(()=>{
        console.log(store.getState());
    })
    store.subscribe(()=>{
        console.log(store.getState());
    })
    store.dispatch({type:'increase'})
    store.dispatch({type:'decrease'})
    store.dispatch({type:'increase'})
}