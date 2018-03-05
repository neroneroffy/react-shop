/**
 * Created by web前端 on 2017/9/4.
 */
import React,{ Component } from 'react';
import {Icon} from 'antd';
import { Link } from 'react-router-dom';
import { get } from '../../fetch/get';
import Loading from '../../components/Loading/Loading'
import { connect } from 'react-redux';
import './SelectMyAddress.less';
class SelectMyAddress extends Component{
    state={
      addressList:[],
      allAddress:""
    };
    componentWillMount(){
        get('/mock/addressList.json')
            .then(res=>{
                return res.json();
            }).then(data=>{
                this.setState({
                    addressList:data
                })
        })
    };
    selectAddress=(index)=>{
        //清空session，重新向后台请求数据
        //sessionStorage.clear();

        for(let i = 0;i<this.state.addressList.length;i++){
            this.state.addressList[i].isCurrent = 0;
            this.setState({})

        }
        //sessionStorage.intialData.payGoodInfo.addressInfo = this.state.addressList[index];
        let initialData = JSON.parse(sessionStorage.getItem('initialData'));
        initialData.payGoodInfo.addressInfo =  this.state.addressList[index];
        sessionStorage.setItem('initialData',JSON.stringify(initialData));
        this.state.addressList[index].isCurrent = 1;
        this.setState({});
        //
        this.props.thisAddress(this.state.addressList[index],this.props.storeOrderData,this.props.myStoredGoodInfo)

    };
    //如果返回，那么传过去默认地址
    goBackToOrder=()=>{
        let currentAdress = "";
        this.state.addressList.map((item,index)=>{
            if(item.isCurrent === 1){
                currentAdress = item
            }
        });
        //sessionStorage.clear();
        this.props.thisAddress(this.props.newAddress,this.props.storeOrderData,this.props.myStoredGoodInfo)
        window.history.go(-1)
    };

    render(){
        return (
            <div className="select-my-address">
                <div className="select-address-top">
                    <div className="select-address-inner">
                        <div className="select-back" onClick={this.goBackToOrder}>
                            <Icon type="left"/>
                            选择收货地址
                        </div>
                        <Link to="/membercenter/managemyaddress" className="to-manage">
                            管理
                        </Link>
                    </div>
                </div>
                {
                    this.state.addressList.length===0?<div className="select-address-loading"><Loading/></div>:
                        <div className="address-list">
                        {
                            this.state.addressList.map((item,index)=>{
                                return (
                                    <Link to="/submitorder" className="address-item" key={index} onClick={this.selectAddress.bind(this,index)}>

                                        <div className="name-telephone">
                                            <div>{item.consignee}</div>
                                            <div>{item.telephone}</div>
                                        </div>
                                        {
                                            item.isCurrent? <p>[默认地址]</p>:""
                                        }
                                        <div className="detail-address">{item.area.label+" "+item.area.children[0].label+" "+item.area.children[0].children[0].label+" "+item.address}</div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps=(state)=>{

    return {
        newAddress:state.storeOrderData.oldAddress,
        storeOrderData:state.storeOrderData,
        myStoredGoodInfo:state.storeOrderData.orderData === undefined? []:state.storeOrderData.orderData.myGoodInfo
    }

};
const mapDispatchToProps=(dispatch)=>{
    return {
        thisAddress(data1,data2,data3){
            dispatch({
                type:"THIS_ADDRESS",
                data:{address:data1,storedMyData:data2,returnedGoodInfo:data3}
            })
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(SelectMyAddress);