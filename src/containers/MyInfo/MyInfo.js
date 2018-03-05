import React,{ Component } from 'react';
import './MyInfo.less';
import {Link} from 'react-router-dom';
import { Icon,Cascader } from 'antd';
import { get } from "../../fetch/get";
import {API} from '../../constants/API';
import { openId } from '../../util/openId';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
class MyInfo extends Component{
    state={
        areaData:[],
        areaAddress:[],
        modalShow:false,
        tipModal:false,
        //openId:"oYShxv-i28ctNbZjiFy3hI-KBp9k",
        /*provinceName:"请选择省份",*/
        city:[],
        isEdit:false,
        /*cityName:"请选择城市",*/
        //timeDate:"",

        defaultText:"点击选择日期",
        timeChanged:false,
        inputValue:"",
        areaIds:[],
        uNameHelp:"",
        uTelHelp:"",
        uChatHelp:"",
        uSexHelp:"",
        uAddressHelp:"",
        uDateHelp:"",
        userName:"",
        userTelPhone:"",
        userWeChat:"",
        userSex:"",
        userInformation:[],
        openId:openId(document.cookie),
        success:false
    };
    componentWillMount(){
    };
    componentDidMount(){
        get(`${API}/memberDetail/${this.state.openId}`).then(res=>{
            return res.json()
        }).then(data=>{
            //数据回显
            if(data.result){
                this.setState({
                    userName:data.data[0].realName,
                    userTelPhone:data.data[0].mobile,
                    userWeChat:data.data[0].wxAccount,
                    userSex:data.data[0].sex,
                    inputValue:`${data.data[0].province},${data.data[0].city},${data.data[0].area}`,

                });
                this.refs.uName.value = data.data[0].realName;
                this.refs.tels.value = data.data[0].mobile;
                this.refs.wxName.value = data.data[0].wxAccount;
                console.log(this.refs.sexSelection.children);
                for(let i=0;i<this.refs.sexSelection.children.length;i++){
                    if(this.refs.sexSelection.children[i].children[0].value == data.data[0].sex){
                        this.refs.sexSelection.children[i].children[0].checked = true
                    }

                }
                let area = document.getElementsByClassName('ant-cascader-picker-label')[0];
                area.innerText = `${data.data[0].province}/${data.data[0].city}/${data.data[0].area}`;
                let areaSelect = document.getElementsByClassName('ant-cascader-input')[0];
                areaSelect.placeholder = ""

                /*

                this.setState({
                    uNameHelp:data.data[0].realName
                })
*/
            }
            console.log(data)
        });


        //请求级联第一级数据
        get(`${API}/area/province`).then(res=>{
            return res.json()
        }).then(data=>{
            data.map((item,index)=>{
                item.isLeaf=false
            });
            this.setState({
                areaAddress:data
            })
        })
    };

    onChange=(value,selectedOptions)=>{
        this.setState({
            inputValue: selectedOptions.map(o => o.label).join(', '),
            areaIds:value,
            uAddressHelp:""
        },()=>{
            console.log(value);
            console.log(selectedOptions);
            console.log(this.state.inputValue)
        })
    };

