/**
 * Created by web前端 on 2017/10/15.
 */
const initialState = {};
export default function cancelSuccess( state = initialState,action ) {
    switch (action.type){
        case "CANCEL_SUCCESS":
            return true;
        default: return state;
    }
}
