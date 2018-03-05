/**
 * Created by web前端 on 2017/9/15.
 */
import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon,Tabs,Modal } from 'antd';
import { get } from '../../fetch/get';
import { connect } from 'react-redux';
import GoodPayItem from '../../components/GoodPayItem/GoodPayItem';
import CancelOrder from '../../components/CancelOrder/CancelOrder';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Loading from '../../components/Loading/Loading';
import './MyOrderForm.less';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
//const userOpenId = JSON.parse(openId(document.cookie));
class myOrderForm extends Component{
    state={
        buttons:[
            {
                name:"全部",
                id:0,
            },
            {
                name:"未付款",
                id:1,
            },
            {
                name:"待发货",
                id:2,
            },
            {
                name:"待收货",
                id:3,
            },
            {
                name:"已完成",
                id:50,
            },
            {
                name:"待评价",
                id:51,
            }
        ],
        orderStatus:0,
        data:[],
        payArray:[],
        totalPrice:0,
        hasBeenBottom:true,
        pageNumber:1,
        loadingPage:false,
        isLoading:false,
        currentKey:this.props.match.params.id,
        selectedId:"",
        isSelected:false,
        openId:openId(document.cookie),
        cancelOrderId:null,
        msg:"",
        result:null,
        noMorePay:true
    };

    componentWillMount(){

    }
    componentDidMount(){
        console.log(`用户的openId-------------${this.state.openId}`);
        let whichData = 0;
            if ( this.props.mark === 1 ){
                whichData = this.props.match.params.id;

            }else{
                whichData = this.props.goBackKey.length === undefined? 0:this.props.goBackKey;
                console.log(this.props.goBackKey)
        }
        let orderListParam = {
            openid:this.state.openId,
            status:whichData == 0?null:whichData,
        };
        //console.log(orderListParam);
        this.setState({
            isLoading:true
        },()=>{
            fetch(`${API}/orderlist?pageNumber=${this.state.pageNumber}`,{
                method:'POST',
                body:JSON.stringify(orderListParam)
            }).then(res=>{
                return res.json()
            }).then(data=>{
                console.log(data);
                if(data.result){
                    this.setState({
                        isLoading:false,
                        data:data.data,
                        result:data.result
                    })
                }else{
                    this.setState({
                        isLoading:false,
                        msg:data.msg,
                        result:data.result
                    })
                }
            });
        });

        window.addEventListener('scroll', this.handleScroll);
    };
    //计算价格函数
    calculatePrice = ()=>{
        let tempPrice = 0;
        this.state.payArray.map((item,index)=>{
            tempPrice += item.price*item.count;
        });
        this.setState({
            totalPrice:tempPrice
        })
    };
    //点击选择未付款订单
    selectOrderForm=(index)=>{
        let goodPrice=0;
        //isSelected是一个标记作用，独立开关，无实际意义
        if(!this.state.isSelected){
            console.log(`第一次点击${this.state.totalPrice}`)
            this.setState({
                selectedId:this.state.data[index].orderId,
                isSelected:!this.state.isSelected,

            });
        }else if(this.state.selectedId!=this.state.data[index].orderId ){
            this.setState({
                selectedId:this.state.data[index].orderId,
                totalPrice:0
            },()=>{
                console.log(`第二次点击${this.state.totalPrice}`)
            });

        }else{

            this.setState({
                selectedId:"",
                isSelected:!this.state.isSelected,
                totalPrice:0
            },()=>{
                console.log(`取消点击时候点击${this.state.totalPrice}`)
            });
        }
        //计算价格

        //goodPrice=goodPrice+this.state.data[index].express.charge-this.state.data[index].coupon.price
        this.setState({
            totalPrice:this.state.data[index].orderPrice
        })

    };
    //滚动请求分页
    handleScroll=()=>{
        //滚动请求分页
        let totalHeight = document.body.scrollHeight;
        let scrolledTop = document.body.scrollTop;
        let screenHeight = document.body.clientHeight;
        //console.log(`滚动滚动咕噜噜${this.state.hasBeenBottom}`);
        if(this.state.hasBeenBottom){
            /*
            console.log(`总高度-----------${totalHeight}`);
            console.log(`滚动的高度-----------${scrolledTop}`);
            console.log(`屏幕高度-----------${screenHeight}`);
*/
            if(scrolledTop+screenHeight == totalHeight &&totalHeight != screenHeight){
                this.setState({
                    pageNumber:this.state.pageNumber+1,
                    loadingPage:true,
                    hasBeenBottom:false
                },()=>{
                    let orderListParam={};

                    if(this.state.currentKey==0 || this.state.currentKey==="null"){

                        orderListParam = {
                            openid:this.state.openId,
                            status:null,
                        };

                    }else{
                        orderListParam = {
                            openid:this.state.openId,
                            status:this.state.currentKey,
                        };

                    }
                    //console.log(orderListParam);
                    //console.log(`滚动请求分页-------------${API}/orderlist?pageNumber=${this.state.pageNumber}`);
                    fetch(`${API}/orderlist?pageNumber=${this.state.pageNumber}`,{
                        method:'POST',
                        body:JSON.stringify(orderListParam)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                        if(data.result){
                            this.setState({
                                isLoading:false,
                                data:this.state.data.concat(data.data),
                                hasBeenBottom:true,
                                loadingPage:false
                            },()=>{

                            })
                        }else{
                            this.setState({
                                hasBeenBottom: false,
                                loadingPage: false,
                                result:data.result
                            })
                        }
                    });
                })
            }
        }
    };

