                       /**
 * Created by web前端 on 2017/8/7.
 */
import { combineReducers } from 'redux';
import storeOrderData from './storeOrderData';
import goBack from './goBack';
import transferGoodToOrder from './transferGoodToOrder';
import orderKey from './orderKey';
import mark from './mark';
import orderDetail from './orderDetail';
import evaluateGoodItem from './evaluateGoodItem';
import singleGoodEvaluate from './singleGoodEvaluate';
import addressId from './addressId';
import cancelSuccess from './cancelSuccess';


const rootReducer = combineReducers({
    storeOrderData,
    goBack,
    transferGoodToOrder,
    orderKey,
    mark,
    orderDetail,
    evaluateGoodItem,
    singleGoodEvaluate,
    addressId,
    cancelSuccess
});

export default rootReducer