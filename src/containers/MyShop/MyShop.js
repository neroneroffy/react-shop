import React,{ Component } from 'react';
import './MyShop.less';
import { Icon } from 'antd';
import {Link} from 'react-router-dom';
import { get } from "../../fetch/get";
import { openId } from '../../util/openId';
import { API } from '../../constants/API';
import Loading from '../../components/Loading/Loading';


class MyShop extends  Component{
    state={
        myShopData:[],
        openId:openId(document.cookie),
        isLoading:true
    };

    componentDidMount(){
        get(`${API}/memberShopDetail/${this.state.openId}`).then(function(res){
            return res.json()
        }).then( data=>{
            if(data.result){
                this.setState({
                    myShopData:data.data[0],
                    isLoading:false
                })
            }
        })
    };

    render(){
        return (
           <div className="my-shop">

               {
                    this.state.isLoading?
                        <div className="my-shop-loading">
                            <Loading/>
                        </div>
                            :
                       <div className="my-shop-content">
                           <div className="my-shop-head">
                               <div className="my-shop-all-money">
                                   <div>累计佣金:</div>
                                   <div>{this.state.myShopData.commission.toFixed(2)}元</div>
                               </div>

                               <Link to="/membercenter" className="my-shop-go-back">
                                   <Icon type="left"/>
                               </Link>
                               <div className="my-shop-user">
                                   <div className="my-shop-avatar">
                                       <img src={this.state.myShopData.photo} alt=""/>
                                   </div>
                                   <div className="my-shop-user-info">
                                       <div className="my-shop-username">
                                           <h2>{this.state.myShopData.wxName}</h2><span className="my-shop-rank">{this.state.myShopData.groupName}</span>
                                       </div>
                                       <div className="my-shop-current-money">
                                           <div>
                                               <div>可提现佣金: </div>
                                               <span>{this.state.myShopData.withdrawNum.toFixed(2)}</span> 元
                                           </div>


                                           {
                                               /*<Link to="/membercenter/withdrawcash" className="my-shop-content-remaining">提现</Link>*/
                                           }

                                       </div>
                                   </div>

                               </div>
                           </div>
                           <div className="my-shop-body">
                               <div className="my-shop-item">

                                   <Link to="distributioncash"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="pay-circle-o"/>
                                       </div>
                                       <div className="my-shop-text">分销佣金</div>
                                       <div className="my-shop-btn-content">{this.state.myShopData.commission.toFixed(2)}元</div>
                                   </Link>

                                   <Link to="distributionorder"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="layout"/>
                                       </div>
                                       <div className="my-shop-text">分销订单</div>
                                       <div className="my-shop-btn-content">{this.state.myShopData.ordersNum}笔</div>
                                   </Link>

                                   <Link to="cashdetail"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="usb"/>
                                       </div>
                                       <div className="my-shop-text">佣金明细</div>
                                       <div className="my-shop-btn-content">佣金明细</div>
                                   </Link>

                                   <Link to="myteam"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="usergroup-add"/>
                                       </div>
                                       <div className="my-shop-text">我的团队</div>
                                       <div className="my-shop-btn-content">{this.state.myShopData.groupNum}个</div>
                                   </Link>

                                   <Link to="mycustom"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="contacts"/>
                                       </div>
                                       <div className="my-shop-text">我的客户</div>
                                       <div className="my-shop-btn-content">{this.state.myShopData.memberNum}个</div>
                                   </Link>

                                   <Link to="twodimensioncode"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="qrcode"/>
                                       </div>
                                       <div className="my-shop-text">二维码</div>
                                       <div className="my-shop-btn-content">店铺推广二维码</div>
                                   </Link>

                                   <Link to="WithdrawDetail"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="database"/>
                                       </div>
                                       <div className="my-shop-text">提现记录</div>
                                       <div className="my-shop-btn-content">{this.state.myShopData.memberWithdrawNum}笔</div>
                                   </Link>

                                   {
                                       /*
                                       *  <Link to="shopsetting"  className="my-shop-shop">
                                       <div className="my-shop-icon">
                                           <Icon type="setting"/>
                                       </div>
                                       <div className="my-shop-text">小店设置</div>
                                       <div className="my-shop-btn-content">设置我的小店</div>
                                   </Link>
                                       * */
                                   }




                               </div>
                           </div>
                       </div>

               }





           </div>
        )
    }
}
export default MyShop