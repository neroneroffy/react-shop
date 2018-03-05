/**
 * Created by web前端 on 2017/8/29.
 */
import React,{Component} from 'react';
import { Icon} from 'antd'
import './Counter.less';
class Counter extends Component{
    state={
        itemCount:1
    };
    subCount=()=>{
        if(this.state.itemCount > 1){
            this.setState({
                itemCount:this.state.itemCount-1
            })
        }
    };
    addCount=()=>{
        this.setState({
            itemCount:this.state.itemCount+1
        })
    };
    render(){
        return(
            <div className="counter">
                <div className="sub" onClick={this.subCount}>
                    <Icon type="minus"/>
                </div>
                <div className="good-number">{this.state.itemCount}</div>
                <div className="add" onClick={this.addCount}>
                    <Icon type="plus"/>
                </div>

            </div>

            )
    }
}
export default Counter