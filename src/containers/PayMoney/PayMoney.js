/**
 * Created by web前端 on 2017/10/14.
 */
/**
 * Created by web前端 on 2017/10/14.
 */
import React,{ Component } from 'react';
import './PayMoney.less';
import { Icon } from 'antd';
class PayMoney extends Component{
    render(){
        return (
            <div className="paymoney">
                <div className="paymoney-top">
                    <span className="paymoney-back">
                        <Icon type="left"/>
                    </span>
                    <span className="paymoney-pay">
                        支付订单
                    </span>
                </div>
            </div>
        )
    }
}
export default PayMoney;
