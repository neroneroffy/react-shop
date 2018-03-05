/**
 * Created by web前端 on 2017/9/21.
 */
import React,{Component} from 'react';
import { Icon,Modal } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../../components/Loading/Loading';
import Logo from './logo.png';
import './MyOrderFormDetail.less';
import Timer from '../../components/Timer/Timer';
import GoodPayItem from'../../components/GoodPayItem/GoodPayItem';
import CancelOrder from '../../components/CancelOrder/CancelOrder';
import { get } from '../../fetch/get';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
class MyOrderFormContent extends Component{
    state={
        orderDetail:null,
        noMorePay:true,
        confirmLoading:false
    };
    componentDidMount(){
        this.setState({
            openId:openId(document.cookie)
        });
        //console.log(this.props.match.params.id);
        get(`${API}/order/gotodetail/${this.props.match.params.id}`).then( res=>{
            return res.json()
        }).then( data=>{
            console.log(data);
            if(data.orderDetailInfo.marketingStrategy){
                data.orderDetailInfo.marketingStrategy.rules = JSON.parse(data.orderDetailInfo.marketingStrategy.rules)
            }
            if( data.result){
                this.setState({
                    orderDetail:data.orderDetailInfo,
                },()=>{
                    console.log(this.state.orderDetail)
                })
            }
        });
/*
        get(`${API}/pay/prepay`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data)
        });

*/      document.body.scrollTop = 0;
    }
    storeEvaluteItem=()=>{
        sessionStorage.setItem('evaluateData',JSON.stringify(this.state.orderDetail))
    };
    componentWillUnmount(){
        this.props.storeOrderKey(sessionStorage.getItem('goBackKey'));
        //sessionStorage.clear();
        this.props.fatherMark();

    }
    componentDidUpdate(){
        sessionStorage.setItem("goBackKey",0);
        //sessionStorage.setItem("refreshData",JSON.stringify(this.state.orderDetail));

    }
    //点击取消订单
    cancelMyOrder=()=>{
        //console.log(this.refs.cancelOrder);
        this.refs.cancelOrder.cancelMyOrder()
    };
    //点击查看物流，存储据
    checkExpress=()=>{
        //console.log(this.state.orderDetail);
        sessionStorage.setItem('logisticsGoods',JSON.stringify(this.state.orderDetail.data))
    };
    //点击申请退款，存储据
    drawBack=()=>{
        sessionStorage.setItem('drawbackOrder',JSON.stringify(this.state.orderDetail))
    };
    goBack=()=>{
        //sessionStorage.clear();
        window.history.go(-1)
    };
    //点击付款存储数据
/*
    sessionData=()=>{
        sessionStorage.setItem('orderId',this.state.orderDetail.orderId)
    }
*/
    //点击确认收货
    confirmReceiving=()=>{
        this.setState({
            confirmLoading:true
        },()=>{
            get(`${API}/order/receive/${this.state.orderDetail.orderId}`).then(res=>{
                return res.json()
            }).then(data=>{
                if(data.result){
                    this.setState({
                        confirmLoading:false
                    },()=>{
                        Modal.success({
                            title: '提示',
                            content: '确认收货成功',
                            onOk:()=>{
                                window.location.reload()
                            }
                        });
                    });

                }
            })

        })
    };
    //点击付款
    payThis=()=>{
/*
        let payData={
            openId:openId(document.cookie),
            orderId:this.state.orderDetail.orderId
        };
*/
        //防止用户多次点击
        if(this.state.noMorePay){
            fetch(`${API}/pay/prepay?openid=${this.state.openId}?orderId=${this.state.orderDetail.orderId}`, {
                method: "get",
            });
            this.setState({
                noMorePay:false
            })
        }

    };

