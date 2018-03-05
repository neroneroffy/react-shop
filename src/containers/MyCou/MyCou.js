import React,{ Component } from 'react';
import './MyCou.less';
import {Link} from 'react-router-dom';
import { Icon, Tabs} from 'antd';
import { get } from "../../fetch/get";
import SingleCoupon from '../../components/SingleCoupon/SingleCoupon';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
import Loading from '../../components/Loading/Loading'
const TabPane = Tabs.TabPane;

class MyCou extends Component{
    state={
        couponData:[],
        storeCoupon:[],
        isSelectData:0,
        openId:openId(document.cookie),
        result:null
    };
    componentDidMount(){
        get(`${API}/personalcenter/couponlist/${this.state.openId}`).then((res)=>{
            return res.json()
        }).then(data=>{
            console.log(data);
           if(data.result){
               this.setState({
                   couponData:data.coupon,
                   storeCoupon:data.coupon,
                   result:data.result
               },()=>{
                   this.filterCoupon(1)//最开始筛选出未使用的
               })
           }else{
               this.setState({
                   couponData:[],
                   storeCoupon:[],
                   result:data.result
               })
           }
        });
        document.body.scrollTop = 0;
    };
    //筛选优惠券类型函数
    //expired 0未过期  1已过期
    //isUsed  1未使用  2已使用
    filterCoupon=(condition)=>{

        this.setState({
            couponData:this.state.storeCoupon
        },()=>{
            let tempCoupon=[];
            this.state.couponData.map((item,index)=>{
               if(item.expired == 0){
                    console.log(`是否使用${item.isUsed}`)
                   if(item.isUsed == condition){
                       tempCoupon.push(item)
                   }
               }
            });
            this.setState({
                couponData:tempCoupon,
                isSelectData:0
            },()=>{

            })
        });
    };
    expiredCoupon=(condition)=>{
        this.setState({
            couponData:this.state.storeCoupon
        },()=>{
            let tempCoupon=[];
            this.state.couponData.map((item,index)=>{
                if(item.expired == condition){
                    tempCoupon.push(item)
                }
            });
            this.setState({
                couponData:tempCoupon,
                isSelectData:1
            },()=>{

            })
        })
    };

    //点击切换优惠券类型
    tabCoupon=(key)=>{
        if( key == 1 ){
            this.filterCoupon(1)
        }else if( key == 2 ){
            this.filterCoupon(2)
        }else if( key == 3 ){
            this.expiredCoupon(1)
        }
    };
    render() {
        let singleCoupon=(flag,use)=>{
            return (
                this.state.result===null?
                    <div className="mycou-loading">
                        <Loading/>
                    </div>
                    :
                    this.state.result === false?
                       <p className="couponNull">您还没有优惠券</p>
                        :
                        this.state.couponData.map((item,index)=>{
                            return (
                                <SingleCoupon  price = {item.price} condition ={item.condition} deadline={item.deadline} key={index} isSelect={flag} isUsed={use} couponName={item.couponName}/>
                            )
                        })
            )
        };
        return (
            <div className="my-cou">
                <div className="my-cou-head">
                    <div className="my-cou-head-inner">
                        <Link to="/membercenter" >
                            <Icon type="left" />
                        </Link>
                        <div className="my-cou-head-content">我的优惠券</div>
                    </div>
                </div>
                <div className="coupon-body">
                    <Tabs defaultActiveKey="1" onChange={ this.tabCoupon } forceRender={true}>
                        <TabPane tab="未使用" key="1" forceRender={false}>
                            <div className="coupon-content">
                                {singleCoupon("",1)}
                            </div>
                        </TabPane>
                        <TabPane tab="已使用" key="2" forceRender={false}>
                            <div className="coupon-content">
                                {singleCoupon(1,2)}
                            </div>
                        </TabPane>
{/*
                        <TabPane tab="已过期" key="3">
                            <div className="coupon-content">
                                {singleCoupon()}
                            </div>

                        </TabPane>
*/}
                    </Tabs>
                </div>
            </div>
        );
    }
}
export default MyCou;