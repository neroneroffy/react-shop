/**
 * Created by web前端 on 2017/9/26.
 */
const initialState = {};
export default function mark( state = initialState,action ) {
    switch (action.type){
        case "STORE_ORDER_DETAIL":
            return action.detailData;
        default: return state;
    }
}