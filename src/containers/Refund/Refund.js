/**
 * Created by web前端 on 2017/10/14.
 */
import React,{ Component } from 'react';
import './Refund.less';
import { Icon,Radio  } from 'antd';
import { API } from '../../constants/API';
import { Link } from 'react-router-dom';
import { openId } from '../../util/openId';
import Loading from '../../components/Loading/Loading';
import GoodPayItem from '../../components/GoodPayItem/GoodPayItem';

class Refund extends Component{
    constructor(props){
        super(props);
        this.state={
            refundType:"41",
            openId:openId(document.cookie),
            pageNumber:1,
            data:[],
            hasBeenBottom:true,
            loadingPage:false,
            result:true,
            msg:null
        }
    }
    fetchData=()=>{
        let orderListParam = {
            openid:this.state.openId,
            status:this.state.refundType
        };
        console.log(`初始请求分页-------------${API}/orderlist?pageNumber=${this.state.pageNumber}`);
        fetch(`${API}/orderlist?pageNumber=${this.state.pageNumber}`,{
            method:'POST',
            body:JSON.stringify(orderListParam)
        }).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data)
            if(data.result){
                this.setState({
                    data:data.data,
                    result:data.result,
                    hasBeenBottom:true
                })
            }else{
                this.setState({
                    result:data.result,
                    msg:data.msg
                })
            }
        });
    };
    componentDidMount(){
        this.fetchData();
        window.addEventListener('scroll', this.handleScroll);
    }
    refundFilter=(e)=>{
        document.body.scrollTop = 0;
         this.setState({
             data:[],
             refundType:e.target.value,
             pageNumber:1,
             result:true
         },()=>{
             this.fetchData();
         })
    };
    //滚动请求分页
    handleScroll=()=>{
        //滚动请求分页
        let totalHeight = document.body.scrollHeight;
        let scrolledTop = document.body.scrollTop;
        let screenHeight = document.body.clientHeight;
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
                    let orderListParam = {
                            openid:this.state.openId,
                            status:this.state.refundType,
                        };
                    console.log(orderListParam);
                    console.log(`滚动请求分页-------------${API}/orderlist?pageNumber=${this.state.pageNumber}`);
                    fetch(`${API}/orderlist?pageNumber=${this.state.pageNumber}`,{
                        method:'POST',
                        body:JSON.stringify(orderListParam)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                        if(data.result){
                            this.setState({
                                data:this.state.data.concat(data.data),
                                hasBeenBottom:true,
                                loadingPage:false
                            },()=>{

                            })
                        }else{
                            this.setState({
                                hasBeenBottom: false,
                                loadingPage: false,
                                result:data.result,
                                msg:data.msg
                            })
                        }
                    });
                })
            }
        }
    };
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

    goBack=()=>{
      window.history.go(-1)
    };
    render(){
        return (
            <div className="refund">
                <div className="refund-top">
                    <div onClick={this.goBack.bind(this)}>
                        <Icon type="left"/>
                        <span>退款订单</span>
                    </div>
                </div>
                <div className="refund-select">
                    <Radio.Group defaultValue="41" onChange={this.refundFilter.bind(this)}>
                        <Radio.Button value="41">退款中</Radio.Button>
                        <Radio.Button value="42">已退款</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="refund-content">
                    {
                        this.state.data === null?
                            <div className="refund-loading">
                                <Loading/>
                            </div>

                            :
                            this.state.data.map((item,index)=>{
                                return (
                                    <div className="order-item" key={index}>
                                        <div className="order-inner">
                                            <div className="order-status clearfix">
                                                {
                                                    //退款处理中
                                                    item.status == 41?<span className="order-one-last">退款处理中</span>:""
                                                }
                                                {
                                                    //已退款
                                                    item.status == 42?<span className="order-one-last">已退款</span>:""
                                                }
                                            </div>
                                        </div>
                                        <Link to={"/myorderformdetail/"+item.orderId} className="order-content">
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
                                                //退款中
                                                item.status == 41?<Link to="##" className="order-button-left" >联系客服</Link>:""
                                            }
                                            {
                                                //已退款
                                                item.status == 42?<Link to="##" className="order-button-left" >联系客服</Link>:""
                                            }
                                        </div>
                                    </div>

                                )
                            })
                    }
                    {
                        this.state.loadingPage?<Loading/>:""
                    }
                    {
                        this.state.result?"":<div className="refund-msg">没有更多数据</div>
                    }
                </div>
            </div>
        )
    }
}
export default Refund;
