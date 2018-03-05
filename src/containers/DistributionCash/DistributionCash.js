import React,{ Component } from 'react';
import './DistributionCash.less';
import { get } from "../../fetch/get";
import Loading from '../../components/Loading/Loading';
import {Link} from 'react-router-dom';
import { Icon, Modal, Button, Radio } from 'antd';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';

class DistributionCash extends  Component {
    state = {
        myShopData: null,
        openId:openId(document.cookie),
        visible: false,
        confirmLoading: false,
        drawType:1
    };

    componentDidMount() {
        get(`${API}/distribution/commission/${this.state.openId}`).then(function (res) {
            return res.json()
        }).then(data => {
            if(data.result){
                this.setState({
                    myShopData: data
                },()=>{
                    console.log(this.state.myShopData)
                })
            }

        })
    };
    withDrawCash=()=>{
        this.setState({
            visible: true
        });
    };
    handleOk=()=>{
        this.setState({
            confirmLoading: true,
        });

        let withdrawData = {
            openId:this.state.openId,
            drawType:this.state.drawType
        };
        console.log(withdrawData);
        fetch(`${API}/discomm/drawapply`,{
            method:'POST',
            body:JSON.stringify(withdrawData)
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            console.log(data);
            if(data.result){
                this.setState({
                    visible: false,
                    confirmLoading: false,
                },()=>{
                    Modal.success({
                        title: '提现结果',
                        content: '提现申请成功',
                        onOk:()=>{
                            window.location.reload();
                        }
                    });
                });
            }
        })
    };
    handleCancel=()=>{
        this.setState({
            visible: false
        })
    };
    onChange=(e)=>{
        this.setState({
            drawType: e.target.value,
        });
    };
    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (

                <div className="distributioncash">
{/*                    <div className="distributioncash-top">
                        <Link to="/membercenter/myshop" >
                            <Icon drawType="left"/>
                            <span>分销佣金</span>
                        </Link>
                    </div>*/}

                    {
                        this.state.myShopData===null?
                            <div className="distributioncash-loading">
                                <Loading/>
                            </div>
                            :
                            <div className="distributioncash-content">
                                <div className="my-shop-head">
                                    <Link to="/membercenter/myshop" className="crash-back">
                                        <Icon type="left"/>
                                    </Link>
                                    <Link to="/membercenter/cashdetail" className="crash-detail">
                                        <span>佣金明细</span>
                                    </Link>

                                    <div className="my-shop-info">
                                        <div>总收入</div>
                                        <div>{this.state.myShopData.objData.grossIncome.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="my-shop-body">
                                    <div className="my-shop-inner">
                                        <div className="my-shop-txt">
                                            <p>最新收益</p>
                                            <div>{this.state.myShopData.objData.commission}</div>
                                        </div>
                                        <div className="my-shop-txt" id="my-shop-txt">
                                            <p>可提现</p>
                                            <div>{this.state.myShopData.objData.withdrawNum?this.state.myShopData.objData.withdrawNum:"0.00"}</div>
                                        </div>
                                        <div className="my-shop-txt">
                                            <p>已申请</p>
                                            <div>{this.state.myShopData.objData.applyCash?this.state.myShopData.objData.applyCash:"0.00"}</div>
                                        </div>
                                        <div className="my-shop-txt">
                                            <p>已提现</p>
                                            <div>{this.state.myShopData.objData.withdrawCash?this.state.myShopData.objData.withdrawCash:"0.00"}</div>
                                        </div>
                                    </div>
                                    <div className="my-shop-foot">
                                        <div className="my-shop-foot-inner">
                                            <div>买家确认收货后，立即获得分销佣金。</div>
                                            <div>注意：可用佣金满 <span>{this.state.myShopData.objData.quota}</span> 元后才能申请提现</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={this.state.myShopData.objData.withdrawNum>=this.state.myShopData.objData.quota?" my-shop-foot-btn-active":"my-shop-foot-btn"} onClick={this.withDrawCash.bind(this)}>
                                    我要提现
                                </div>

                            </div>

                    }
                    <Modal title="选择提现方式"
                           visible={this.state.visible}
                           onOk={this.handleOk.bind(this)}
                           confirmLoading={this.state.confirmLoading}
                           onCancel={this.handleCancel.bind(this)}
                    >
                        <Radio.Group onChange={this.onChange} value={this.state.drawType}>
                            <Radio style={radioStyle} value={1}>提现到余额</Radio>
                            <Radio style={radioStyle} value={2}>提现到微信</Radio>
                        </Radio.Group>
                    </Modal>
                </div>


        )

    }
}
export default  DistributionCash