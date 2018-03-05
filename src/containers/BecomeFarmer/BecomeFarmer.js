import React,{ Component } from "react";
import "./BecomeFarmer.less";
import {API} from '../../constants/API';
import { Icon,Cascader } from "antd";
import Loading from "../../components/Loading/Loading";
import { get } from "../../fetch/get";
import { openId } from '../../util/openId';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import becomeFarmerImg from './becomeFarmer.jpg';

class BecomeFarmer extends Component{
    state={
        farmerMess:[],
        areaData:[],
        inputValue:"",
        openId:openId(document.cookie),
        userName:"",
        areaIds:[],
        userInformation:[],
        userTelPhone:"",
        userWeChat:"",
        userDetailAddress:"",
        uNameHelp:"",
        uTelHelp:"",
        divInner:"",
        liked:false,
        telPhone:true,
        inviterInfoData:{},
        isLoading:true
    };


    componentDidMount(){
        get(`${API}/userinfo/${this.state.openId}`).then(res=> {
            return res.json()
        }).then(data=>{
            this.setState({
                inviterInfoData:data.cookieModel
            },()=>{
                console.log(this.state.inviterInfoData.status);
                if(this.state.inviterInfoData.groupId !== 1){
                    window.location.hash = '#/membercenter/myshop'
                }else{
                    if(this.state.inviterInfoData.status == 2 || this.state.inviterInfoData.status == 4){
                        window.location.hash = '#/index'
                    }else{
                        get(`${API}/area/province`).then((res)=>{
                            return res.json()
                        }).then(data=>{
                            this.setState({
                                isLoading:false
                            });
                            data.map((item,index)=>{
                                item.isLeaf=false
                            });
                            this.setState({
                                areaData:data
                            })
                        })

                    }
                }

            })
        });

    }



