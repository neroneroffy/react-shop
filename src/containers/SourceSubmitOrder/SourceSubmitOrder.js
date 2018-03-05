/**
 * Created by web前端 on 2017/11/13.
 */
import React,{ Component } from 'react';
import './SourceSubmitOrder.less';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
class SourceSubmitOrder extends Component{
    constructor(props){
        super(props);
        this.state={
            goodInfo:JSON.parse(sessionStorage.getItem('goodInfo')),
            totalPrice:0
        }
    }
    componentWillMount(){

        let totalPrice = 0;
        for(let i=0;i<this.state.goodInfo.length;i++){
            totalPrice+=this.state.goodInfo[i].price*this.state.goodInfo[i].total
        }
        this.setState({
            totalPrice:totalPrice.toFixed(2)
        })
    }
    render(){
        return (
            <div className="source-submit-order">
                <div className="source-submit-order-top">
                    <Link to="/membercenter/sourceshopcart">
                        <Icon type="left"/>
                        <span>确认收货订单</span>
                    </Link>
                </div>
                <div className="source-submit-order-content">
                    <div className="source-address-info">
                        <div>请填写收货人姓名</div>
                        <input type="text" className="source-name"/>
                        <div>请填写收货人电话</div>
                        <input type="text" className="source-phone"/>
                        <div>请填写收货地址：</div>
                        <textarea className="source-address"></textarea>

                    </div>
                    <div className="source-good-info">
                        {
                            this.state.goodInfo.map((item,index)=>{
                                return (
                                    <div className="source-good-item" key={index}>
                                        <div className="source-good-img">
                                            <img src={item.listImage} alt=""/>
                                        </div>
                                        <div className="source-good-name">
                                            <div>{item.goodsName}</div>
                                            <div><Icon type="close" />{item.total}</div>
                                            <div>¥ {item.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="source-price-info">
                        <div className="source-price-item">
                            <span>折扣</span>
                            <span>9%</span>
                        </div>
                        <div className="source-price-item source-total-price">
                            <span>总价</span>
                            <span>¥ {this.state.totalPrice}</span>
                        </div>
                    </div>
                </div>
                <div className="source-bottom">
                    <div className="source-submit">去付款</div>
                </div>
            </div>
        )
    }
}
export default SourceSubmitOrder