    componentWillUnmount(){

        window.removeEventListener('scroll', this.handleScroll);
        this.props.storeOrderKey(this.state.currentKey);
        console.log(this.state.currentKey)
        //存储点的哪个按钮

    }
    tabOrderType=(key)=>{
        this.setState({
            isLoading:true,
            pageNumber:1,
            currentKey:key,
            loadingPage:false,
            data:[],
            hasBeenBottom:true
        },()=>{
            sessionStorage.setItem("goBackKey",this.state.currentKey);
            let orderListParam = {
                openid:this.state.openId,
                status:this.state.currentKey == 0?null:this.state.currentKey,

            };
            console.log(orderListParam);
            console.log(`切换订单状态-------------${API}/orderlist?pageNumber=${this.state.pageNumber}`);
            fetch(`${API}/orderlist?pageNumber=${this.state.pageNumber}`,{
                method:'POST',
                body:JSON.stringify(orderListParam)
            }).then(res=>{
                return res.json()
            }).then(data=>{
                console.log(data)
                if(data.result){
                    this.setState({
                        isLoading:false,
                        data:data.data,
                        result:data.result
                    },()=>{

                    })
                }else{
                    this.setState({
                        isLoading:false,
                        msg:data.msg,
                        result:data.result
                    })
                }
            });

        });
    };
    //点击某个订单，将订单详情存储起来
    toOrderDetail=(index)=>{
        this.props.storeOrderDetail(this.state.data[index])
    };
    //点击评价的时候，把评价订单的商品传递到评价页面
    storeEvaluteItem=(index)=>{
        sessionStorage.setItem('evaluateData',JSON.stringify(this.state.data[index]))
        //this.props.storeOrderDetailItem(this.state.data[index])
    };
    //点击取消订单
    cancelMyOrder=(index)=>{
        console.log(this.refs.cancelOrder);
        this.setState({
            cancelOrderId: this.state.data[index].orderId
        });
        this.refs.cancelOrder.cancelMyOrder()
    };
    //点击申请退款,将订单信息存入session
    drawBack=(index)=>{
        sessionStorage.setItem('drawbackOrder',JSON.stringify(this.state.data[index]))
    };
    //确认收货
    confirmReceiving=(index)=>{
        this.setState({
            confirmLoading:true
        },()=>{
            get(`${API}/order/receive/${this.state.data[index].orderId}`).then(res=>{
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
        });

    };
    //点击付款
    payThis=(index)=>{
/*
        let payData={
            openId:this.state.openId,
            orderId:this.state.data[index]
        };
*/
        //防止用户多次点击
        if(this.state.noMorePay){
            fetch(`${API}/pay/prepay?openid=${this.state.openId}?orderId=${this.state.data[index]}`, {
                method: "get",
            });
            this.setState({
                noMorePay:false
            })
        }
    };
    sessionData=(index)=>{
        console.log(this.state.data[index].data);
        sessionStorage.setItem('logisticsGoods',JSON.stringify(this.state.data[index].data))
    };
    render(){

        return (
            <div className="my-order-form">
                <div className="my-order-top">
                    <div className="my-order-inner">
                        <Link to="/membercenter" className="my-order-go-back">
                            <Icon type="left" />
                            <span>我的订单</span>
                        </Link>
                    </div>
                </div>
                <Tabs defaultActiveKey={this.props.mark === 1?this.props.match.params.id:`${this.props.goBackKey}`} onChange={this.tabOrderType}>
                    {
                        this.state.buttons.map((item,index)=>{
                            return <Tabs.TabPane tab={item.name} key={item.id} >
                                <div className="my-order-wrapper" onScroll={this.scroll}>
                                    {
                                        this.state.isLoading?
                                            <div className="order-form-loading">
                                                <Loading/>
                                            </div>
                                            :
                                            this.state.result?
                                                this.state.data.map((item,index)=>{
                                                        return (
                                                            <div className="order-item" key={index}>
                                                                <div className="order-inner">
                                                                    <div className="order-status clearfix">
                                                                        {
                                                                            //未付款
                                                                            item.status == 1?<span className={item.orderId == this.state.selectedId?"check-order check-order-active":"check-order"} onClick={this.selectOrderForm.bind(this,index)} ref="orderSelection"></span>:""
                                                                        }
                                                                        {
                                                                            item.status == 1?<span>等待买家付款</span>:""
                                                                        }
                                                                        {
                                                                            //待发货
                                                                            item.status == 2?<span className="order-one-last">已付款待发货</span>:""
                                                                        }
                                                                        {
                                                                            //待收货
                                                                            item.status == 3?<span className="order-one-last">已发货</span>:""
                                                                        }
                                                                        {
                                                                            //退款处理中
                                                                            item.status == 41?<span className="order-one-last">退款处理中</span>:""
                                                                        }
                                                                        {
                                                                            //已退款
                                                                            item.status == 42?<span className="order-one-last">已退款</span>:""
                                                                        }
                                                                        {
                                                                            //已完成未评价
                                                                            item.status == 51?<span className="order-one-last">已完成未评价</span>:""
                                                                        }
                                                                        {
                                                                            //待收货
                                                                            item.status == 52?<span className="order-one-last">已完成已评价</span>:""
                                                                        }

                                                                        {
                                                                            //主动取消
                                                                            item.status == 61?<span className="order-one-last">已取消</span>:""
                                                                        }
                                                                        {
                                                                            item.status == 62?<span className="order-one-last">超时未付款取消</span>:""
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <Link to={"/myorderformdetail/"+item.orderId} className="order-content" onClick={this.toOrderDetail.bind(this,index)}>
                                                                    <div className="link-to-order-detail">
                                                                        {
                                                                            item.data.map((orderGoodItem,index)=>{
                                                                                return (
                                                                                    <div className="good-pay-wrapper"  key={index}>
                                                                                        <div className="order-inner">
                                                                                            <GoodPayItem data={orderGoodItem} isLink={true}/>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </Link>
                                                                <div className="order-operation">

                                                                    {
                                                                        //未付款
                                                                        item.status == 1?
                                                                                item.isGroupBuy === '1'?
                                                                                ""
                                                                                :
                                                                                <div className="order-button-left" onClick={this.cancelMyOrder.bind(this,index)}>取消订单</div>
                                                                            :
                                                                            ""
                                                                    }
                                                                    {
                                                                        item.status == 1?<a href={`http://m.baobaofarm.com/eshop/pay/toPay?openId=${this.state.openId}&orderId=${item.orderId}`} className="order-button-right my-order-pay" >付款</a>:""
                                                                    }
                                                                    {/*
                                                                        item.status == 1?<Link to={"/pay/"+item.orderId} className="order-button-right order-pay" >付款</Link>:""
                                                                    */}
                                                                    {
                                                                        //待发货
                                                                        item.status == 2?<Link to="/membercenter/drawback" className="order-button-left" onClick={this.drawBack.bind(this,index)}>申请退款</Link>:""
                                                                    }



                                                                    {
                                                                        //退款中
                                                                        item.status == 41?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                    }
                                                                    {
                                                                        //已退款
                                                                        item.status == 42?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                    }

                                                                    {
                                                                        //待收货
                                                                        item.status == 3?<Link to="/membercenter/drawback" className="order-button-left" onClick={this.drawBack.bind(this,index)}>申请退款</Link>:""
                                                                    }
                                                                    {
                                                                        item.status == 3?<Link to={"/membercenter/logistics/"+item.orderId} className="order-button-right check-express" onClick={this.sessionData.bind(this,index)}>查看物流</Link>:""
                                                                    }
                                                                    {
                                                                        item.status == 3?<div className="order-button-right confirm" onClick={this.confirmReceiving.bind(this,index)}>确认收货</div>:""
                                                                    }


                                                                    {
                                                                        //主动关闭
                                                                        item.status == 61?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                    }
                                                                    {
                                                                        //自动关闭
                                                                        item.status == 62?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                    }

                                                                    {
                                                                        //已完成未评价
                                                                        item.status == 51?<Link to="/membercenter/evaluatelist" className="order-button-left evaluate"  onClick={this.storeEvaluteItem.bind(this,index)}>评价商品</Link>:""
                                                                    }
                                                                    {   //已完成已评价
                                                                        item.status == 52?<div className="order-button-left had-evaluate">商品已评价</div>:""
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                :
                                                <div>
                                                    {
                                                        this.state.data.map((item,index)=>{
                                                            return (
                                                                <div className="order-item" key={index}>
                                                                    <div className="order-inner">
                                                                        <div className="order-status clearfix">
                                                                            {
                                                                                //未付款
                                                                                item.status == 1?<span className={item.id === this.state.selectedId?"check-order check-order-active":"check-order"} onClick={this.selectOrderForm.bind(this,index)} ref="orderSelection"></span>:""
                                                                            }
                                                                            {
                                                                                item.status == 1?<span>等待买家付款</span>:""
                                                                            }
                                                                            {
                                                                                //待发货
                                                                                item.status == 2?<span className="order-one-last">已付款待发货</span>:""
                                                                            }
                                                                            {
                                                                                //待收货
                                                                                item.status == 3?<span className="order-one-last">已发货</span>:""
                                                                            }
                                                                            {
                                                                                //退款处理中
                                                                                item.status == 41?<span className="order-one-last">退款处理中</span>:""
                                                                            }
                                                                            {
                                                                                //已退款
                                                                                item.status == 42?<span className="order-one-last">已退款</span>:""
                                                                            }
                                                                            {
                                                                                //已完成未评价
                                                                                item.status == 51?<span className="order-one-last">已完成未评价</span>:""
                                                                            }
                                                                            {
                                                                                //待收货
                                                                                item.status == 52?<span className="order-one-last">已完成已评价</span>:""
                                                                            }

                                                                            {
                                                                                //主动取消
                                                                                item.status == 61?<span className="order-one-last">已取消</span>:""
                                                                            }
                                                                            {
                                                                                item.status == 62?<span className="order-one-last">超时未付款取消</span>:""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <Link to={"/myorderformdetail/"+item.orderId} className="order-content" onClick={this.toOrderDetail.bind(this,index)}>
                                                                        <div className="link-to-order-detail">
                                                                            {
                                                                                item.data.map((orderGoodItem,index)=>{
                                                                                    return (
                                                                                        <div className="good-pay-wrapper"  key={index}>
                                                                                            <div className="order-inner">
                                                                                                <GoodPayItem data={orderGoodItem} isLink={true}/>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </Link>
                                                                    <div className="order-operation">
                                                                        {
                                                                            //未付款
                                                                            item.status == 1?
                                                                                item.isGroupBuy === '1'?
                                                                                    ""
                                                                                    :
                                                                                    <div className="order-button-left" onClick={this.cancelMyOrder.bind(this,index)}>取消订单</div>
                                                                                :
                                                                                ""
                                                                        }
                                                                        {
                                                                            item.status == 1?<a href={`http://m.baobaofarm.com/eshop/pay/toPay?openId=${this.state.openId}&orderId=${item.orderId}`} className="order-button-right my-order-pay" >付款</a>:""
                                                                        }
                                                                        {/*
                                                                            item.status == 1?<Link to={"/pay/"+item.orderId} className="order-button-right order-pay" >付款</Link>:""
                                                                        */}
                                                                        {
                                                                            //待发货
                                                                            item.status == 2?<Link to="/membercenter/drawback" className="order-button-left" onClick={this.drawBack.bind(this,index)}>申请退款</Link>:""
                                                                        }



                                                                        {
                                                                            //退款中
                                                                            item.status == 41?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                        }
                                                                        {
                                                                            //已退款index
                                                                            item.status == 42?<Link to="/" className="order-button-left">返回首页</Link>:""
                                                                        }

                                                                        {
                                                                            //待收货
                                                                            item.status == 3?<Link to="/membercenter/drawback" className="order-button-left" onClick={this.drawBack.bind(this,index)}>申请退款</Link>:""
                                                                        }
                                                                        {
                                                                            item.status == 3?<Link to={"/membercenter/logistics/"+item.orderId} className="order-button-right check-express" onClick={this.sessionData.bind(this,index)}>查看物流</Link>:""
                                                                        }
                                                                        {
                                                                            item.status == 3?<div className="order-button-right confirm" onClick={this.confirmReceiving.bind(this,index)}>确认收货</div>:""
                                                                        }


                                                                        {
                                                                            //主动关闭
                                                                            item.status == 61?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                        }
                                                                        {
                                                                            //自动关闭
                                                                            item.status == 62?<Link to="/index" className="order-button-left">返回首页</Link>:""
                                                                        }

                                                                        {
                                                                            //已完成未评价
                                                                            item.status == 51?<Link to="/membercenter/evaluatelist" className="order-button-left evaluate"  onClick={this.storeEvaluteItem.bind(this,index)}>评价商品</Link>:""
                                                                        }
                                                                        {   //已完成已评价
                                                                            item.status == 52?<div className="order-button-left had-evaluate">商品已评价</div>:""
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        })

                                                    }
                                                    <div className="order-list-no-data"><Icon type="frown-o" /> 暂无数据</div>
                                                </div>


                                    }
                                    {
                                        this.state.loadingPage?
                                            <div className="page-loading">
                                                <Loading/>
                                            </div>
                                            :
                                            ""
                                    }
                                </div>

                            </Tabs.TabPane>
                        })
                    }
                </Tabs>

                <ReactCSSTransitionGroup
                    transitionName="order-pay"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.selectedId === ""?
                            null
                            :
                            <div className="order-pay-button">
                                {
                                    console.log(this.state.totalPrice)
                                }
                                <span><span>合计: </span> {this.state.totalPrice.toFixed(2)}</span>
                                <a href={`http://m.baobaofarm.com/eshop/pay/toPay?openId=${this.state.openId}&orderId=${this.state.selectedId}`} className="pay-button">
                                    付款
                                </a>
{/*
                                <Link to={"/pay/"+this.state.selectedId} className="pay-button">
                                    付款
                                </Link>
*/}
                            </div>
                    }
                </ReactCSSTransitionGroup>
                <CancelOrder ref="cancelOrder" cancelOrderId={this.state.cancelOrderId}/>
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
        )
    }
}
const mapStateToProps = (state)=>{
    return {
        goBackKey:state.orderKey,
        mark:state.mark
    }
};
const mapDispatchToProps = (dispatch)=>{
  return {
      //将本页面停留的tab 的key值记录下来
      storeOrderKey(data){
          dispatch({
              type:"STORE_ORDER_KEY",
              key:data
          })
      },
      //存储订单信息
      storeOrderDetail(data){
          dispatch({
              type:"STORE_ORDER_DETAIL",
              detailData:data
          })
      },
      //评价时候存储订单item
      storeOrderDetailItem(data){
          dispatch({
              type:"STORE_ORDER_DETAIL_ITEM",
              itemData:data
          })
      }
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(myOrderForm);