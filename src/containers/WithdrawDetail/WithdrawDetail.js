import React,{ Component } from 'react';
import './WithdrawDetail.less';
import { get } from "../../fetch/get";
import {Link} from 'react-router-dom';
import { Icon } from 'antd';
import Tabbar from '../../components/Tabbar/Tabbar';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';

class MyRecharge extends Component{
    state={
        openId:openId(document.cookie),
        hasBeenBottom:true,
        pageNumber:1,
        loagingPage:false,
        goodsItemInfo:[]
    };

    componentDidMount(){
        get(`${API}/withdrawapply/list/${this.state.openId}?pageNumber=${this.state.pageNumber}`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    goodsItemInfo:data.data,
                    loagingPage:false,
                    hasBeenBottom:true
                })
            }else{
                this.setState({
                    loagingPage:false
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
                    loagingPage:true,
                    hasBeenBottom:false
                },()=>{
                    get(`${API}/withdrawapply/list/${this.state.openId}?pageNumber=${this.state.pageNumber}`).then(function(res){
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                       if(data.result){
                           this.state.goodsItemInfo=this.state.goodsItemInfo.concat(data.data);
                           this.setState({
                               loagingPage:false,
                               hasBeenBottom:true
                           })
                       }else{
                           this.setState({
                               loagingPage:false
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
        return(
            <div>
                <div className="my-recharge-head">
                    <div className="my-recharge-head-inner">
                        <Link to="/membercenter/myshop" className="my-recharge-head-content">
                            <Icon type="left" />
                            <span >提现记录</span>
                        </Link>
                    </div>
                </div>
                {
                    this.state.goodsItemInfo.length===0?
                        <div className='my-recharge-bodyNull'>
                            <p>您还没有提现记录</p>
                        </div>
                        :
                        <div className="my-recharge-records">
                            {
                                this.state.goodsItemInfo.map((item,index)=>{
                                    return (
                                        <div className="my-recharge-body" key={index}>
                                            <div className="my-recharge-body-inner">
                                                <div className="my-recharge-body-innerL">
                                                    <p>提现金额 {item.withdrawNum} 元</p>
                                                    <p>{item.createTime}</p>
                                                </div>
                                                <div className="my-recharge-body-innerR">
                                                    {
                                                        item.status==1?
                                                            <div className="my-recharge-body-inner-txt">
                                                                <div>
                                                                    <Icon type="clock-circle-o" style={{color:'green'}} />
                                                                </div>
                                                                <div>
                                                                    <span>审核中</span>
                                                                </div>
                                                            </div>
                                                            :
                                                            item.status==2?
                                                                <div className="my-recharge-body-inner-txt">
                                                                    <div>
                                                                        <Icon type="unlock" style={{color:'green'}} />
                                                                    </div>
                                                                    <div>
                                                                        <span>审核通过</span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                item.status==3?
                                                                    <div className="my-recharge-body-inner-txt">
                                                                        <div>
                                                                            <Icon type="lock" style={{color:'green'}} />
                                                                        </div>
                                                                        <div>
                                                                            <span>拒绝</span>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    item.status==4?
                                                                        <div className="my-recharge-body-inner-txt">
                                                                            <div>
                                                                                <Icon type="check-circle-o" style={{color:'green'}} />
                                                                            </div>
                                                                            <div>
                                                                                <span>已打款</span>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div className="my-recharge-body-inner-txt">
                                                                            <div>
                                                                                <Icon type="close-circle-o" style={{color:'green'}} />
                                                                            </div>
                                                                            <div>
                                                                                <span>无效</span>
                                                                            </div>
                                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>
                }
                <Tabbar/>
            </div>
        )
    }
}
export default MyRecharge;