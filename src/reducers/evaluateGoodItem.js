/**
 * Created by web前端 on 2017/9/4.
 */

const initialState = {};
export default function evaluateGoodItem( state = initialState,action ) {
    switch (action.type){
        case "STORE_ORDER_DETAIL_ITEM":
            return action.itemData;
        default: return state;
    }
}