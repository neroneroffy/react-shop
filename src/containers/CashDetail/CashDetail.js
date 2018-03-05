import React,{ Component } from 'react';
import './CashDetail.less';
import {Link} from 'react-router-dom';
import {Icon,Tabs} from 'antd';
import {get} from '../../fetch/get';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
import Loading from '../../components/Loading/Loading';
const TabPane = Tabs.TabPane;




class CashDetail extends Component{
    state={
        buttons:[
            {
                name:"最新收益",
                id:1,
            },
            {
                name:"可提现",
                id:2,
            },
            {
                name:"已申请",
                id:3,
            },
            {
                name:"已提现",
                id:4,
            }
        ],
        openId:openId(document.cookie),
        pageNumber:1,
        hasBeenBottom:true,          //滚动时可以请求分页
        loagingPage:false,           //滚动圈是否出现
        isLoading:true,              //是否在加载
        statusKey:1,
        cashDetail:[],
        noData:false                 //是否有数据

    };
    componentDidMount(){
        let cashDetailData={
            drawType:this.state.statusKey,
            openId:this.state.openId
        };
        fetch(`${API}/commissionList?pageNumber=${this.state.pageNumber}`,{
            method:"POST",
            body:JSON.stringify(cashDetailData)
        }).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    isLoading:false,
                    cashDetail:data
                })
            }else{
                this.setState({
                    isLoading:false,
                    cashDetail:data,
                    noData:true
                })

            }
        });
            window.addEventListener('scroll',this.handleScroll);
    }

    handleScroll=()=>{
        let totalHeight=document.body.scrollHeight;
        let clientHeight=document.body.clientHeight;
        let scrollTop=document.body.scrollTop;
        //console.log(`总高度-----------${totalHeight}`);
        //console.log(`滚动的高度-----------${scrollTop}`);
        //console.log(`屏幕高度-----------${clientHeight}`);

        if(this.state.hasBeenBottom){
            if(totalHeight==clientHeight+scrollTop && totalHeight!=clientHeight){
                this.setState({
                    pageNumber:this.state.pageNumber+1,
                    loagingPage:true,
                    hasBeenBottom:false
                },()=>{
                    let cashDetailData={
                        drawType:this.state.statusKey,
                        openId:this.state.openId
                    };
                    console.log(`滚动请求分页---------------${API}/commissionList?pageNumber=${this.state.pageNumber}`)
                    fetch(`${API}/commissionList?pageNumber=${this.state.pageNumber}`,{
                        method:"POST",
                        body:JSON.stringify(cashDetailData)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        //console.log(data);
                        if(data.result){
                            this.state.cashDetail.data=this.state.cashDetail.data.concat(data.data);
                            this.setState({
                                isLoading:false,
                                loagingPage:false,
                                hasBeenBottom:true
                            })
                        }else{
                            this.state.cashDetail.result = data.result;
                            this.setState({
                                isLoading:false,
                                loagingPage:false,
                                hasBeenBottom:false
                            },()=>{
                                console.log(this.state.cashDetail)
                            })
                        }
                    })
                })
            }
        }
    };

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }
    tabCashDetail=(key)=>{
        document.body.scrollTop = 0;
            this.setState({
                cashDetail:null,
                statusKey:key,
                pageNumber:1,
                isLoading:true,
                noData:false,
                hasBeenBottom:true
            },()=>{
                let cashDetailData={
                    drawType:this.state.statusKey,
                    openId:this.state.openId
                };
                fetch(`${API}/commissionList?pageNumber=${this.state.pageNumber}`,{
                    method:"POST",
                    body:JSON.stringify(cashDetailData)
                }).then(res=>{
                    return res.json()
                }).then(data=>{
                    console.log(data);
                    if(data.result){
                        this.setState({
                            cashDetail:data,
                            isLoading:false
                        })
                    }else{
                        this.setState({
                            cashDetail:data,
                            isLoading:false,
                            noData:true
                        })
                    }
                })
            });


    };


    render(){

        return (
            <div className="cash-detail-text">

                <div className="cash-detail-head-text">
                    <div className="cash-detail-head-inner-text">
                       <div>
                           <Link to="/membercenter/myshop">
                               <Icon type="left" />
                               <span className="cash-detail-head-txt">佣金明细</span>
                           </Link>
                       </div>
                        {
                            /*<div>预计佣金:+0.00元</div>*/
                        }
                    </div>
                </div>
                {
                        <div className="cash-detail-body" >
                            <Tabs defaultActiveKey="1" onChange={ this.tabCashDetail }>
                                {
                                    this.state.buttons.map((item,index)=>{
                                        return (
                                            <TabPane tab={item.name} key={item.id}>
                                                {
                                                    this.state.isLoading?
                                                        <div className="order-form-loading">
                                                            <Loading/>
                                                        </div>
                                                        :
                                                        <div>
                                                            {
                                                                !this.state.noData?
                                                                    <div className='content-wrapper'>
                                                                        {
                                                                            this.state.cashDetail.result?
                                                                                this.state.cashDetail.data.map((item, index) => {
                                                                                    return (
                                                                                        <div className="cash-detail-body-inner" key={index}>
                                                                                            <div className="cash-detail-body-txt">
                                                                                                <div>
                                                                                                    <div>
                                                                                                        {item.orderSn}
                                                                                                        {
                                                                                                            item.incomeType==="1"?
                                                                                                              <span>（一级收益）</span>
                                                                                                                :
                                                                                                              <span>（二级收益）</span>
                                                                                                        }
                                                                                                    </div>
                                                                                                    <div className="cash-detail-body-txt-time">{item.createTime}</div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div>+{item.profit}</div>
                                                                                                    <div className="cash-detail-body-txt-status">
                                                                                                        {
                                                                                                        item.status==1?<div>最新收益</div>:item.status==2?<div>可提现</div>:item.status==3?<div>已申请</div>:<div>已提现</div>
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                :
                                                                                <div>
                                                                                    {
                                                                                        this.state.cashDetail.data.map((item, index) => {
                                                                                            return (
                                                                                                <div className="cash-detail-body-inner" key={index}>
                                                                                                    <div className="cash-detail-body-txt">
                                                                                                        <div>
                                                                                                            <div>
                                                                                                                {item.orderSn}
                                                                                                                {
                                                                                                                    item.incomeType === "1"?
                                                                                                                        <span>（一级收益）</span>
                                                                                                                        :
                                                                                                                        <span>（二级收益）</span>
                                                                                                                }
                                                                                                            </div>
                                                                                                            <div className="cash-detail-body-txt-time">{item.createTime}</div>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <div>+{item.profit.toFixed(2)}</div>
                                                                                                            <div className="cash-detail-body-txt-status">
                                                                                                                {
                                                                                                                    item.status==1?<div>最新收益</div>:item.status==2?<div>可提现</div>:item.status==3?<div>已申请</div>:<div>已提现</div>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                    <div className="cash-msg">数据已加载完毕</div>
                                                                                </div>

                                                                        }
                                                                        {
                                                                            this.state.cashDetail.result?
                                                                                this.state.loagingPage?
                                                                                    <div className="pagnation-loading">
                                                                                        <Loading/>
                                                                                    </div>
                                                                                    :
                                                                                    ""
                                                                                :
                                                                                ""

                                                                        }
                                                                    </div>
                                                                    :
                                                                    <div className="no-data-msg">您还没有佣金记录</div>
                                                            }
                                                        </div>
                                                }

                                            </TabPane>

                                        )
                                    })
                                }


                            </Tabs>
                        </div>
                }




            </div>
        )
    }
}
export default CashDetail


