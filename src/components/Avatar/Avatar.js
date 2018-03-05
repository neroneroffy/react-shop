/**
 * Created by web前端 on 2017/8/9.
 */
import React, { Component } from 'react';
import './Avatar.less';
class Avatar extends Component{
    constructor(props){
        super(props);
        this.state={
            userInfo:this.props.userInfo
        }
    }
    render(){
        return(
            <div className="avatar">
                <div className="avatar-pic">
                    <img src={this.state.userInfo.photo}/>
                </div>
                <div className="user-brief-info">
                    <h1 className="nick-name">
                        {this.state.userInfo.nickName}
                        <span className="property"></span>
                    </h1>

                </div>
            </div>
        )
    }
}
export default Avatar
