/**
 * Created by web前端 on 2017/10/10.
 */
const initialState = {};
export default function addressId( state = initialState,action ) {
    switch (action.type){
        case "ADDRESS_ID":
            return action.data;
        default: return state;
    }
}
