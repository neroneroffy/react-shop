/**
 * Created by web前端 on 2017/11/15.
 */
import React,{Component} from 'react';
import "./GetCoupon.less";
import couponEvnlope from './coupon4.png';
import couponEvnlopeOpen from './coupon2.png';
import couponEvnlopeTop from './coupon5.png';
import coupon from './coupon3.png';
import baby from './wawa.png';
import code from './code.jpg';
import { Icon,Modal } from 'antd';
import { openId } from '../../util/openId';
import { Link } from 'react-router-dom';
import { get } from '../../fetch/get';
import {API} from '../../constants/API';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
class GetCoupon extends Component{
    constructor(props){
        super(props);
        this.state={
            openId:openId(document.cookie),
            open:false,
            couponSlide:false,
            babyShow:false,
            submitLoading:false
        }
    };
    componentWillMount(){
        if(localStorage.getItem('hasBeenGet')){
            Modal.warning({
                content: (
                    <div>
                        您已经领取过啦~去首页逛逛吧~
                    </div>
                ),
                onOk() {
                    window.location.hash = '#/index/0'
                },
                okText:"去首页"
            });
        }
    }
    open=()=>{

        this.setState({
            submitLoading:true
        },()=>{
            if(this.state.submitLoading){
                get(`${API}/sendCoupon/${this.state.openId}`)
                    .then(res=>{
                        return res.json()
                    }).then(data=>{
                    if(data.result){
                        this.setState({
                            open:true,
                            submitLoading:false
                        },()=>{
                            localStorage.setItem("hasBeenGet",true);
                            window.setTimeout(()=>{
                                this.setState({
                                    couponSlide:true
                                },()=>{
                                    window.setTimeout(()=>{
                                        this.setState({
                                            babyShow:true
                                        })
                                    },300)
                                })
                            },500)
                        });
                    }
                })

            }

        })
    };
    render(){
        return (
            <div className="get-coupon">
                <ReactCSSTransitionGroup
                    transitionName="evnlope"
                    transitionEnterTimeout={30}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.open?
                            ""
                            :
                            <div className="get-coupon-evnlope">
                                <img src={couponEvnlope} />
                            </div>
                    }
                </ReactCSSTransitionGroup>

                <ReactCSSTransitionGroup
                    transitionName="evnlope-open"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.open?
                            <div className="get-coupon-evnlope-open-wrapper">
                                <div className="get-coupon-evnlope-open">
                                    <img src={couponEvnlopeOpen} />
                                </div>
                                <div className="get-coupon-evnlope-top">
                                    <img src={couponEvnlopeTop} />
                                </div>
                            </div>
                            :
                            ""
                    }
                </ReactCSSTransitionGroup>
                <div className="get-coupon-evnlope-coupon-wrapper">
                    <ReactCSSTransitionGroup
                        transitionName="evnlope-slide"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}
                    >
                        {
                            this.state.couponSlide?

                                    <div className="get-coupon-evnlope-coupon">
                                        <img src={coupon} />
                                    </div>


                                :
                                ""
                        }
                    </ReactCSSTransitionGroup>
                </div>
                <ReactCSSTransitionGroup
                    transitionName="evnlope-baby"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.babyShow?

                                <div className="get-coupon-baby">
                                    <img src={baby} />
                                </div>

                            :
                            ""
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="evnlope-baby"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.babyShow?
                                <div className="get-coupon-text">
                                    恭喜你获得现金红包
                                </div>

                            :
                            ""
                    }

                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="evnlope-baby"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.babyShow?

                                <Link to="/index/2" className="path-to-target">
                                    点击查看
                                </Link>
                            :
                            ""
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="evnlope-baby"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.babyShow?

                                <Link to="/index" className="path-to-home">
                                    去逛逛宝宝的农场
                                    <Icon type="right"/>
                                </Link>
                            :
                            ""
                    }
                </ReactCSSTransitionGroup>

                <div className="get-coupon-follow">
                    <div className="get-coupon-code">
                        <img src={code}/>
                    </div>
                    <div>关注宝宝的农场公众号让宝宝吃喝无忧</div>
                </div>
                <div className="get-coupon-btn" onClick={this.open.bind(this)}></div>


                {
                    this.state.submitLoading?
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
        )
    }
}
export default GetCoupon