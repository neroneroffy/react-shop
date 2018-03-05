import React,{ Component } from 'react';
import './Farmer.less';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { get } from '../../fetch/get';


class Farmer extends Component{
    state={
        farmerData:[]
    };
    componentDidMount(){
        get("/mock/farmer.json").then(function(res){
            return res.json()
        }).then(data=>{
            this.setState({
                farmerData:data.farmer
            })
        })
    }


    render(){
        return (
            <div className="farmer">

                <div className="farmer-head">
                    <div className="farmer-head-inner">
                        <Link to="/membercenter/myshop" >
                            <Icon type="left" />
                            <div className="farmer-head-inner-div">返回</div>
                        </Link>
                    </div>
                </div>


                <div className="farmer-body">

                    <div className="farmer-body-top">
                        <div className="farmer-body-top-img"><img src={this.state.farmerData.img} alt=""/></div>
                        <div className="farmer-body-top-txt">
                            <div>我是 <span>{this.state.farmerData.name}</span> </div>
                            <div>我要为 <span>{this.state.farmerData.title}</span> 代言</div>
                        </div>
                    </div>

                    <div className="farmer-body-center">
                        <div className="farmer-body-center-img">

                        </div>
                        <div className="farmer-body-center-txt">
                            <div className="farmer-body-center-txt-left">
                                <Link to="" >
                                    <Icon type="link" />
                                    <div className="">链接推广</div>
                                </Link>
                            </div>
                            <div className="farmer-body-center-txt-right">
                                <Link to="" >
                                    <Icon type="picture" />
                                    <div className="">图片推广</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="farmer-foot">
                   <div className="farmer-foot-inner">
                       <div className="farmer-foot-top">推广农场主</div>
                   </div>
                       <div className="farmer-foot-center">
                           <div className="farmer-foot-center-inner">
                               <div className="farmer-foot-center-div" >
                                   <span>第一步</span>
                                   <span>转发商品链接或商品图片给微信好友;</span>
                               </div>
                               <div className="farmer-foot-center-div">
                                   <span>第二步</span>
                                   <span>从您转发的链接或图片进入商城的好友，系统将自动锁定成为您的客户，他们在微信商城中购买任何商品，您都可以获得分销佣金；</span>
                               </div>
                               <div className="farmer-foot-center-div">
                                   <span>第三步</span>
                                   <span>您可以在农场旗舰店查看【我的团队】和【分销订单】，好友确认收货后佣金可提现。</span>
                               </div>
                               <div className="farmer-foot-bottom">
                                    <span>说明：分享后会带有独有的推荐码，您的好友访问之后，系统会自动检测并记录客户关系。
                                        如果您的好友已被其他人抢先发展成客户，他就不能成为您的客户，以最早发展成为客户为准</span>
                               </div>
                           </div>

                       </div>


                </div>


            </div>
        )
    }
}
export default Farmer