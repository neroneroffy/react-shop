import React,{ Component } from 'react';
import './TwoDimensionCode.less';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { get } from '../../fetch/get';
import wx from 'weixin-js-sdk';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
class TwoDimensionCode extends Component{
    state={
        twoDimensionCodeData:[],
        openId:openId(document.cookie),
        groupId:null
    };
    componentWillMount(){

            get(`${API}/weixin/fetchconfig?openId=${this.state.openId}&url=http://m.baobaofarm.com/?/membercenter/twodimensioncode`).then(res=>{
                return res.json()
            }).then(data=>{
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.objData.appId, // 必填，公众号的唯一标识
                    timestamp:data.objData.config_timestamp , // 必填，生成签名的时间戳
                    nonceStr: data.objData.config_nonceStr, // 必填，生成签名的随机串
                    signature: data.objData.config_signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.onMenuShareTimeline({
                    title: '成为农场主，和我一起赚钱吧', // 分享标题
                    link: data.objData.redirect_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: "http://m.baobaofarm.com/upload/ueditor/jsp/upload/image/20171108/1510111948370083142.jpg", // 分享图标
                    success: function () {
                        //alert('已分享')
                        //window.location.href = 'http://test.baobaofarm.com/'
                    },
                    cancel: function () {
                        //alert('已取消')
                        //window.location.href = 'http://test.baobaofarm.com/'
                    }
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: '成为农场主，和我一起赚钱吧', // 分享标题
                    desc: '邀请你成为农场主', // 分享描述
                    link: data.objData.redirect_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: "http://m.baobaofarm.com/upload/ueditor/jsp/upload/image/20171108/1510111948370083142.jpg", // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        //alert('已分享')
                        //window.location.href = 'http://test.baobaofarm.com/'
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //alert('已取消')
                        //window.location.href = 'http://test.baobaofarm.com/'
                    }
                });


            });
        get(`${API}/userinfo/${this.state.openId}`).then(res=>{
            return res.json()
        }).then(data=>{
            if(data.result){
                this.setState({
                    groupId:data.cookieModel.groupId
                });
            }
        })


    }

    render(){
        return (
            <div className="twodimensioncode">

                <div className="twodimensioncode-head">
                    <div className="twodimensioncode-head-inner">
                        {
                            this.state.groupId === null?
                                ""
                                :
                                this.state.groupId !==1?
                                    <Link to="/membercenter/myshop" className="twodimensioncode-back">
                                        <Icon type="left" />
                                        <span>返回</span>
                                    </Link>
                                    :
                                    ""
                        }
                    </div>
                </div>

                <div className="twodimensioncode-body-center-img">
                    <img src={`${API}/matrix/image/${this.state.openId}`} alt=""/>
                </div>

{/*                <div className="twodimensioncode-body">
                    <div className="twodimensioncode-body-top">
                        <div className="twodimensioncode-body-top-img"><img src={this.state.twoDimensionCodeData.img} alt=""/></div>
                        <div className="twodimensioncode-body-top-txt">
                            <div>我是 <span>{this.state.twoDimensionCodeData.name}</span> </div>
                            <div>我要为 <span>{this.state.twoDimensionCodeData.title}</span> 代言</div>
                        </div>
                    </div>

                    <div className="twodimensioncode-body-center">
                        <div className="twodimensioncode-body-center-txt">
                            <div className="twodimensioncode-body-center-txt-left">
                                <Link to="" >
                                    <Icon type="link" />
                                    <div className="">链接推广</div>
                                </Link>
                            </div>
                            <div className="twodimensioncode-body-center-txt-right">
                                <Link to="" >
                                    <Icon type="picture" />
                                    <div className="">图片推广</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>*/}

                <div className="twodimensioncode-foot">
                    <div className="twodimensioncode-foot-inner">
                        <div className="twodimensioncode-foot-top">如何挣钱</div>
                    </div>
                    <div className="twodimensioncode-foot-center">
                        <div className="twodimensioncode-foot-center-inner">
                            <div className="twodimensioncode-foot-center-div" >
                                <span>第一步</span>
                                <span>转发商品链接或商品图片给微信好友;</span>
                            </div>
                            <div className="twodimensioncode-foot-center-div">
                                <span>第二步</span>
                                <span>从您转发的链接或图片进入商城的好友，系统将自动锁定成为您的客户，他们在微信商城中购买任何商品，您都可以获得分销佣金；</span>
                            </div>
                            <div className="twodimensioncode-foot-center-div">
                                <span>第三步</span>
                                <span>您可以在农场旗舰店查看【我的团队】和【分销订单】，好友确认收货后佣金可提现。</span>
                            </div>
                            <div className="twodimensioncode-foot-bottom">
                                    <span>说明：分享后会带有独有的推荐码，您的好友访问之后，系统会自动检测并记录客户关系。
                                        如果您的好友已被其他人抢先发展成客户，他就不能成为您的客户，以最早发展成为客户为准</span>
                            </div>
                        </div>

                    </div>


                </div>


            </div>

        )
    }
}
export default TwoDimensionCode