/**
 * Created by web前端 on 2017/9/30.
 */
import React,{ Component } from 'react';
import { Icon,Modal } from 'antd';
import { Link } from 'react-router-dom';
import { get } from '../../fetch/get';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
import './Recharge.less';
class Recharge extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentMoney:0,
            rechargeMoney:0,
            openId:openId(document.cookie),
            timestamp:"",
            nonceStr:"",
            package:"",
            signType:"",
            paySign:""
        }
    }
    componentDidMount(){
        get(`${API}/toRecharge?openId=${this.state.openId}`)
            .then(res=>{
                return res.json()
            }).then( data=>{
                console.log(data)

        })
    }
    recordRechargeMoney=(e)=>{
        let reg = /^[1-9]*(?:\.\d{0,2})?$/
        if(!reg.test(e.target.value)){
            this.contentError(this.refs.money);
        }else{
            this.setState({
                rechargeMoney:e.target.value
            })
        }
    };
    contentError=(money)=>{
        Modal.warning({
            title: '请输入正确的充值金额',
            onCancel(){
                money.value = ""
            },
            onOk(){
                money.value = ""
            }
        });
    };
    recharge=()=>{
        console.log(this.state.rechargeMoney);
    };
    goBack=()=>{
        window.history.go(-1)
    };
    render(){
        return (
            <div className="user-recharge">
                <div className="user-recharge-top">
                    <div onClick={this.goBack.bind(this)}>
                        <Icon type="left"/>
                        <span>账户充值</span>
                    </div>
                    <Link to="/membercenter/myrecharge">
                        <span>充值记录</span>
                    </Link>
                </div>
                <div className="user-recharge-content">
                    <div className="money current-money">
                        <span>当前余额</span>
                        <span>{this.state.currentMoney}</span>
                    </div>
                    <div className="money recharge-money">
                        <span>充值金额</span>
                        <input placeholder="请输入充值金额" onChange={this.recordRechargeMoney.bind(this)} ref="money"/>
                    </div>
                </div>
                <div className="user-recharge-button" onClick={this.recharge.bind(this)}>确认充值</div>
            </div>
        )
    }
}
export default Recharge