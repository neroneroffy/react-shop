/**
 * Created by web前端 on 2017/8/21.
 */
import React,{ Component } from 'react';
import './loading.less'
import { Icon } from 'antd';
class Loading extends Component{
    render(){
        return (
            <div className="loading">
                <Icon type="loading" />
                加载中…
            </div>
        )
    }
}
export default Loading