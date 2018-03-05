/**
 * Created by web前端 on 2017/9/4.
 */
import React,{ Component } from 'react';
import './ManageMyAddress.less';
import { get } from '../../fetch/get';
import { post } from '../../fetch/post';
import { Icon, Modal,Cascader } from 'antd';
import Loading from '../../components/Loading/Loading';
import {API} from '../../constants/API';

class ManageMyAddress extends Component{
    state={
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
        areaIds:[]
    };
    componentDidMount(){
        get('/mock/addressList.json').then((res)=>{
            return res.json()
        }).then(data =>{
            this.setState({
                addressList:data
            })
        });
        //请求级联第一级数据
        get(`${API}/area/province`).then( res=>{
            return res.json()
        }).then(data=>{

            console.log(data)

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
        console.log(selectedOptions);
        this.setState({
            inputValue: selectedOptions,
            areaIds:value
        });
    };
    //只有当选项中有isLeaf属性时候才会触发loadData函数
    loadData = (selectedOptions) => {
        console.log(selectedOptions);
        const targetOption = selectedOptions[selectedOptions.length - 1];//当前选择的对象 如{value: 3, label: "天津", isLeaf: false}
        targetOption.loading = true;
        //发送当前选择的id给后台
        get(`${API}/area/sub/${targetOption.value}`).then(res=>{
            return res.json()
        }).then( data =>{
            console.log(data)
            targetOption.loading = false;
            //请求回来之后，设置children
            let childrenData = [];
            console.log(data[0].value);
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
            //console.log(targetOption.children);
            this.setState({
                areaData: [...this.state.areaData]
            });
        });
    };
    reEditAddress=(index)=>{

        this.setState({
            isNew:true,
            isEdit:true,
            reEditData:this.state.addressList[index],
            whichChanged:index
        },()=>{
            //选择修改某一个人信息的时候，赋值
            this.refs.name.value=this.state.reEditData.consignee;
            this.refs.phone.value=this.state.reEditData.telephone;
            this.refs.detailAddress.value=this.state.reEditData.address;
            let areaSapn = document.getElementsByClassName("ant-cascader-picker-label")[0];
            //选择修改某一个人的信息的时候，给三级联动选框赋值
            areaSapn.innerHTML = `${this.state.reEditData.area.label}/${this.state.reEditData.area.children[0].label}/${this.state.reEditData.area.children[0].children[0].label}`;
        });

    };

    showAddressInfo=()=>{
        this.setState({
            isNew:true,
            modalKey:this.state.modalKey+1,
            isDefault:false
        })
    };
    setDefault=()=>{
        this.setState({
            isDefault:!this.state.isDefault
        })
    };

    handleOk=()=>{

        //判断是编辑的还是新增的
        if(this.state.isEdit){
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
                    isDefault:this.state.isDefault?1:0
                }
            },()=>{
                post('api',this.state.newAddressData).then((res)=>{
                    return res.json();
                }).then(data=>{
                    this.setState({
                        addressList:data
                    })
                })
            })
        }else{
            this.setState({
                newAddressData:{
                    openId:this.state.openId,
                    memberName:this.refs.name.value,
                    phone:this.refs.phone.value,
                    address:this.refs.detailAddress.value,
                    provienceId:this.state.areaIds[0],
                    cityId:this.state.areaIds[1],
                    areaId:this.state.areaIds[2],
                    provience:this.state.inputValue[0],
                    city:this.state.inputValue[1],
                    area:this.state.inputValue[2],
                    default:this.state.isDefault?1:0
                }
            },()=>{
                console.log(this.state.newAddressData)
                post('/api',this.state.newAddressData).then((res)=>{
                    return res.json();
                }).then(data=>{
                    this.setState({
                        addressList:data
                    })
                })
            });
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
        window.history.back()
    }
    render(){
        return (
            <div className="manage-my-address">
                <div className="manage-address-top">
                    <div className="manage-address-inner">
                        <div className="go-back-to-select-address" onClick={this.goBack.bind(this)}>
                            <Icon type="left"/>
                            返回
                        </div>

                    </div>
                </div>
                <div className="manage-address-list">

                    {
                        this.state.addressList.length === 0?<div className="manage-address-loading"><Loading/></div>:
                            this.state.addressList.map((item,index)=>{
                                return (
                                    <div className="manage-address-item" key={index} onClick={this.reEditAddress.bind(this,index)}>
                                        <div className="manage-address-list-inner">

                                            <div>
                                                <div className="manege-add-name" >{item.consignee}</div>
                                                <div className="manage-add-tele" >{item.telephone}</div>
                                            </div>
                                            {item.isCurrent === 1?<p>[默认地址]</p>:""}
                                             <div className="manage-add" >{item.area.label+item.area.children[0].label+item.area.children[0].children[0].label+item.address}</div>
                                        </div>
                                    </div>
                                )
                            })
                    }
                    <div className="new-address" onClick={this.showAddressInfo}>
                        <Icon type="plus-circle-o" />
                        新增地址
                    </div>
                </div>

                <Modal
                    title="编辑收货信息"
                    visible={this.state.isNew}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    key={this.state.modalKey}
                >

                    <div className="manage-address-edit-inner" ref="currentMark" >
                        <div className="manage-add">
                            <label htmlFor="name">收货人姓名</label> <input type="text" id="name" ref="name" placeholder="请输入收货人姓名"/>
                        </div>

                        <div className="manage-add">
                            <label htmlFor="phone">收货人电话</label> <input type="text" id="phone" ref="phone" placeholder="请输入电话"/>
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
                        <div className="manage-detail-address">
                            <label htmlFor="address">详细收货地址</label><textarea type="text" id="address" ref="detailAddress" placeholder="请输入详细地址"/>
                        </div>
                        <div className="new-address-default" onClick={this.setDefault.bind(this)}>
                            <div className={this.state.isDefault?"default-left default-left-active":"default-left"}></div>
                            <span>设为默认地址</span>
                        </div>

                    </div>
                </Modal>


            </div>
        )
    }
}

export default ManageMyAddress;