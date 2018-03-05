/**
 * Created by web前端 on 2017/9/23.
 */
const initialState = {};
export default function mark( state = initialState,action ) {
    switch (action.type){
        case "FATHER_MARK":
            return 1;
        case "CHILDREN_MARK":
            return 2;
        default: return state;
    }
}