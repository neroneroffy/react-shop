/**
 * Created by web前端 on 2017/11/6.
 */
import React,{ Component } from 'react';
import { get } from '../../fetch/get';
import { openId } from '../../util/openId';
import { API } from '../../constants/API';
import Loading from '../../components/Loading/Loading';
import { Icon } from 'antd'
import { Link } from 'react-router-dom';
import './OrderGoodDetail.less';
class OrderGoodDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            data:null
        }
    }
    componentDidMount(){
        get(`/mock/orderGoodDetail${this.props.match.params.id}.json`).then(res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                data:data
            })
        })
    }
    render(){
        return (
            <div className="order-good-detail">
                {
                    this.state.data === null?
                        <div className="order-good-loading">
                            <Loading/>
                        </div>
                        :
                        <div>
                            <Link to="/membercenter/ordergoodsrecord" className="order-detail-back">
                                <Icon type="left" />
                                <span>订货详情</span>
                            </Link>
                            <div className="order-good-detail-content">
                                <div className="order-good-detail-content-top">
                                    订货单编号：{this.state.data.data.code}
                                </div>
                                <div className="order-good-detail-userinfo">
                                    <div>
                                        <div className="detail-userinfo-top">
                                            <span>{this.state.data.data.memberInfo.name}</span>
                                            <span>{this.state.data.data.memberInfo.phone}</span>
                                        </div>
                                        <div className="detail-userinfo-address">{this.state.data.data.memberInfo.address}</div>
                                    </div>
                                </div>
                                <div className="order-good-goodInfo">
                                    <div>
                                        {
                                            this.state.data.data.goodInfo.map((item,index)=>{
                                                return (
                                                    <div className="order-good-goodInfo-good-item" key={index}>
                                                        <div className="order-good-item-img">
                                                            <img src={item.photo} alt="图片走丢了"/>
                                                        </div>
                                                        <div className="order-good-item-goodinfo">
                                                            <div className="order-good-name">{item.goodName}</div>
                                                            <div className="order-good-count">数量：{item.num}</div>
                                                            <div className="order-good-price">价格：<span>¥{item.goodPrice.toFixed(2)}</span></div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                                <div className="order-good-price-info">
                                    {
                                        this.state.data.data.discountInfo?
                                            <div className="order-good-price-info-item">
                                                <span>代理商折扣</span>
                                                <span>
                                                    {this.state.data.data.discountInfo}
                                                </span>
                                            </div>
                                            :
                                            ""
                                    }

                                    <div className="order-good-price-info-item">
                                        <span>实付款</span>
                                        <span className="order-good-price-info-item-price">¥{this.state.data.data.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                }
            </div>
        )
    }
}
export default OrderGoodDetail