    render(){
        return (
            <div className="my-order-form-detail">
                <div className="order-detail-top">
                    <div className="order-detail-top-inner">
                        {/*to={"/membercenter/myorderform/"+sessionStorage.getItem('goBackKey')}*/}
                        <div className="go-back" onClick={this.goBack.bind(this)}>
                            <span>
                                <Icon type="left"/>
                            </span>
                            <span>
                                订单详情
                            </span>
                        </div>
                    </div>
                </div>
                {
                    this.state.orderDetail === null?
                        <div className="order-detail-loading"><Loading/></div>
                        :
                        <div className="order-detail-content">
                            <div className="order-detail-progress">
                                <div className="progress-inner">
                                    {
                                        this.state.orderDetail.status === "1"?
                                            <div className="remind">
                                                <span>等待买家付款</span><br/>
                                                <span>
                                                    剩
                                                    <Timer date={this.state.orderDetail.validity} timerStyle={{"color":"#fff","fontSize":"14px","display":"inline"}} second={false} minutes={false}/>
                                                    订单失效
                                                </span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "2"?
                                            <div className="remind">
                                                <span>买家已付款，等待发货</span><br/>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "3"?
                                            <div className="remind">
                                                <span>已发货，等待收货</span><br/>
                                                <span>
                                                    剩
                                                    <Timer date={this.state.orderDetail.date} timerStyle={{"color":"#fff","fontSize":"14px","display":"inline"}} second={false} minutes={false}/>
                                                    自动确认收货
                                                </span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "41"?
                                            <div className="remind">
                                                <span>退款处理中……</span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "42"?
                                            <div className="remind">
                                                <span>已完成退款</span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "51"?
                                            <div className="remind">
                                                <span>已收货，快去评价吧~</span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "52"?
                                            <div className="remind">
                                                <span>已收货，交易已完成</span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "61"?
                                            <div className="remind">
                                                <span>订单已取消</span>
                                            </div>:""
                                    }
                                    {
                                        this.state.orderDetail.status === "62"?
                                            <div className="remind">
                                                <span>超时未付款，自动关闭</span>
                                            </div>:""
                                    }

                                        <div className="order-code">
                                            <span>订单编号：</span><span>{this.state.orderDetail.code}</span>
                                        </div>
                                    {
                                        this.state.orderDetail.status === "1"?
                                            this.state.orderDetail.isGroupBuy === '1'?
                                                <div style={{'marginBottom':'10px'}}>
                                                    <Icon type="exclamation-circle-o" /><span style={{'marginLeft':'5px'}}>请尽快付款，以免未付款导致拼团失败</span>
                                                </div>
                                                :
                                                ""
                                            :
                                            ""
                                    }

                                </div>
                            </div>

                            <div className="order-detail-address">
                                <div>
                                    <Icon type="environment-o"/>
                                </div>
                                <div>
                                    <div className="consignee">
                                        <span>收货人：</span><span>{this.state.orderDetail.addressInfo.consignee}</span><span>{this.state.orderDetail.addressInfo.telephone}</span>
                                    </div>

                                    <div className="order-user-adress" >
                                        收货地址：{this.state.orderDetail.addressInfo.address}
                                    </div>

                                </div>
                            </div>
                            <div className="order-good-info">

                                    <div className="goodInfoInner">
                                        <div className="title">
                                            <span className="logo"><img src={Logo} alt=""/></span><span>宝宝的农场</span>
                                        </div>
                                        <div className="goodWrapper">

                                            {
                                                    this.state.orderDetail.data.map((item,index)=>{
                                                        return (
                                                            <GoodPayItem key={index} data={item} />
                                                        )
                                                    })
                                            }
                                        </div>
                                        <div className="order-detail-price-info">
                                            <div className="order-price-info">
                                                <span>商品总价</span> <span>¥ {this.state.orderDetail.goodsPrice.toFixed(2)}</span>
                                            </div>
                                            {
                                                this.state.orderDetail.coupon.price === undefined?
                                                    ""
                                                    :
                                                    <div className="order-price-info">
                                                        <span>优惠券</span> <span>-{this.state.orderDetail.coupon.price.toFixed(2)}</span>
                                                    </div>

                                            }
                                            {
                                                this.state.orderDetail.marketingStrategy?

                                                    this.state.orderDetail.marketingStrategy.strategyType === '1'?
                                                        <div className="order-price-info">
                                                            <span>订单满{this.state.orderDetail.marketingStrategy.rules.quota.toFixed(2)}</span> <span>-{this.state.orderDetail.marketingStrategy.rules.subtractSum.toFixed(2)}</span>
                                                        </div>
                                                        :
                                                        ""
                                                    :
                                                    ""

                                            }
                                            <div className="order-price-info">
                                                <span>物流</span><span>  <span className="order-express-name">{this.state.orderDetail.express.expressType}</span>¥ {this.state.orderDetail.express.charge.toFixed(2)}</span>
                                            </div>
                                            {
                                                this.state.orderDetail.remark?
                                                    <div className="order-remark">
                                                        <div>买家留言:</div>
                                                        <div>{this.state.orderDetail.remark}</div>
                                                    </div>
                                                    :
                                                    ""

                                            }

                                            {
                                                this.state.orderDetail.status === "1"?
                                                    <div className="order-price-info real-price">
                                                        <span>需付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "2"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "3"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "41"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "42"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "51"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "52"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "61"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                            {
                                                this.state.orderDetail.status === "62"?
                                                    <div className="order-price-info real-price">
                                                        <span>实付款</span> <span><span>¥</span> {this.state.orderDetail.orderPrice.toFixed(2)}</span>
                                                    </div>
                                                    :""
                                            }
                                        </div>

                                    </div>

                            </div>
                            <div className="order-bottom-operation">
                                {
                                    this.state.orderDetail.status === "1"?
                                        <div className="order-operation-inner">
                                            {
                                                this.state.orderDetail.isGroupBuy === '1'?
                                                    ""
                                                    :
                                                    <span className="order-detail-operation-button" onClick={this.cancelMyOrder.bind(this)}>
                                                        取消订单
                                                    </span>



                                            }
{/*
                                            <a className="order-detail-operation-button pay-my-order" href="./pay.html" onClick={this.sessionData.bind(this)}>付款</a>
*/}
{/*                                            <div onClick={this.payThis.bind(this)} className="order-detail-operation-button pay-my-order">
                                                付款
                                            </div>*/}
                                            <a href={`http://m.baobaofarm.com/eshop/pay/toPay?openId=${this.state.openId}&orderId=${this.state.orderDetail.orderId}`} className="order-detail-operation-button pay-this-order">
                                                付款
                                            </a>
{/*
                                            <Link to={"/pay/"+this.state.orderDetail.orderId} className="order-detail-operation-button pay-my-order">
                                                付款
                                            </Link>
*/}
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "2"?
                                        <div className="order-operation-inner">
                                            <Link to="/membercenter/drawback" className="order-detail-operation-button" onClick={this.drawBack.bind(this)}>
                                                申请退款
                                            </Link>
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "3"?
                                        <div className="order-operation-inner">
                                            <Link to="/membercenter/drawback" className="order-detail-operation-button" onClick={this.drawBack.bind(this)}>
                                                申请退款
                                            </Link>
                                            <Link to={"/membercenter/logistics/"+this.state.orderDetail.orderId} className="order-detail-operation-button" onClick={this.checkExpress.bind(this)}>
                                                查看物流
                                            </Link>
                                            <span className="order-detail-operation-button pay-my-order" onClick={this.confirmReceiving.bind(this)}>
                                                确认收货
                                            </span>
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "41"?
                                        <div className="order-operation-inner">
                                            <Link to="/index" className="order-detail-operation-button pay-my-order">
                                                返回首页
                                            </Link>
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "42"?
                                        <div className="order-operation-inner">
                                            <Link to="/index" className="order-detail-operation-button pay-my-order">
                                                返回首页
                                            </Link>
                                        </div>:""
                                }


                                {
                                    this.state.orderDetail.status === "51"?
                                        <div className="order-operation-inner">
                                            <Link to="/membercenter/evaluatelist" className="order-detail-operation-button pay-my-order" onClick={this.storeEvaluteItem.bind(this)}>
                                                评价商品
                                            </Link>
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "52"?
                                        <div className="order-operation-inner">
                                            <Link to="/index" className="order-detail-operation-button pay-my-order">
                                                返回首页
                                            </Link>
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "61"?
                                        <div className="order-operation-inner">
                                            <Link to="/index" className="order-detail-operation-button pay-my-order">
                                                返回首页
                                            </Link>
                                        </div>:""
                                }
                                {
                                    this.state.orderDetail.status === "62"?
                                        <div className="order-operation-inner">
                                            <Link to="/index" className="order-detail-operation-button pay-my-order">
                                                返回首页
                                            </Link>
                                        </div>:""
                                }

                            </div>
                            <CancelOrder ref="cancelOrder" cancelOrderId={this.state.orderDetail.orderId}/>
                            {
                                this.state.confirmLoading?
                                    <div className="submit-loading">
                                        <div>
                                            <Icon type="loading" />
                                        </div>
                                        <div>
                                            提交中……
                                        </div>
                                    </div>
                                    :
                                    ""
                            }

                        </div>

                }

            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
        goBackKey:state.orderKey,
        orderDetailData:state.orderDetail
    }
};
const mapDispatchToProps=(dispatch)=>{
    return {
        fatherMark(){
            dispatch({
                type:"CHILDREN_MARK"
            })
        },
        //将本页面停留的tab 的key值记录下来
        storeOrderKey(data){
           // console.log(data);
            dispatch({
                type:"STORE_ORDER_KEY",
                key:data
            })
        },

    }
};
export default connect(mapStateToProps,mapDispatchToProps)(MyOrderFormContent);