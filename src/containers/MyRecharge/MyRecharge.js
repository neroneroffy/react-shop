/*
* 另一个前端在WithdrawDetail页面中是直接把这个页面复制过去的，所以样式会相关联
* */
import React,{ Component } from 'react';
import './MyRecharge.less';
import { get } from "../../fetch/get";
import {Link} from 'react-router-dom';
import { Icon } from 'antd';
import { openId } from '../../util/openId';
import { API } from '../../constants/API';
import Tabbar from '../../components/Tabbar/Tabbar'

class MyRecharge extends Component{

    state={
        openId:openId(document.cookie),
        rechargeData:[]
    };

    componentDidMount(){
        get(`${API}/memberRechargeList/${this.state.openId}`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    rechargeData:data.data
                })
            }else{
                this.setState({
                    rechargeData:[]
                })
            }
        });
    };



    render(){
        return(
            <div>
                <div className="my-recharge-head">
                    <div className="my-recharge-head-inner">
                        <Link to="/membercenter" className="my-recharge-head-content">
                            <Icon type="left" />
                            <span >充值记录</span>
                        </Link>

                    </div>
                </div>
                {
                    this.state.rechargeData.length===0?
                            <div className='my-recharge-bodyNull'>
                                <p>您还没有充值记录</p>
                            </div>
                        :
                            <div className="my-recharge-records">
                                {
                                    this.state.rechargeData.map((item,index)=>{
                                        return (
                                            <div className="my-recharge-body" key={index}>
                                                <div className="my-recharge-body-inner">
                                                    <div className="my-recharge-body-innerL">
                                                        <p>充值金额 {item.recharge} 元</p>
                                                        <p>{item.createTime}</p>
                                                    </div>
                                                    <div className="my-recharge-body-innerR">
                                                            {
                                                                item.status==1?
                                                                    <div>
                                                                        <Icon type="clock-circle-o" style={{color:'green'}} /> <span>待充值</span>
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <Icon type="check-circle-o" style={{color:'green'}} /> <span>充值成功</span>
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