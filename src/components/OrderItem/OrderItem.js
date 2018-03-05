/**
 * Created by web前端 on 2017/9/16.
 */
import React,{ Component } from 'react';
import GoodPayItem from '../GoodPayItem/GoodPayItem';
import './OrderItem.less';

class OrderItem extends Component{
    state={

    };
    componentDidMount(){

    };
    render(){
        return (
            <div className="order-item">
                <div className="order-inner">
                    <div className="order-status">
                        <span className="check-order"></span>
                        <span>等待买家付款</span>
                    </div>
                    <div className="order-content">
                        <GoodPayItem/>
                    </div>
                </div>
             </div>
        )
    }
}
export default OrderItem;