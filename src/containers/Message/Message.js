import React, {Component} from 'react';
import './Message.less';
import {Link} from 'react-router-dom';
import { Icon,Switch } from 'antd';
import Tabbar from '../../components/Tabbar/Tabbar';
import API from '../../constants/API'

class Message extends Component{
    state={
        millMessage:[
            {
                remind:"订单提交通知",
                id:0
            },
            {
                remind:"自提订单通知",
                id:1
            },
            {
                remind:"订单取消通知",
                id:2
            },
            {
                remind:"购买成功通知",
                id:3
            },
            {
                remind:"订单发货通知",
                id:4
            }
        ],
        distributionMessage:[
            {
                remind:"成为农场主通知",
                id:5
            },
            {
                remind:"等级提升通知",
                id:6
            },
            {
                remind:"新增下线通知",
                id:7
            }
        ],

        isOpens:true
    };

    onChange=(index,checked)=>{
        let messageData = {};
        messageData[this.state.millMessage[index].id] = checked;
        console.log(messageData);
    };

    onChange1=(index,checked)=>{
        let messageData = {};
        messageData[this.state.millMessage[index].id] = checked;
        console.log(messageData);
    };

    render(){
        return(
            <div className="message">
                <div className="message-head">
                    <div className="message-head-inner">
                        <Link to="/membercenter" >
                            <Icon type="left" />
                        </Link>
                        <div className="message-head-content">消息提醒设置</div>
                    </div>
                </div>

                <div className="message-body">

                    <div className="message-body-remind">
                        <div className="message-body-remind-long">
                            <div className="message-body-remind-inner">
                                <p>商城信息 提醒</p>
                            </div>
                        </div>
                        <div className="message-body-remind-detail">
                            {
                                this.state.millMessage.map((item,index)=>{
                                    return (
                                        <div className="detail-remind" key={index}>
                                            <span className="detail-remind-font">{item.remind}</span>
                                            <Switch className="detail-remind-icon" defaultChecked={this.state.isOpens} onChange={this.onChange.bind(this,index)}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="message-body-remind">
                        <div className="message-body-remind-long">
                            <div className="message-body-remind-inner">
                                <p>分销信息 提醒</p>
                            </div>
                        </div>
                        <div className="message-body-remind-detail">
                            {
                                this.state.distributionMessage.map((item,index)=>{
                                    return (
                                        <div className="detail-remind" key={index }>
                                            <span className="detail-remind-font">{item.remind}</span>
                                            <Switch className="detail-remind-icon" defaultChecked={this.state.isOpens} onChange={this.onChange1.bind(this,index)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <Tabbar/>

            </div>
        )
    }
}

export default Message;
