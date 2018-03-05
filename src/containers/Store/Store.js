/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import { get} from "../../fetch/get";
import './Store.less';
class Store extends Component{
    componentWillMount(){
        const result = get('1.txt');
        result.then((res)=>{
            return res.json()
        }).then((txt)=>{
            console.log(txt)
        });
    }
    state={
        page:'Store',
        userBriefInfo:{
            nickName:'小黑犬',
            property:'农场主',
            joinTime:'2017-04-15'
        }
    };
    render(){
        return(
            <div className="store">
                <div className="avatar-wrapper">
                    <div className="store-avatar">
                        <img src={require('./avatar.jpg')} alt=""/>
                    </div>
                    <div className="store-nick-name">
                        <span className="nick-name-content">{this.state.userBriefInfo.nickName}</span>
                        <div className="store-property">{this.state.userBriefInfo.property}</div>
                    </div>
                    <div className="store-join-time">加入时间：{this.state.userBriefInfo.joinTime}</div>
                </div>
            </div>
        )
    }
}
export default Store
