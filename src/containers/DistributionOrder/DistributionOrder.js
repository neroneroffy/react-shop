import React,{ Component } from 'react';
import './DistributionOrder.less';
import {Link} from 'react-router-dom';
import { Icon, Tabs} from 'antd';
import { get } from "../../fetch/get";
import Loading from '../../components/Loading/Loading'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {API} from '../../constants/API'
import { openId } from '../../util/openId';
const TabPane = Tabs.TabPane;

class DistributionOrder extends Component{
    state={
        distributionOrder:null,
        distributionDetail:[],
        openId:openId(document.cookie),
        pageNumber:1,
        statusKey:1,
        statusIndex:0,
        toggle:false,
        hasBeenBottom:true,
        loadingPage:false,
        buttons:[
            {
                name:"已付款",
                status:"1"
            },
            {
                name:"已完成",
                status:"2"
            }
        ],
        noData:false
    };
    componentDidMount(){
       let fetchData = {
            openId:this.state.openId,
            pageNumber:this.state.pageNumber,
            status:this.state.statusKey
       };
       fetch(`${API}/order/distribution/list`,{
           method:"POST",
           body:JSON.stringify(fetchData)
       }).then(res=>{
           return res.json()
       }).then(data=>{
           console.log(data);
           if(data.result){
               this.setState({
                   distributionOrder:data,
                   noData:false
               })
           }else{
               this.setState({
                   distributionOrder:undefined,
                   noData:true
               })
           }
       });
       window.addEventListener('scroll',this.handleScroll)
    }
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
            if(scrolledTop+screenHeight == totalHeight && totalHeight != screenHeight){
                this.setState({
                    pageNumber:this.state.pageNumber+1,
                    loadingPage:true,
                    hasBeenBottom:false
                },()=>{
                    let fetchData = {
                        openId:this.state.openId,
                        pageNumber:this.state.pageNumber,
                        status:this.state.statusKey
                    };
                    //console.log(fetchData)
                    //console.log(`滚动请求分页-------------${API}/orderlist?pageNumber=${this.state.pageNumber}`);
                    fetch(`${API}/order/distribution/list`,{
                        method:'POST',
                        body:JSON.stringify(fetchData)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                        if(data.result){
                            this.state.distributionOrder.data = this.state.distributionOrder.data.concat(data.data);
                            this.setState({
                                hasBeenBottom:true,
                                loadingPage: false
                            })
                        }else{
                            this.state.distributionOrder.result = data.result;
                            this.setState({
                                hasBeenBottom: false,
                                loadingPage: false,
                            })
                        }
                    });
                })
            }
        }
    };

    tabDistribution=(key)=>{
        console.log(key)
        this.setState({
            statusKey:key,
            pageNumber:1,
            loadingPage:false,
            distributionOrder:null
        },()=>{
            let fetchData = {
                openId:this.state.openId,
                pageNumber:this.state.pageNumber,
                status:this.state.statusKey
            };
            fetch(`${API}/order/distribution/list`,{
                method:"POST",
                body:JSON.stringify(fetchData)
            }).then(res=>{
                return res.json()
            }).then(data=>{
                console.log(data);
                if(data.result){
                    this.setState({
                        distributionOrder:data,
                        noData:false
                    })
                }else{
                    this.setState({
                        distributionOrder:undefined,
                        noData:true
                    })
                }
            });
        })
    };

    showDetail=(index)=>{
        this.setState({
            toggle:!this.state.toggle
        },()=>{
            if(this.state.toggle){
                let fetchData = {
                    status:this.state.statusKey,
                    orderId:this.state.distributionOrder.data[index].orderId,
                    openId:this.state.openId
                };
                fetch(`${API}/commission/orderItem/list`,{
                    method:"POST",
                    body:JSON.stringify(fetchData)
                }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                       this.state.distributionOrder.data[index].detail=data.objData;
                       this.setState(this.state,()=>{
                           console.log(this.state.distributionOrder.data[index]);
                       })
                    /* this.setState(this.state,()=>{
                            let userHeight = this.refs.userInfo.offsetHeight;
                            let goodsHeight = this.refs.goodInfo.offsetHeight;
                            let totalHeight = userHeight+goodsHeight;
                            let animation = document.getElementsByClassName('distribution-body-display-txt')[0];
                            let units = 5;
                            let height = 0;
                            let timer=0;

                            //animation.style.height = 0;
                            let animationHeight = animation.style.height.substring(0,animation.style.height.indexOf('p'));

                            if(animationHeight<totalHeight){
                                timer = window.setInterval(()=>{
                                    units++;
                                    animation.style.height+=units+"px";

                                },30/1000)
                            }else{
                                window.clearInterval(timer)
                            }
                            console.log(animation.style.height);

                        });*/

                });
            }else{
                this.state.distributionOrder.data[index].detail=undefined;
                this.setState(this.state)
            }
        })
    };
    sessionData=(index)=>{
        //console.log(this.state.distributionOrder.data[index]);
        sessionStorage.setItem('logisticsGoods',JSON.stringify(this.state.distributionOrder.data[index].detail.orderItemInfos))
    };
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

    render(){
        return(
            <div className="distribution">
                <div className="distribution-head">
                    <div className="distribution-head-inner">
                        <Link to="/membercenter/myshop" >
                            <Icon type="left" />
                            <div className="distribution-head-content">分销订单</div>
                        </Link>
                        {
                            /*<div className="distribution-head-all">预计+<span></span>元 </div>*/
                        }

                    </div>
                </div>
                <div className="distribution-body">
                    <Tabs defaultActiveKey="1" onChange={ this.tabDistribution }>
                        {
                            this.state.buttons.map((item,index)=>{
                                return (
                                    <TabPane tab={item.name} key={item.status}>

                                        {
                                            this.state.distributionOrder === null?
                                                <div className="distribution-loading">
                                                    <Loading/>
                                                </div>
                                                :
                                                <div>
                                                    {
                                                        this.state.noData?
                                                            <div className="distribution-msg">没有更多数据</div>
                                                            :
                                                            <div className="distribution-wrapper">
                                                                {
                                                                    this.state.distributionOrder.data.map((item,index)=>{
                                                                        return (
                                                                            <div key={index} >
                                                                                <div className="distribution-body-content" onClick={this.showDetail.bind(this,index)}>
                                                                                    <div className="distribution-body-inner" >
                                                                                        <div className="distribution-body-inner-div1">
                                                                                            <div>
                                                                                                <div>{item.orderSn}({item.incomeType})</div>
                                                                                                <div className="distribution-body-time">{item.createTime}</div>
                                                                                            </div>
                                                                                            <div>
                                                                                                {
                                                                                                    item.profit?<div className="distribution-body-price">{item.profit.toFixed(2)}</div>:""
                                                                                                }

                                                                                                <div className="distribution-body-state">
                                                                                                    {
                                                                                                        item.status==="1"?<div>已付款</div>:item.status==="2"?<div>已完成</div>:""
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <ReactCSSTransitionGroup
                                                                                    transitionName="distribution-animation"
                                                                                    transitionEnterTimeout={500}
                                                                                    transitionLeaveTimeout={500}
                                                                                >
                                                                                    {
                                                                                        item.detail === undefined ?
                                                                                            null
                                                                                            :
                                                                                            <div className="distribution-body-display-txt" ref={(detail) => {this.orderDetail = detail}}>
                                                                                                <div className="person-info" ref="userInfo">
                                                                                                    <div className="person-info-img">
                                                                                                        <img src={item.detail.photo} alt=""/>
                                                                                                    </div>
                                                                                                    <div className="person-info-name">
                                                                                                        {item.detail.memberName}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="distribution-order-wrapper" ref="goodInfo">
                                                                                                    {
                                                                                                        item.detail.orderItemInfos.map((items, detailIndex) => {
                                                                                                            return (
                                                                                                                <div className="goods-person" key={detailIndex} >
                                                                                                                    <div className="goods-info">
                                                                                                                        <div className="goods-info-left">
                                                                                                                            <div className="goods-info-left-img">
                                                                                                                                <img src={items.listImage} alt="加载失败咯~"/>
                                                                                                                            </div>
                                                                                                                            <div className="goods-info-left-txt">
                                                                                                                                <div>{items.goodsName}</div>
                                                                                                                                <div><Icon type="close"/> {items.num}</div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="goods-info-right">
                                                                                                                            <div>
                                                                                                                                预计佣金
                                                                                                                            </div>
                                                                                                                            <div>
                                                                                                                                +{items.profit}</div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })
                                                                                                    }

                                                                                                </div>
                                                                                                <Link to={'/membercenter/logistics/'+item.orderId} className="goods-info-btn" onClick={this.sessionData.bind(this,index)}>
                                                                                                    查看物流
                                                                                                </Link>

                                                                                            </div>
                                                                                    }
                                                                                </ReactCSSTransitionGroup>

                                                                                {
                                                                                    /*                                                                                        item.detail === undefined ?
                                                                                     null
                                                                                     :
                                                                                     <div className="distribution-body-display-txt" ref="animation">
                                                                                     <div className="person-info" ref="userInfo">
                                                                                     <div className="person-info-img">
                                                                                     <img src={item.detail.photo} alt=""/>
                                                                                     </div>
                                                                                     <div className="distribution-body-display-content">
                                                                                     <div>{item.detail.memberName}</div>
                                                                                     </div>
                                                                                     </div>
                                                                                     <div className="distribution-order-wrapper" ref="goodInfo">
                                                                                     {
                                                                                     item.detail.orderItemInfos.map((items, index) => {
                                                                                     return (
                                                                                     <div className="goods-person" key={index} >
                                                                                     <div className="goods-info">
                                                                                     <div className="goods-info-left">
                                                                                     <div className="goods-info-left-img">
                                                                                     <img src={items.listImage} alt="加载失败咯~"/>
                                                                                     </div>
                                                                                     <div className="goods-info-left-txt">
                                                                                     <div>{items.goodsName}</div>
                                                                                     <div><Icon type="close"/> {items.num}</div>
                                                                                     </div>
                                                                                     </div>
                                                                                     <div className="goods-info-right">
                                                                                     <div>
                                                                                     预计佣金
                                                                                     </div>
                                                                                     <div>
                                                                                     +{items.profit}</div>
                                                                                     </div>
                                                                                     </div>
                                                                                     <div className="goods-info-btn">
                                                                                     查看物流
                                                                                     </div>
                                                                                     </div>
                                                                                     )
                                                                                     })
                                                                                     }

                                                                                     </div>

                                                                                     </div>*/
                                                                                }

                                                                            </div>
                                                                        )
                                                                    })

                                                                }
                                                                {
                                                                    this.state.loadingPage?
                                                                        <div className="page-loading">
                                                                            <Loading/>
                                                                        </div>
                                                                        :
                                                                        ""
                                                                }
                                                                {
                                                                    this.state.distributionOrder.result?
                                                                        ""
                                                                        :
                                                                        <div className="distribution-bottom-msg">没有更多数据</div>
                                                                }

                                                            </div>

                                                    }
                                                </div>
                                        }
                                    </TabPane>

                                )
                            })
                        }

                    </Tabs>
                </div>
            </div>
        )
    }
}
export default DistributionOrder