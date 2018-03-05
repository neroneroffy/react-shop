/**
 * Created by web前端 on 2017/9/2.
 */
import React,{ Component } from 'react';
import { Modal, Cascader } from 'antd';
import { get} from '../../fetch/get';
import { connect } from 'react-redux';
import './ReceivingInfo.less';

let addressData="";

class ReceivingInfo extends Component{
    state={
        addressEdit:false,
        modalKey:0,
        inputValue:this.props.defaultAddressData,
        areaData:[]
    };
    onChange = (value, selectedOptions) => {

        this.setState({
            inputValue: selectedOptions.map(o => o.value),
        });
    };
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [{
                label: `${targetOption.label} Dynamic 1`,
                value: 'dynamic1',
            }, {
                label: `${targetOption.label} Dynamic 2`,
                value: 'dynamic2',
            }];
            this.setState({
                options: [...this.state.options],
            });
        }, 1000);
    };
    componentDidMount(){
        get('/mock/areaSelect.json').then( res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                areaData:data
            })
        });


    }
    componentWillReceiveProps(nextProps){
        if(this.props.inputValue!=nextProps.inputValue){
            this.setState({
                inputValue:nextProps.inputValue
            });

        }
    }
    showEdit = ()=>{
        this.setState({
            addressEdit:true,
            modalKey:this.state.modalKey+1
        })
    };
    handleOk=()=>{
        //点击确定后把内容赋值给addressData
        addressData={
            name:this.refs.name.value,
            phone:this.refs.phone.value,
            provience:this.refs.cascader.state.value[0],
            city:this.refs.cascader.state.value[1],
            county:this.refs.cascader.state.value[2],
            address:this.refs.detailAddress.value,
            isCurrent:this.refs.currentMark.id

        };
        console.log(addressData);
        this.props.addAddressComplete();
        this.setState({
            modalKey:this.state.modalKey+1
        })


    };
    handleCancel=()=>{
        this.setState({
            modalKey:this.state.modalKey+1
        })
        this.props.addAddressComplete();
    };
    provinceSelect=(event)=>{
        console.log(event.target.scrollTop);
        console.log(event)
    };
    render(){
        return (

            <Modal
                title="编辑收货信息"
                visible={this.props.isShow?this.props.isShow:this.props.reEditShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                key={this.state.modalKey}
            >

                <div className="manage-address-edit-inner" id={this.props.isCurrent} ref="currentMark">
                    <div className="manage-add">
                        <label htmlFor="name">收货人姓名</label> <input type="text" id="name" ref="name" placeholder="请输入收货人姓名" defaultValue={this.props.defaultName}/>
                    </div>
                    <div className="manage-add">
                        <label htmlFor="phone">收货人电话</label> <input type="text" id="phone" ref="phone" placeholder="请输入电话" defaultValue={this.props.defaultPhone}/>
                    </div>
                    <div className="area-select">
                        <label htmlFor="area"> 选收货地址</label>

                        <Cascader
                            options={this.state.areaData.length===0?"":this.state.areaData}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            defaultValue={this.props.defaultAddressData}
                            changeOnSelect
                            placeholder="请选择收货地址"
                            ref="cascader"
                        />
                    </div>
                    <div className="manage-detail-address">
                        <label htmlFor="address">详细收货地址</label><textarea type="text" id="address" ref="detailAddress" placeholder="请输入详细地址" defaultValue={this.props.defaultAddress}/>
                    </div>

                </div>
            </Modal>
        )
    }
}
const mapStateToProps =(state)=>{

    return {
        isShow:state.addressEdit.isShow,
        defaultAddressData:state.reEditAddressData.data.area,
        defaultName:state.reEditAddressData.data.name,
        defaultPhone:state.reEditAddressData.data.phone,
        defaultAddress:state.reEditAddressData.data.address,
        isCurrent:state.reEditAddressData.data.isCurrent,
        reEditShow:state.reEditAddressData.isShow
    };
    console.log()
};
const mapDispatchToProps = (dispatch)=>{
  return {
      addAddressComplete(){
          dispatch({
              type: "HIDE_ADDRESS_EDIT",
              data: addressData
          });

      }
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(ReceivingInfo)