import React,{ Component } from 'react';
import './MyCustom.less';
import {Link} from 'react-router-dom';
import {Icon} from 'antd';
import {get} from '../../fetch/get.js'
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
import Loading from '../../components/Loading/Loading';

class MyCustom extends Component{
    state={
        openId:openId(document.cookie),
        myCustomData:[],
        hasBeenBottom:true,
        pageNumber:1,
        loadingPage:false,
        isLoading:true,
        noData:false
    };
    componentDidMount(){
        get(`${API}/customerList/${this.state.openId}?pageNumber=${this.state.pageNumber}`).then(function(res){
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    myCustomData:data,
                    hasBeenBottom:true,
                    loadingPage:false,
                    isLoading:false
                })
            }else{
                   this.setState({

                       loadingPage:false,
                       isLoading:false,
                       noData:true
                   })
            }
        });
        window.addEventListener('scroll',this.handleScroll);
    };

    handleScroll=()=>{
        let totalHeight=document.body.scrollHeight;
        let clientHeight=document.body.clientHeight;
        let scrollTop=document.body.scrollTop;
        if(this.state.hasBeenBottom){
            if(totalHeight==clientHeight+scrollTop){
                this.setState({
                    pageNumber:this.state.pageNumber+1,
                    hasBeenBottom:false,
                    loadingPage:true
                },()=>{
                    get(`${API}/customerList/${this.state.openId}?pageNumber=${this.state.pageNumber}`).then(function(res){
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                        if(data.result){
                            //console.log(this.state.myCustomData.result);
                            this.state.myCustomData.data=this.state.myCustomData.data.concat(data.data);
                            this.setState({
                                isLoading:false,
                                loadingPage:false,
                                hasBeenBottom:true
                            })
                        }else{
                            this.state.myCustomData.result = data.result;
                            //console.log(this.state.myCustomData.result)
                            this.setState({
                                isLoading:false,
                                loadingPage:false,
                                hasBeenBottom:false
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
    render(){
        let myCustomSame=()=>{
            return(
                <div>
                    <div className="mycustom-fixed">
                        <div className="mycustom-head">
                            <div className="mycustom-head-inner">
                                <Link to="/membercenter/myshop" >
                                    <Icon type="left" />
                                    <div className="mycustom-head-txt">
                                        我的客户({this.state.myCustomData.dataNum})
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="mycustom-text-null"></div>
                        <div className="mycustom-head-text">
                            <div>会员信息</div>
                            <div>TA的消费订单/金额</div>
                        </div>
                    </div>

                    <div className="mycustom-body">
                        {
                            this.state.myCustomData.data.map((item,index)=>{
                                return (
                                    <div className="mycustom-body-inner" key={index}>
                                        <div className="mycustom-body-inner-txt">
                                            <div className="mycustom-body-inner-left">
                                                <div className="mycustom-body-inner-left-img">
                                                    <img src={item.photo} alt=""/>
                                                </div>
                                                <div className="mycustom-body-inner-left-text">
                                                    <div>{item.wxName}</div>
                                                    <div>
                                                        注册时间：{item.createTime.substring(0,16)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mycustom-body-inner-right">
                                                <div><span>{item.orderNum}</span><span>订单</span></div>
                                                <div>{item.orderPrice.toFixed(2)}元</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        };
        return(
            <div className="mycustom">
                {
                    this.state.isLoading?
                        <div className="order-form-loading">
                            <Loading/>
                        </div>
                        :
                            !this.state.noData?
                                this.state.myCustomData.result?
                                    <div className='my-custom-content'>
                                        {myCustomSame()}
                                        {this.state.loadingPage?
                                            <div className="my-custopm-pagnation-loading">
                                                <Loading/>
                                            </div>
                                            :
                                            ""
                                        }
                                    </div>
                                    :
                                    <div className='my-custom-content'>
                                        {myCustomSame()}
                                        <div className="my-custom-cash-msg">数据已加载完毕</div>
                                    </div>
                            :
                            <div>
                                <div className="mycustom-head">
                                    <div className="mycustom-head-inner">
                                        <Link to="/membercenter/myshop" >
                                            <Icon type="left" />
                                            <div className="mycustom-head-txt">
                                                我的客户
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="mycustom-head-null">
                                    <div className="mycustom-head-null-txt">
                                        您暂时还没有客户
                                    </div>
                                </div>
                            </div>
                }
            </div>
        )
    }
}
export default MyCustom