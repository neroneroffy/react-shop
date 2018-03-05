/**
 * Created by web前端 on 2017/9/23.
 */
const initialState = {};
export default function orderKey( state = initialState,action ) {
    switch (action.type){
        case "STORE_ORDER_KEY":
            return action.key;
        default: return state;
    }
}