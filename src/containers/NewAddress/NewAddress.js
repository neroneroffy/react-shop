/**
 * Created by web前端 on 2017/10/9.
 */
import React,{Component} from 'react';
import { get } from '../../fetch/get';
import { Icon, Modal,Cascader } from 'antd';
import Loading from '../../components/Loading/Loading';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {API} from '../../constants/API';
import './NewAddress.less';
import { openId } from '../../util/openId';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class NewAddress extends Component{
    constructor(props){
        super(props);
        this.state={
            addressList:[],
            addressEdit:false,
            newAddressData:[],
            modalKey:0,
            isNew:false,
            isEdit:false,
            reEditData:[],
            areaData:[],
            whichChanged:"",
            inputValue:"",
            isDefault:false,
            areaIds:[],
            openId:openId(document.cookie),
            editId:"",
            isLoading:false,
            delAddressId:"",
            thisIndex:"",
            verifyContent:"",
            showWarning:false,
        }
    };
    componentDidMount(){
        document.body.scrollTop=0;
        this.setState({
            isLoading:true
        });
        get(`${API}/member/address/list/${this.state.openId}`).then((res)=>{
            return res.json()
        }).then(data =>{
            this.setState({
                isLoading:false
            });
            console.log(data)
            if(data.result){
                this.setState({
                    addressList:data
                })
            }else{
                this.setState({
                    addressList:data
                })
            }
        });
        //请求级联第一级数据
        get(`${API}/area/province`).then( res=>{
            return res.json()
        }).then(data=>{
            data.map((item,index)=>{
                item.isLeaf = false
            });
            this.setState({
                areaData:data
            })
        });
    }
    //级联选框内选择完成的回调
    onChange = (value, selectedOptions) => {
        this.setState({
            inputValue: selectedOptions.map(o => o.label).join(', '),
            areaIds:value
        });
    };
    //只有当选项中有isLeaf属性时候才会触发loadData函数
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];//当前选择的对象 如{value: 3, label: "天津", isLeaf: false}
        targetOption.loading = true;
        //发送当前选择的id给后台
        get(`${API}/area/sub/${targetOption.value}`).then(res=>{
            return res.json()
        }).then( data =>{
            targetOption.loading = false;
            //请求回来之后，设置children
            let childrenData = [];
            //let level =data[0].value.toString()[1];
            data.map((item,index)=>{
                if(item.areaType === "district"){
                    childrenData.push({
                        label: item.label,
                        value: item.value,
                    });
                }else{
                    childrenData.push({
                        label: item.label,
                        value: item.value,
                        isLeaf: false,
                    });
                }
            });
            targetOption.children = childrenData;

            this.setState({
                areaData: [...this.state.areaData],
            });
        });
    };
    reEditAddress=(index)=>{

        this.setState({
            isNew:true,
            isEdit:true,
            reEditData:this.state.addressList.data[index],
            whichChanged:index,
            isDefault:this.state.addressList.data[index].isDefault == 1?true:false,
            editId:this.state.addressList.data[index].id
        },()=>{

            //选择修改某一个人信息的时候，赋值
            this.refs.name.value=this.state.reEditData.recipients;
            this.refs.phone.value=this.state.reEditData.mobile;
            this.refs.detailAddress.value=this.state.reEditData.address;
            this.setState({
                inputValue:`${this.state.reEditData.province},${this.state.reEditData.city},${this.state.reEditData.area}`,
                areaIds:[this.state.addressList.data[index].provinceId]
            });
            let areaSapn = document.getElementsByClassName("ant-cascader-picker-label")[0];
            //选择修改某一个人的信息的时候，给三级联动选框赋值
            areaSapn.innerHTML = `${this.state.reEditData.province}/${this.state.reEditData.city}/${this.state.reEditData.area}`;
        });

    };

    showAddressInfo=()=>{
        this.setState({
            isNew:true,
            modalKey:this.state.modalKey+1,
            isDefault:false,
            newAddressData:[]
        })
    };
    setDefault=()=>{
        this.setState({
            isDefault:!this.state.isDefault
        })
    };
    handleOk=()=>{
        //验证姓名
        if(this.refs.name.value === ""){
            this.setState({
                showWarning:true,
                verifyContent:"姓名不能为空"
            },()=>{
                window.setTimeout(()=>{
                    this.setState({
                        showWarning:false,
                        verifyContent:""
                    })
                },800)
            });
            return

        }
        //验证手机号
        let reg=/^1[3|4|5|8|7][0-9]\d{8}$/;
        if(this.refs.phone.value==="" || reg.test(this.refs.phone.value)===false){
            this.setState({
                showWarning:true,
                verifyContent:"请输入正确手机号"
            },()=>{
                window.setTimeout(()=>{
                    this.setState({
                        showWarning:false,
                        verifyContent:""
                    })
                },800)
            });
            return
        }
        //验证三级联动
        if(this.state.inputValue === ""){
            this.setState({
                showWarning:true,
                verifyContent:"所在地区不能为空"
            },()=>{
                window.setTimeout(()=>{
                    this.setState({
                        showWarning:false,
                        verifyContent:""
                    })
                },800)
            });
            return
        }
        //验证详细地址
        if(this.refs.detailAddress.value === ""){
            this.setState({
                showWarning:true,
                verifyContent:"详细地址不能为空"
            },()=>{
                window.setTimeout(()=>{
                    this.setState({
                        showWarning:false,
                        verifyContent:""
                    })
                },800)
            });
            return
        }


        //判断是编辑的还是新增的
        if(this.state.isEdit){

            this.setState({
                inputValue:this.state.inputValue.split(",")
            },()=>{
                this.setState({
                    newAddressData:{
                        openId:this.state.openId,
                        memberName:this.refs.name.value,
                        phone:this.refs.phone.value,
                        address:this.refs.detailAddress.value,
                        provinceId:this.state.areaIds[0],
                        cityId:this.state.areaIds[1],
                        areaId:this.state.areaIds[2],
                        province:this.state.inputValue[0],
                        city:this.state.inputValue[1],
                        area:this.state.inputValue[2],
                        isDefault:this.state.isDefault?1:0,
                        id:this.state.editId
                    }
                },()=>{
                    fetch(`${API}/member/address/add`,{
                        method:'POST',
                        body:JSON.stringify(this.state.newAddressData)
                    }).then( res=> {
                        return res.json()
                    }).then( data=>{

                        this.setState({
                            addressList:data
                        })
                    });
                })
            })
        }else {
            this.setState({
                inputValue: this.state.inputValue.split(",")
            }, () => {
                this.setState({
                    newAddressData: {
                        openId: this.state.openId,
                        memberName: this.refs.name.value,
                        phone: this.refs.phone.value,
                        address: this.refs.detailAddress.value,
                        provinceId: this.state.areaIds[0],
                        cityId: this.state.areaIds[1],
                        areaId: this.state.areaIds[2],
                        province: this.state.inputValue[0],
                        city: this.state.inputValue[1],
                        area: this.state.inputValue[2],
                        isDefault: this.state.isDefault ? 1 : 0
                    }
                }, () => {

                    fetch(`${API}/member/address/add`, {
                        method: 'POST',
                        body: JSON.stringify(this.state.newAddressData)
                    }).then(res => {
                        return res.json()
                    }).then(data => {
                        this.setState({
                            addressList: data
                        })
                    });
                })
            })

        }
        this.setState({
            isNew:false,
            isEdit:false
        });

    };
    handleCancel=()=>{
        this.setState({
            isNew:false,
            isEdit:false
        })
    };
    goBack(){
       let initialData = JSON.parse(sessionStorage.getItem('initialData'));
        window.history.back()
    }
    error=()=>{
        Modal.error({
            title: '地址添加失败',
            content: '请重新添加',
        });
    };
    //删除地址
    delAddress=(index)=>{
        this.setState({
            delAddressId:this.state.addressList.data[index].id,
            thisIndex:index
        });
        get(`${API}/member/address/del/${this.state.addressList.data[index].id}`).then(res=>{
            return res.json();
        }).then(data=>{
            console.log(data)
            this.setState({
                addressList:data
            })
        })
    };
    transferAddressId=(index)=>{
        sessionStorage.setItem('addressId',`${this.state.addressList.data[index].id}`)
        let initialData = JSON.parse(sessionStorage.getItem('initialData'));
    };
    render(){
        return (
            <div className="new-address">
                <div className="new-address-my-address">
                    <div className="new-address-address-top">
                        <div className="new-address-address-inner">
                            <div className="go-back-to-select-address" onClick={this.goBack.bind(this)}>
                                <Icon type="left"/>
                                返回
                            </div>

                        </div>
                    </div>
                    <div className="new-address-address-list">
                        {/*<div className="new-address-address-loading"><Loading/></div>*/}
                        {
                            this.state.isLoading?
                                <div className="new-address-loading">
                                    <Loading/>
                                </div>
                                :
                                    this.state.addressList.result?
                                        <div>
                                            {
                                                this.state.addressList.data?
                                                    this.state.addressList.data.map((item,index)=>{
                                                        return (
                                                            <div className="new-address-address-item" key={index}>
                                                                {
                                                                    window.location.hash === "#/membercenter/newaddress"?
                                                                        <div className="new-address-address-list-inner">
                                                                            <div className="new-address-user-info">
                                                                                <div className="new-address-add-name" >{item.recipients}</div>
                                                                                <div className="new-address-add-tele" >{item.mobile}</div>
                                                                            </div>
                                                                            {item.isDefault == 1?<p>[默认地址]</p>:""}
                                                                            <div className="new-address-add-show" >{item.province+item.city+item.area+item.address}</div>
                                                                        </div>
                                                                        :
                                                                        <Link to={sessionStorage.getItem('lastPage') === 'submitorder'?'/submitorder':'/groupsubmitorder'} className="new-address-address-list-inner" onClick={this.transferAddressId.bind(this,index)}>
                                                                            <div className="new-address-user-info">
                                                                                <div className="new-address-add-name" >{item.recipients}</div>
                                                                                <div className="new-address-add-tele" >{item.mobile}</div>
                                                                            </div>
                                                                            {item.isDefault == 1?<p>[默认地址]</p>:""}
                                                                            <div className="new-address-add-show" >{item.province+item.city+item.area+item.address}</div>
                                                                        </Link>


                                                                }
                                                                <div className="new-address-opation">
                                                                    <div className="new-address-edit" onClick={this.reEditAddress.bind(this,index)}>
                                                                        <Icon type="edit" />
                                                                        <span>编辑</span>
                                                                    </div>
                                                                    <div className="new-address-del" onClick={this.delAddress.bind(this,index)}>
                                                                        <Icon type="close" />
                                                                        <span>删除</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        )
                                                    })
                                                    :
                                                    ""
                                            }
                                            <div className="new-address" onClick={this.showAddressInfo}>
                                                <Icon type="plus-circle-o" />
                                                新增地址
                                            </div>
                                        </div>
                                        :
                                        <div className="new-address" onClick={this.showAddressInfo}>
                                            <Icon type="plus-circle-o" />
                                            新增地址
                                        </div>
                        }
                    </div>

                    <Modal
                        title="编辑收货信息"
                        visible={this.state.isNew}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        key={this.state.modalKey}
                    >

                        <div className="new-address-address-edit-inner" ref="currentMark" >
                            <div className="new-address-add">
                                <label htmlFor="name">收货人姓名</label> <input type="text" id="name" ref="name" placeholder="请输入收货人姓名" className="new-address-add-infor"/>
                            </div>

                            <div className="new-address-add">
                                <label htmlFor="phone">收货人电话</label> <input type="text" id="phone" ref="phone" placeholder="请输入电话" className="new-address-add-infor"/>
                            </div>
                            <div className="area-select">

                                <label htmlFor="area"> 选收货地址</label>

                                <Cascader
                                    options={this.state.areaData}
                                    loadData={this.loadData}
                                    onChange={this.onChange}
                                    placeholder={this.state.isEdit?"":"请选择收货地址"}
                                    ref="cascader"
                                />
                            </div>
                            <div className="new-address-detail-address">
                                <label htmlFor="address">详细收货地址</label><textarea type="text" id="address" ref="detailAddress" placeholder="请输入详细地址"/>
                            </div>
                            <div className="new-address-default" onClick={this.setDefault.bind(this)}>
                                <div className={this.state.isDefault?"default-left default-left-active":"default-left"}></div>
                                <span>设为默认地址</span>
                            </div>

                        </div>
                    </Modal>

                </div>
                <ReactCSSTransitionGroup
                    transitionName="warning"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={600}
                >
                {
                    this.state.showWarning?
                        <div className="clear-div">
                            <div><Icon type="exclamation-circle-o" /></div>
                            {this.state.verifyContent}
                        </div>
                        :
                        ""
                }
                </ReactCSSTransitionGroup>

            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return state
};
const mapDispatchToProps = (dispatch)=>{
    return {
        addressId(data){
            dispatch({
                type:"ADDRESS_ID",
                data:data
            })
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(NewAddress);