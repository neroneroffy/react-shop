/**
 * Created by web前端 on 2017/8/5.
 */
import React,{Component} from 'react';
import {Route,Redirect } from 'react-router-dom';
import Index from '../containers/Index/Index';
import Store from'../containers/Store/Store';
import ShopCart from'../containers/ShopCart/ShopCart';
import UserCenter from'../containers/UserCenter/UserCenter';
import Detail from'../containers/Detail/Detail';
import Recommend from '../containers/Home/Home';
import SearchPage from '../containers/SearchPage/SearchPage';
import SubmitOrder from '../containers/SubmitOrder/SubmitOrder';
import GroupSubmitOrder from '../containers/GroupSubmitOrder/GroupSubmitOrder';
import SelectMyAddress from '../containers/SelectMyAddress/SelectMyAddress';
import MyOrderForm from '../containers/MyOrderForm/MyOrderForm';
import MyInfo from '../containers/MyInfo/MyInfo';
import MyCou from '../containers/MyCou/MyCou';
import Evaluate from '../containers/Evaluate/Evaluate';
import MyShop from '../containers/MyShop/MyShop';
import BecomeFarmer from '../containers/BecomeFarmer/BecomeFarmer';
import DistributionCash from '../containers/DistributionCash/DistributionCash';
import DistributionOrder from '../containers/DistributionOrder/DistributionOrder';
import EvaluateList from '../containers/EvaluateList/EvaluateList';
import MyOrderFormDetail from '../containers/MyOrderFormDetail/MyOrderFormDetail';
import MyCollect from '../containers/MyCollect/MyCollect';
import MyRecharge from '../containers/MyRecharge/MyRecharge';
import Message from '../containers/Message/Message';
import Logistics from '../containers/Logistics/Logistics';
import Drawback from '../containers/Drawback/Drawback';
import ShopSetting from '../containers/ShopSetting/ShopSetting';
import CashDetail from '../containers/CashDetail/CashDetail';
import MyCustom from '../containers/MyCustom/MyCustom';
import TwoDimensionCode from '../containers/TwoDimensionCode/TwoDimensionCode';
import WithdrawDetail from '../containers/WithdrawDetail/WithdrawDetail';
import MyTeam from '../containers/MyTeam/MyTeam';
import Recharge from '../containers/Recharge/Recharge';
import CheckResult from '../containers/CheckResult/CheckResult';
import WithdrawResult from '../containers/WithdrawResult/WithdrawResult';
import Refund from '../containers/Refund/Refund';
import PaySuccess from '../containers/PaySuccess/PaySuccess';
import WithdrawCash from '../containers/WithdrawCash/WithdrawCash';
import Pay from '../containers/Pay/Pay';
import Tabbar from '../components/Tabbar/Tabbar';
import NewAddress from '../containers/NewAddress/NewAddress';
import Agency from '../containers/Agency/Agency';
import OrderGoodsRecord from '../containers/OrderGoodsRecord/OrderGoodsRecord';
import OrderGoodDetail from '../containers/OrderGoodDetail/OrderGoodDetail';
import SourceList from '../containers/SourceList/SourceList';
import SourceShopCart from '../containers/SourceShopCart/SourceShopCart';
import SourceSubmitOrder from '../containers/SourceSubmitOrder/SourceSubmitOrder';
import GetCoupon from '../containers/GetCoupon/GetCoupon';
import LuckyDraw from '../containers/LuckyDraw/LuckyDraw';
import './router-map.less'
class RouterMap extends Component{
/*
    state = {
        tabbar :true
    }
*/
/*
    componentWillUpdate(){
        console.log(8900989789)
        if(window.location.pathname === "/submitorder" || "/shopcart"){
            console.log(this.refs.tabbar);
        }
    }
*/
    render() {

        const RenderTabbar =()=> {
            {
                if(window.location.hash === "#/submitorder"){
                    return null
                }else if(window.location.hash === "#/groupsubmitorder"){
                    return null
                }else if(window.location.hash === "#/newaddress"){
                    return null
                }else if(window.location.hash === "#/search"){
                    return null
                }else if(window.location.hash === "#/getcoupon"){
                    return null
                }else if(window.location.hash === "#/membercenter/sourcesubmitorder"){
                    return null
                }else if(window.location.hash === "#/luckydraw"){
                    return null
                }else if(window.location.hash.slice(2,7) === "detail"){
                    return null
                }else if(window.location.hash.slice(2,19) === "myorderformdetail"){
                    return null
                }else{
                    return <Tabbar/>
                }
            }

        };
        return(

            <div className="route">
                    <Route path='/index' component={Index}></Route>
                    <Route path='/store' component={Store}></Route>
                    <Route path='/shopcart' component={ShopCart}></Route>
                    <Route exact path='/membercenter' component={UserCenter}></Route>
                    <Route path='/detail/:id' component={Detail}></Route>
                    { window.location.hash === '#/'? <Redirect to= "/index/0" component={Recommend}/> : ''}
                    { window.location.hash === '#/index'? <Redirect to= "/index/0" component={Recommend}/> : ''}
                    <Route path="/index/:id" component={Recommend}></Route>
                    <Route path="/search" component={SearchPage}></Route>
                    <Route path="/submitorder" component={SubmitOrder}></Route>
                    <Route path="/groupsubmitorder" component={GroupSubmitOrder}></Route>
                    <Route path="/membercenter/selectmyaddress" component={SelectMyAddress}></Route>
                    <Route path="/membercenter/newaddress" component={NewAddress}></Route>
                    { window.location.hash === '#/membercenter/myorderform'? <Redirect to= "/membercenter/myorderform/0" component={MyOrderForm}/> : ''}
                    <Route path="/membercenter/myorderform/:id" component={MyOrderForm}></Route>
                    <Route path="/membercenter/myinfo" component={MyInfo}></Route>
                    <Route path="/membercenter/mycou" component={MyCou}></Route>
                    <Route path="/myorderformdetail/:id" component={MyOrderFormDetail}></Route>
                    <Route path="/membercenter/mycollect" component={MyCollect}></Route>
                    <Route path="/membercenter/myrecharge" component={MyRecharge}></Route>
                    <Route path="/membercenter/message" component={Message}></Route>
                    <Route path="/membercenter/evaluate" component={Evaluate}></Route>
                    <Route path="/membercenter/myshop" component={MyShop}></Route>
                    <Route path="/membercenter/becomefarmer" component={BecomeFarmer}></Route>
                    <Route path="/membercenter/distributioncash" component={DistributionCash}></Route>
                    <Route path="/membercenter/distributionorder" component={DistributionOrder}></Route>
                    <Route path="/membercenter/myteam" component={MyTeam}></Route>
                    <Route path="/membercenter/withdrawdetail" component={WithdrawDetail}></Route>
                    <Route path="/membercenter/cashdetail" component={CashDetail}></Route>
                    <Route path="/membercenter/mycustom" component={MyCustom}></Route>
                    <Route path="/membercenter/twodimensioncode" component={TwoDimensionCode}></Route>
                    <Route path="/membercenter/evaluatelist" component={EvaluateList}></Route>
                    <Route path="/membercenter/logistics/:id" component={Logistics}></Route>
                    <Route path="/membercenter/drawback" component={Drawback}></Route>
                    <Route path="/membercenter/shopsetting" component={ShopSetting}></Route>
                    <Route path="/membercenter/recharge" component={Recharge}></Route>
                    <Route path="/membercenter/withdrawcash" component={WithdrawCash}></Route>
                    <Route path="/membercenter/checkresult" component={CheckResult}></Route>
                    <Route path="/membercenter/withdrawresult" component={WithdrawResult}></Route>
                    <Route path="/membercenter/refund" component={Refund}></Route>
                    <Route path="/membercenter/agency" component={Agency}></Route>
                    <Route path="/membercenter/ordergoodsrecord" component={OrderGoodsRecord}></Route>
                    <Route path="/membercenter/ordergoodsdetail/:id" component={OrderGoodDetail}></Route>
                    <Route path="/membercenter/sourcelist" component={SourceList}></Route>
                    <Route path="/membercenter/sourceshopcart" component={SourceShopCart}></Route>
                    <Route path="/membercenter/sourcesubmitorder" component={SourceSubmitOrder}></Route>
                    <Route path="/pay/:id" component={Pay}></Route>
                    <Route path="/newaddress" component={NewAddress}></Route>
                    <Route path="/paysuccess/:id" component={PaySuccess}></Route>
                    <Route path="/getcoupon" component={GetCoupon}></Route>
                    <Route path="/luckydraw" component={LuckyDraw}></Route>
                    <RenderTabbar/>
{/*
                {
                    window.location.pathname === "/submitorder" ?"":<Tabbar ref = "tabbar"/>
                }
                {
                    window.location.pathname === "/newaddress" ?"":<Tabbar ref = "tabbar"/>
                }
*/}



            </div>
        )
    }
}

export default RouterMap