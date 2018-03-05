/**
 * Created by web前端 on 2017/9/14.
 */
const initialState = {};
export default function transferGoodToOrder( state = initialState,action ) {
    switch (action.type){
        case "TRANSFER_GOOD_DATA":
            return action.data;
        default: return state;
    }
}