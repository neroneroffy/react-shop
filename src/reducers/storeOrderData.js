/**
 * Created by web前端 on 2017/9/1.
 */

const initialState = {};
export default function storeOrderData( state = initialState,action ) {
    switch (action.type){
        case "STORE_ORDER_DATA":
            return action.data;
        default: return state;
    }
}
