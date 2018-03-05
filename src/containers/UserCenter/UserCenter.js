
/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import MyPurchase from '../../components/MyPurchase/MyPurchase';
import MyItem from '../../components/MyItem/MyItem';
import { Link } from 'react-router-dom';
import { get } from '../../fetch/get';
import './UserCenter.less';
import { Icon } from "antd";
import Loading from'../../components/Loading/Loading';
import { openId } from '../../util/openId';
import { API } from '../../constants/API'
//const userOpenId = JSON.parse(openId(document.cookie));

//从localStorage中读取用户信息

class UserCenter extends Component{
    constructor(props){
        super(props);
        this.state={
            userData:null,
            openId:openId(document.cookie)
        }
    }
    componentWillMount(){
        //const userOpenId = JSON.parse(openId(document.cookie));
        document.body.scrollTop=0;

    }
    componentDidMount(){
        get(`${API}/userinfo/${this.state.openId}`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    userData:data.cookieModel
                },()=>{
                    let inviterInfo={
                        id:this.state.userData.id,
                        inviterId:this.state.userData.inviterId,
                        inviterName:this.state.userData.inviterName
                    };
                    sessionStorage.setItem('inviterInfo',JSON.stringify(inviterInfo));
                })
            }
        })
    }
    componentWillUnmount(){
        sessionStorage.setItem('lastPage','membercenter');
    }
    render(){
        return(
            <div className="user-center">
                {
                    this.state.userData === null?
                        <div className="usercenter-loading">
                            <Loading/>
                        </div>
                        :
                        <div>
                            <Avatar userInfo={this.state.userData}/>
                            <div className="recharge">
                                <div className="recharge-content clearfix">
                                    <span className="remaining-title">余额：{this.state.userData.balance?this.state.userData.balance.toFixed(2):0.00}元</span>
{/*
                                    <Link to="/membercenter/recharge" className="remaining">充值</Link>
*/}
                                    <a href={`http://m.baobaofarm.com/eshop/pay/toRecharge?openId=${this.state.openId}`} className="remaining">充值</a>

                                </div>
                                {
                                    this.state.userData.groupId==1?
                                        <Link to={ this.state.userData.status==1?'/membercenter/becomefarmer':'/membercenter/checkresult'} className="my-shop">
                                            <div className="my-shop-inner">
                                                <span>申请成为农场主</span>
                                                <Icon type="right"/>
                                            </div>
                                        </Link>
                                        :
                                        <Link to='/membercenter/myshop' className="my-shop">
                                            <div className="my-shop-inner">
                                                <span>我的小店</span>
                                                <Icon type="right"/>
                                            </div>
                                        </Link>
                                }
                            </div>
                            <MyPurchase className="my-purchase-component"/>
                            <MyItem/>
                            <div className="copyright">
                                版权所有 ©宝宝的农场
                            </div>

                        </div>

                }


            </div>
        )
    }
}
export default UserCenter
