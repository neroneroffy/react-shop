/**
 * Created by web前端 on 2017/9/27.
 */
const initialState = {};
export default function transferGoodToOrder( state = initialState,action ) {
    switch (action.type){
        case "SINGLE_GOOD_EVALUATE":
            return action.data;
        default: return state;
    }
}