    loadData=(selectedOptions)=>{
        const targetOption=selectedOptions[selectedOptions.length-1];
        targetOption.loading=true;
        get(`${API}/area/sub/${targetOption.value}`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            targetOption.loading=false;
            let childrenData=[];
            data.map((item,index)=>{
                if(item.areaType==="district"){
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
            targetOption.children=childrenData;
            this.setState({
                areaAddress: [...this.state.areaAddress]
            })
        })

    };







    changeFocus1=()=>{
        this.setState({
            uNameHelp:""
        })
    };

    changeFocus2=()=>{
        this.setState({
            uTelHelp: ""
        })
    };

    changeFocus3=()=>{
        this.setState({
            uChatHelp: ""
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

    changeWeChat=(e)=>{
        let uChat = e.target.value;
        this.setState({
            userWeChat:uChat
        })
    };

    changeSex=(e)=>{
        let uSex=e.target.value;
        this.setState({
            userSex:uSex,
            uSexHelp:""
        })
    };


    confirmSubmit = () => {
        let reg1 = /^[\u4E00-\u9FA5]{2,4}$/;
        let reg2 = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (this.state.userName === "") {
            this.setState({
                uNameHelp: "用户名不能为空"
            });
            return
        } else if (this.state.userName !== "" && reg1.test(this.state.userName) === false) {
            this.setState({
                uNameHelp: "请输入正确的用户名"
            });
            return
        } else if (this.state.userTelPhone === "") {
            this.setState({
                uTelHelp: "手机号不能为空"
            });
            return
        } else if (this.state.userTelPhone !== "" && reg2.test(this.state.userTelPhone) === false) {
            this.setState({
                uTelHelp: "请输入正确的手机号"
            })
        } else if (this.state.userWeChat === "") {
            this.setState({
                uChatHelp: "微信号不能为空"
            });
            return
        } else if (this.state.userSex === "") {
            this.setState({
                uSexHelp: "性别不能为空"
            })
        } else if (this.state.inputValue === "") {
            this.setState({
                uAddressHelp: "地址不能为空"
            })
        } else{
            this.state.inputValue = this.state.inputValue.split(',');
            this.setState({
                userInformation:{
                    openid:this.state.openId,
                    realName:this.state.userName,
                    mobile:this.state.userTelPhone,
                    wxAccount:this.state.userWeChat,
                    sex:this.state.userSex,
                    provinceId:this.state.areaIds[0],
                    province: this.state.inputValue[0],
                    cityId:this.state.areaIds[1],
                    city: this.state.inputValue[1],
                    areaId:this.state.areaIds[2],
                    area: this.state.inputValue[2],

                }
            },()=>{
                console.log(this.state.userInformation);
                fetch(`${API}/memberData`,{
                    method:"POST",
                    body:JSON.stringify(this.state.userInformation)
                }).then(res=>{
                    return res.json()
                }).then(data=>{
                    console.log(data);
                    if(data.result===true){
                        this.setState({
                            success:true
                        },()=>{
                            window.setTimeout(()=>{
                                this.setState({
                                    success:false
                                },()=>{
                                    window.location.hash='/membercenter';
                                })
                            },800)
                        })
                        //sessionStorage.setItem("userInformationData",JSON.stringify(data))
                          //window.location.pathname ="/membercenter/checkresult"
                    }else{

                    }
                })
            })

        }
    };

/*    handleSelect = (time) => {
        if(time-new Date()>0){
            return
        }
        this.setState({
            timeDate:DateFormat(time),
            timeChanged:true,
            uDateHelp:""
        },()=>{
            console.log(this.state.timeDate)
        });
    };*/


    render(){
        return (
            <div className="my-info">
                <ReactCSSTransitionGroup
                    transitionName="edit-success"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.state.success?
                            <div className="edit-info-success">
                                <div>
                                    <Icon type="smile-o" />
                                </div>
                                <div>
                                    修改成功
                                </div>
                            </div>
                            :
                            ""
                    }
                </ReactCSSTransitionGroup>
                <div className="my-info-head">
                    <div className="my-info-head-inner">
                        <Link to="/membercenter" className="my-info-head-content">
                            <Icon type="left" />
                            <span>我的资料</span>
                        </Link>

                    </div>
                </div>

                <div className="my-info-body">
                    <div className="my-info-body-content">
                        <div className="my-info-body-item" id="my-info-body-item">
                            <span className="my-info-body-item-span">姓名</span>
                            <input type="text" placeholder="请输入您的姓名" name="username" id="uName" ref="uName"  onFocus={this.changeFocus1}  onChange={this.changeUsername.bind(this)}/>
                            <span className="help-block">{this.state.uNameHelp}</span>
                        </div>
                        <div className="my-info-body-item">
                            <span className="my-info-body-item-span">手机号码</span>
                            <input type="text" placeholder="请输入您的手机号" name="telphone" id="tels" ref="tels"  onFocus={this.changeFocus2}  onChange={this.changeTel.bind(this)}/>
                            <span className="help-block" id="help-block">{this.state.uTelHelp}</span>
                        </div>
                        <div className="my-info-body-item">
                            <span className="my-info-body-item-span">微信号</span>
                            <input type="text" placeholder="请输入微信号" onFocus={this.changeFocus3}  onChange={this.changeWeChat.bind(this)} ref="wxName"/>
                            <span className="help-block">{this.state.uChatHelp}</span>
                        </div>
                        <div className="my-info-body-item-sex">
                            <span className="my-info-body-item-span">性别</span>
                            <div className="my-info-body-item-sex-txt" ref="sexSelection">
                                <div className="my-info-body-item-sex1">
                                    <input  type="radio" name="sex"  onClick={this.changeSex.bind(this)} value="男"/>
                                    <div id="sex-man">男</div>
                                </div>
                                <div className="my-info-body-item-sex2">
                                    <input  type="radio" name="sex"  onClick={this.changeSex.bind(this)} value="女"/>
                                    <div id="sex-woman">女</div>
                                </div>
                            </div>
                            <span className="help-sex">{this.state.uSexHelp}</span>
                        </div>
                        <div className="my-info-body-item my-info-body-city">
                            <span className="my-info-body-item-span">所在城市</span>
                            <Cascader
                                options={this.state.areaAddress}
                                onChange={this.onChange}
                                loadData={this.loadData}
                                placeholder={this.state.isEdit?"":"请选择城市地址"}
                                ref="cascader"
                            />
                            <span className="help-address">{this.state.uAddressHelp}</span>
                        </div>

{/*
                        <div className="my-info-body-item">

                            <span className="my-info-body-item-span" id="my-info-body-item-birthpaty">生日</span>

                            <div id="my-info-body-item-p" onClick={this.handleDate.bind(this)} >{this.state.timeChanged? `${this.state.timeDate}`:this.state.defaultText}</div>
                            <input type="text" placeholder={this.state.defaultText} onFocus={this.handleDate} onBlur={this.handBlur} defaultValue={`${this.state.time}`}/>
                            <span className="help-date">{this.state.uDateHelp}</span>
                        </div>
*/}
                    </div>
                </div>

                <div className="my-info-foot">
                    <div className="my-info-foot-inner">
                        <button onClick={this.confirmSubmit.bind(this)}>确认修改</button>
                    </div>
                </div>




            </div>
        )
    }
}
export default MyInfo;