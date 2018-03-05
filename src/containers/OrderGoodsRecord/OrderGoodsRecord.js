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
import './OrderGoodsRecord.less';
class OrderGoodsRecord extends Component{
    constructor(props){
        super(props);
        this.state={
            data:null,
            noData:false,
            openId:openId(document.cookie)
        }
    }
    componentDidMount(){
        get(`/mock/orderGoods.json`).then(res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                data:data,
            });
            if(!data.result){
                this.setState({
                    noData:true
                })
            }
        })
    }
    render(){
        return (
            <div className="order-goods">
                <Link to="/membercenter/agency" className="order-goods-top">
                    <Icon type="left" />
                    <span>订货记录</span>
                </Link>
                <div className="order-goods">
                    {
                        this.state.data === null?
                            <div className="order-goods-loading">
                                <Loading/>
                            </div>
                            :
                            <div className="order-good-content">
                                {
                                    this.state.noData?
                                        <div className="order-goods-sorry">
                                            暂无数据
                                        </div>
                                        :
                                            this.state.data.result?
                                                this.state.data.data.map((item,index)=>{
                                                    return <Link to={`/membercenter/ordergoodsdetail/${item.id}`} key={index} className="order-good-item">
                                                                <div className="order-good-item-inner">
                                                                    <span>{item.orderGoodCode}</span>
                                                                    <span className="order-good-price">订单金额：<span>{item.orderGoodPrice.toFixed(2)}</span></span>
                                                                </div>
                                                                <div className="order-good-item-inner">
                                                                    <span>{item.orderGoodDate}</span>
                                                                    <span className="order-good-detail">点击查看详情</span>
                                                                </div>
                                                           </Link>
                                                })
                                                :
                                                <div>
                                                    {
                                                        this.state.data.data.map((item,index)=>{
                                                            return <Link to={`/membercenter/ordergoodsdetail/${item.id}`} key={index} className="order-good-item">
                                                                        <div className="order-good-item-inner">
                                                                            <span>{item.orderGoodCode}</span>
                                                                            <span className="order-good-price">订单金额：<span>{item.orderGoodPrice.toFixed(2)}</span></span>
                                                                        </div>
                                                                        <div className="order-good-item-inner">
                                                                            <span>{item.orderGoodDate}</span>
                                                                            <span className="order-good-detail">点击查看详情</span>
                                                                        </div>
                                                                   </Link>
                                                        })
                                                    }
                                                    <div className="order-goods-msg">
                                                        我是有底线的
                                                    </div>
                                                </div>
                                }
                            </div>
                    }
                </div>
            </div>
        )
    }
}
export default OrderGoodsRecord