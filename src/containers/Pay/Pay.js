/**
 * Created by web前端 on 2017/10/2.
 */
import React,{ Component } from 'react';
import './Pay.less';
import { get } from '../../fetch/get';
import { Icon, Modal } from 'antd';
import Loading from '../../components/Loading/Loading';
import { API } from '../../constants/API';
import wx from 'weixin-js-sdk';
import { openId } from '../../util/openId'
//const userOpenId = JSON.parse(openId(document.cookie));
class Pay extends Component{
    constructor(props){
        super(props);
        this.state={
            data:null,
            orderId:this.props.match.params.id,
            openId:openId(document.cookie),
            noMoreClick:true,
            timestamp:"",
            nonceStr:"",
            package:"",
            signType:"",
            paySign:""
        }
    }
    componentWillMount(){
        let payInfo = {
            openId:this.state.openId,
            orderId:this.state.orderId,
            payType:1,
            url:window.location.href
        };
        fetch(`${API}/pay/prepay`,{
            method:"POST",
            body:JSON.stringify(payInfo)
        }).then(res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                timestamp: data.prePayResult.timeStamp,
                nonceStr: data.prePayResult.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.prePayResult.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: data.prePayResult.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.prePayResult.paySign, // 支付签名
            });
            if(data.result){
                // window.location.pathname="/paysuccess";
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.prePayResult.appId, // 必填，公众号的唯一标识
                    timestamp:data.prePayResult.config_timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.prePayResult.config_nonceStr, // 必填，生成签名的随机串
                    signature: data.prePayResult.config_signature,// 必填，签名，见附录1
                    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        })

    }
    componentDidMount(){
        get(`${API}/orderpay/${this.state.orderId}`).then( res=>{
            return res.json()
        }).then(data =>{
            console.log(data)
            if(data.result){
                //const userOpenId = JSON.parse(openId(document.cookie));
                this.setState({
                    data:data.orderDetailInfo,
                })
            }
        })
    }
    wePay=()=>{

            let dataTest = {
                timestamp:this.state.timestamp,
                nonceStr: this.state.nonceStr, // 支付签名随机串，不长于 32 位
                package: this.state.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType:this.state.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: this.state.paySign, // 支付签名
            };
            alert(JSON.stringify(dataTest));
        wx.ready(function(){
            wx.chooseWXPay({
                timestamp: this.state.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: this.state.nonceStr, // 支付签名随机串，不长于 32 位
                package: this.state.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: this.state.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: this.state.paySign,// 支付签名
                success: function (res) {
                    alert('支付成功')
                    // 支付成功后的回调函数
                    window.location.hash = `/paysuccess/${this.state.orderId}`
                },
                fail: function (res) {
                    //print error info
                    console.log(res);
                }
            })
        });


    };
    balancePay=()=>{
        let payInfo = {
            openId:this.state.openId,
            orderId:this.state.orderId,
            payType:2
        };
        console.log(document.cookie)
        console.log(payInfo);
        if(this.state.noMoreClick){
            this.setState({
                noMoreClick:false
            });
            fetch(`${API}/pay/prepay`,{
                method:"POST",
                body:JSON.stringify(payInfo)
            }).then(res=>{
                return res.json()
            }).then(data=>{
                console.log(data);
                if(data.result){
                    window.location.hash=`/paysuccess/${this.state.orderId}`
                }else{
                    this.showConfirm()
                }
            })
        }

    };
    showConfirm=()=>{
        Modal.confirm({
            title: '付款失败，余额不足?',
            content: '是否充值？',
            onOk() {
                window.location.pathname=`/membercenter/recharge`
            },
            onCancel() {},
        });
    }
    goBack=()=>{
        window.history.go(-1)
    };
    render(){
        return (
            <div className="pay">
                <div className="pay-top">
                    <div className="pay-back" onClick={this.goBack.bind(this)}>
                        <Icon type="left"/>
                    </div>
                    <div className="pay-order">
                        支付订单
                    </div>
                </div>
                {
                    this.state.data === null?
                        <div className="pay-loading">
                            <Loading/>
                        </div>
                        :
                        <div className="pay-content">
                            <div className="pay-info">
                                <div className="pay-order-code">
                                    <span>订单编号</span>
                                    <span>{this.state.data.code}</span>
                                </div>
                                <div className="pay-order-price">
                                    <span>支付金额</span>
                                    <span><span>¥</span> {this.state.data.orderPrice} 元</span>
                                </div>

                            </div>
                            <div className="pay-my-order-button we-pay" onClick={this.wePay.bind(this)}>
                                微信支付
                            </div>
                            <div className="pay-my-order-button charge-pay" onClick={this.balancePay.bind(this)}>
                                余额支付
                            </div>
                        </div>
                }
            </div>
        )
    }
}
export default Pay