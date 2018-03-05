/**
 * Created by web前端 on 2017/9/23.
 */
import React,{ Component } from 'react';
import './Timer.less';

class Timer extends Component{
    state={
      nowTime:new Date(),
      endTime:new Date(this.props.date),
      t:0,
      d:"00",
      h:"00",
      m:"00",
      s:"00",
      stop:false,
      day:this.props.day === undefined?true:this.props.day,
      hour:this.props.hour === undefined?true:this.props.hour,
      minutes:this.props.minutes === undefined?true:this.props.minutes,
      second:this.props.second === undefined?true:this.props.second,
      character:this.props.character
    };
    componentWillMount(){

    }
    countDown(){
        this.timer = setInterval(()=>{
            this.setState({
                nowTime:new Date(),
                t:this.state.endTime-this.state.nowTime,
            },()=>{
                this.setState({
                    d:Math.floor((this.state.t/1000)/3600/24)<10?`0${Math.floor((this.state.t/1000)/3600/24)}`:Math.floor((this.state.t/1000)/3600/24),
                    h:Math.floor(this.state.t/1000/3600%24)<10?`0${Math.floor(this.state.t/1000/3600%24)}`:Math.floor(this.state.t/1000/3600%24),
                    m:Math.floor(this.state.t/1000/60%60)<10?`0${Math.floor(this.state.t/1000/60%60)}`:Math.floor(this.state.t/1000/60%60),
                    s:Math.floor(this.state.t/1000%60)<10?`0${Math.floor(this.state.t/1000%60)}`:Math.floor(this.state.t/1000%60)
                });
            });
            if(this.state.d == 0 && this.state.h == 0 && this.state.m == 0 && this.state.s == 0){
                clearInterval(this.timer)
            }

        },1000);
    }
    componentDidMount(){
        //当未过期的时候，再去开启定时器,并设置初始值
        if(this.state.endTime - this.state.nowTime>0){
            this.setState({
                d:Math.floor(((new Date(this.props.date)-new Date())/1000)/3600/24)<10?`0${Math.floor(((new Date(this.props.date)-new Date())/1000)/3600/24)}`:Math.floor(((new Date(this.props.date)-new Date())/1000)/3600/24),
                h:Math.floor((new Date(this.props.date)-new Date())/1000/3600%24)<10?`0${Math.floor((new Date(this.props.date)-new Date())/1000/3600%24)}`:Math.floor((new Date(this.props.date)-new Date())/1000/3600%24),
                m:Math.floor((new Date(this.props.date)-new Date())/1000/60%60)<10?`0${Math.floor((new Date(this.props.date)-new Date())/1000/60%60)}`:Math.floor((new Date(this.props.date)-new Date())/1000/60%60),
                s:Math.floor((new Date(this.props.date)-new Date())/1000%60)<10?`0${Math.floor((new Date(this.props.date)-new Date())/1000%60)}`:Math.floor((new Date(this.props.date)-new Date())/1000%60),
            });
            //把定时器挂载到this上
            this.countDown()
        }
    }
    componentWillUnmount(){
        //卸载组件，清除定时器
        clearInterval(this.timer)
    }
    render(){
        return(
            <div style={this.props.timerStyle}>
                {
                    this.props.character?
                        <div className="timer" style={this.props.timerStyle}>
                            {this.state.day?` ${this.state.d}:` : ""}
                            {this.state.hour?`${this.state.h}:`:""}
                            {this.state.minutes?`${this.state.m}:`:""}
                            {this.state.second? `${this.state.s}`:""}
                        </div>
                        :
                        <div className="timer" style={this.props.timerStyle}>
                            {this.state.day?` ${this.state.d} 天 ` : ""}
                            {this.state.hour?`${this.state.h} 小时 `:""}
                            {this.state.minutes?`${this.state.m} 分 `:""}
                            {this.state.second? `${this.state.s} 秒 `:""}
                        </div>

                }
            </div>
        )
    }
}
export default Timer