    onChange = (value, selectedOptions) => {
        this.setState({
            inputValue: selectedOptions.map(o => o.label).join(', '),
            areaIds:value
        },()=>{
            console.log(this.state.inputValue);
            let inputArray=this.state.inputValue.split(",");

        });
    };
    loadData=(selectedOptions)=>{

        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        get(`${API}/area/sub/${targetOption.value}`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            targetOption.loading=false;
            let childrenData=[];
            data.map((item,index)=>{
                if(item.areaType=="district"){
                    childrenData.push({
                        label:item.label,
                        value:item.value
                    })
                }else{
                    childrenData.push({
                        label:item.label,
                        value:item.value,
                        isLeaf:false
                    })
                }
            });
            targetOption.children = childrenData;
            this.setState({
                areaData: [...this.state.areaData]
            });
        })
    };

    changeUsername=(e)=>{
        let uname = e.target.value;
        this.setState({
            userName: uname
        })
    };

    changeTel=(e)=>{
        let uTel = e.target.value;
        this.setState({
            userTelPhone:uTel
        })
    };

    changeChat=(e)=>{
        let uChat = e.target.value;
        this.setState({
            userWeChat:uChat
        })
    };

    changeDetail=(e)=>{
        let uDetailAdress = e.target.value;
        this.setState({
            userDetailAddress:uDetailAdress
        })
    };

    confirmSubmit=()=>{
        //console.log(56654645);
        if(this.state.userName===""){
            this.setState({
                divInner:"用户名不能为空",
                liked:true
            },()=>{
                window.setTimeout(()=>{
                    this.setState({
                        liked:false
                    })
                },800)
            });
            return
        }else if(this.state.telPhone){
            let reg=/^1[3|4|5|8|7][0-9]\d{8}$/;
            if(this.state.userTelPhone===""){
                this.setState({
                    divInner:"手机号不能为空",
                    liked:true
                },()=>{
                    window.setTimeout(()=>{
                        this.setState({
                            liked:false
                        })
                    },800)
                });
                return
            }else if(reg.test(this.state.userTelPhone)===false){
                this.setState({
                    divInner:"请输入正确手机号",
                    liked:true
                },()=>{
                    window.setTimeout(()=>{
                        this.setState({
                            liked:false
                        })
                    },800)
                });
                return
            }else if(this.state.userWeChat===""){
                this.setState({
                    divInner:"微信号不能为空",
                    liked:true
                },()=>{
                    window.setTimeout(()=>{
                        this.setState({
                            liked:false
                        })
                    },800)
                });
                return
            }else if(this.state.inputValue===""){
                this.setState({
                    divInner:"所在城市不能为空",
                    liked:true
                },()=>{
                    window.setTimeout(()=>{
                        this.setState({
                            liked:false
                        })
                    },800)
                });
                return
            }else if(this.state.userDetailAddress===""){
                this.setState({
                    divInner:"详细地址不能为空",
                    liked:true
                },()=>{
                    window.setTimeout(()=>{
                        this.setState({
                            liked:false
                        })
                    },800)
                });
                return
            }else{
                this.setState({
                    inputValue: this.state.inputValue.split(",")

                },()=>{

                    this.setState({
                        userInformation:{
                            openid:this.state.openId,
                            realName:this.refs.userName.value,
                            mobile:this.refs.userTelPhone.value,
                            wxAccount:this.refs.userWeChat.value,
                            provinceId:this.state.areaIds[0],
                            province: this.state.inputValue[0],
                            cityId:this.state.areaIds[1],
                            city: this.state.inputValue[1],
                            areaId:this.state.areaIds[2],
                            area: this.state.inputValue[2],
                            address:this.refs.userDetailAddress.value
                        }
                    },()=>{

                        fetch(`${API}/memberFarmer`,{
                           method:"POST",
                           body:JSON.stringify(this.state.userInformation)
                       }).then(res=>{
                           return res.json()
                       }).then(data=>{
                            console.log(data);
                            if(data.result===true){
                                localStorage.setItem("userData",JSON.stringify(data.cookieModel))
                                window.location.hash ="/membercenter/checkresult"
                            }else{
                                return null
                            }
                       })
                    })

                })

            }
        }

    };



    componentWillUnmount(){
        sessionStorage.removeItem("inviterInfo")
    }

    render(){

            return(
                    <div>
                        {
                            this.state.isLoading?
                                <div className="farmer-loading">
                                    <Loading/>
                                </div>
                                :
                                <div className="become-farmer">
                                    <div className="become-farmer-head">
                                        <img src={becomeFarmerImg} alt=""/>
                                    </div>

                                    <div className="become-farmer-body">

                                        <div className="become-farmer-body-top">
                                            <div>欢迎加入!  请填写申请信息</div>
                                            <div>
                                                邀请人：
                                                {
                                                    this.state.inviterInfoData.id==this.state.inviterInfoData.inviterId?
                                                        <span>宝宝的农场</span>
                                                        :
                                                        <span>{this.state.inviterInfoData.inviterName}</span>
                                                }

                                            </div>
                                        </div>

                                        <div className="become-farmer-body-center">
                                            <div className="become-farmer-body-input">
                                                <input placeholder="请填写真实姓名，用于结算" onChange={this.changeUsername.bind(this)} ref="userName"/>
                                            </div>
                                            <div className="user-mess become-farmer-body-input">
                                                <input placeholder="请填写手机号码方便联系" size="large" onChange={this.changeTel.bind(this)} ref="userTelPhone"/>
                                            </div>
                                            <div className="user-mess become-farmer-body-input">
                                                <input placeholder="请填写微信号" size="large" onChange={this.changeChat.bind(this)} ref="userWeChat"/>
                                            </div>
                                            <div className="user-mess">
                                                <div className="user-mess-inner">
                                                    所在城市
                                                </div>

                                            </div>

                                            <div className="user-mess-inner-input">
                                                <Cascader
                                                    options={this.state.areaData}
                                                    onChange={this.onChange}
                                                    onFocus={this.changeFocusCity}
                                                    loadData={this.loadData}
                                                    placeholder={this.state.isEdit?"":"请选择所在城市"}
                                                    style={this.state.width}
                                                />
                                            </div>
                                            <div className="user-mess become-farmer-body-input">
                                                <input type="text" placeholder="请添加详细地址便于收货" onChange={this.changeDetail.bind(this)} ref="userDetailAddress"/>
                                            </div>

                                            <div className="become-farmer-submit" onClick={this.confirmSubmit.bind(this)}>申请成为农场主</div>
                                            <ReactCSSTransitionGroup
                                                transitionName="warning"
                                                transitionEnterTimeout={500}
                                                transitionLeaveTimeout={600}
                                            >
                                                {
                                                    this.state.liked?
                                                        <div className="clear-div">
                                                            <div><Icon type="exclamation-circle-o" /></div>
                                                            {this.state.divInner}
                                                        </div>
                                                        :
                                                        ""
                                                }

                                            </ReactCSSTransitionGroup>
                                        </div>

                                    </div>

                                    <div className="become-farmer-foot">
                                        <div>农场主特权</div>
                                        <div className="become-farmer-foot-txt">
                                            <div className="become-farmer-foot-inner">
                                                <div className="become-farmer-foot-inner-pic">
                                                    <Icon type="qrcode" />
                                                </div>
                                                <div className="become-farmer-foot-inner-text">
                                                    <p>独立微店</p>
                                                    <p>拥有自己的微店及推广二维码</p>
                                                </div>
                                            </div>
                                            <div className="become-farmer-foot-inner">
                                                <div className="become-farmer-foot-inner-pic">
                                                    <Icon type="pay-circle" />
                                                </div>
                                                <div className="become-farmer-foot-inner-text">
                                                    <p>推销拿佣金</p>
                                                    <p>微店卖出商品，您可以获得佣金</p>
                                                </div>
                                            </div>
                                            <div className="become-farmer-foot-inner-txt">
                                                <p>农场主的商品销售统一由厂家直接收款，直接发货，并提供产品的售后服务，分销佣金由厂家统一设置。</p>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                        }
                    </div>
            )
        }

}

export default BecomeFarmer