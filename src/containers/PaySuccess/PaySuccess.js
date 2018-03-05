/**
 * Created by web前端 on 2017/10/14.
 */
import React,{ Component } from 'react';
import './PaySuccess.less';
import { Icon } from 'antd';
import { API } from '../../constants/API';
import { get } from '../../fetch/get';
import Loading from '../../components/Loading/Loading';
import {Link} from 'react-router-dom';
class PaySuccess extends Component{
    constructor(props){
        super(props);
        this.state={
            orderDetail:null
        }
    }
    componentDidMount(){
        get(`${API}/order/gotodetail/${this.props.match.params.id}`).then( res=>{
            return res.json()
        }).then( data=>{
            console.log(data);
            if( data.result){
                this.setState({
                    orderDetail:data.orderDetailInfo
                })
            }

        });
    }
    render(){
        return (
            <div className="pay-success">
                {
                    this.state.orderDetail === null?
                        <div className="pay-success-loading">
                            <Loading/>
                        </div>
                        :
                        <div>
                            <div className="pay-success-top">
                                支付成功
                            </div>
                            <div className="pay-success-content">
                                <div className="pay-success-banner">
                                    <Icon type="check-circle" />
                                    <span>支付成功，您的包裹整装待发</span>
                                </div>
                                <div className="pay-success-info">
                                    <div className="pay-success-info-item">
                                        <span>收货人</span>
                                        <span><span>{this.state.orderDetail.addressInfo.consignee}</span><span>{this.state.orderDetail.addressInfo.telephone}</span></span>
                                    </div>
                                    <div className="pay-success-info-item">
                                        <span>收货地址</span>
                                        <span>{this.state.orderDetail.addressInfo.address}</span>
                                    </div>
                                    <div className="pay-success-info-item">
                                        <span>实付款</span>
                                        <span>{this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="pay-success-operation">
                                    <Link to={`/myorderformdetail/${this.props.match.params.id}`} className="pay-success-operation-item">
                                        订单详情
                                    </Link>
                                    <Link to={`/index`}  className="pay-success-operation-item">
                                        返回首页
                                    </Link>
                                </div>
                            </div>

                        </div>
                }

            </div>
            )
    }
}
export default PaySuccess