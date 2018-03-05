import React,{Component} from "react";
import "./MyTeam.less";
import { Icon } from 'antd';
import {Link} from 'react-router-dom';
import { get } from "../../fetch/get";
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
import Loading from '../../components/Loading/Loading';



class MyTeam extends Component{
    state={
        myTeamData:[],
        openId:openId(document.cookie),
        hasBeenBottom:true,
        pageNumber:1,
        loadingPage:false,
        isLoading:true,
        noData:false
    };


    componentDidMount(){
        get(`${API}/memberGroupList/${this.state.openId}?pageNumber=${this.state.pageNumber}`).then(function(res){
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    myTeamData:data,
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
        window.addEventListener('scroll',this.handleScroll)
    }


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
                   get(`${API}/memberGroupList/${this.state.openId}?pageNumber=${this.state.pageNumber}`).then((res)=>{
                       return res.json()
                   }).then(data=>{
                       if(data.result){
                           this.state.myTeamData.data=this.state.myTeamData.data.concat(data.data);
                           this.setState({
                               isLoading:false,
                               loadingPage:false,
                               hasBeenBottom:true
                           })
                       }else{
                            this.state.myTeamData.result=data.result;
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

        let myTeamSame=()=>{
           return(
               <div className="my-team-body-txt">
                   <div className="myTeam-nav">
                       <div className="myTeam-nav-txt">
                           <div>成员信息</div>
                           <div>TA的佣金/成员</div>
                       </div>
                   </div>
                   <div className="myTeam-content">
                       {
                           this.state.myTeamData.data.map((item,index)=>{
                               return(
                                   <div className="myTeam-nav-detail" key={index}>
                                       <div className="myTeam-nav-detail-content">
                                           <div className="myTeam-nav-detail-content-left">
                                               <div className="myTeam-nav-detail-content-div1">
                                                   <img src={item.photo} alt=""/>
                                               </div>
                                               <div className="myTeam-nav-detail-content-div2">
                                                   <div>{item.wxName}</div>
                                                   <div>{item.createTime}</div>
                                               </div>
                                           </div>
                                           <div className="myTeam-nav-detail-content-right">
                                                  <div>
                                                      {
                                                          item.orderPrice !=null?<div>+{item.orderPrice.toFixed(2)}</div>:<div>+0.00</div>
                                                      }
                                                  </div>
                                               <div>{item.orderNum}个成员</div>
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

        return (
            <div className="my-team">
                <div className="my-team-head">
                    <div className="my-team-head-inner">
                        <Link to="/membercenter/myshop" className = "my-team-back">
                            <Icon type="left" />
                                <span>我的团队</span>
                                {
                                    this.state.myTeamData.data==null?
                                        <span>(0)</span>
                                        :
                                        <span>({this.state.myTeamData.dataNum})</span>
                                }
                        </Link>

                    </div>
                </div>
                <div className="my-team-body">
                            {
                                this.state.isLoading?
                                    <div className="order-form-loading">
                                        <Loading/>
                                    </div>
                                    :
                                    !this.state.noData?
                                        this.state.myTeamData.result?
                                            <div className="my-team-txt">
                                                {myTeamSame()}
                                                {
                                                    this.state.loadingPage?
                                                        <div className="my-team-pagnation-loading">
                                                            <Loading/>
                                                        </div>
                                                        :
                                                        ""
                                                }
                                            </div>
                                           :
                                           <div className="my-team-txt">
                                               {myTeamSame()}
                                               <div className="my-teat-txt-msg">数据已加载完毕</div>
                                           </div>
                                        :
                                        <div className="myTeamNull">
                                            您还没有团队信息
                                        </div>
                            }

                </div>
            </div>
        )
    }
}
export default MyTeam