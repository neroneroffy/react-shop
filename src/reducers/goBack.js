/**
 * Created by web前端 on 2017/9/4.
 */

const initialState = {};
export default function goBack( state = initialState,action ) {
    switch (action.type){
        case "THIS_ADDRESS":
            return action.data;
        case "CLEAR_STORE":
            return action.data;
        default: return state;
    }
}
