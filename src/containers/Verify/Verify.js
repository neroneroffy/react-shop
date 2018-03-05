/**
 * Created by web前端 on 2017/7/18.
 */
import React, { Component } from 'react';
import './Verify.less'
import { Button } from 'antd';
import { Link } from 'react-router-dom';

class Verify extends Component {

    skip=()=>{
        window.location.pathname = "/index"
    }

    render(){
        return (
            <div className="Verify">
                <Button onClick={this.skip.bind(this)}>验证</Button>
            </div>
        )
    }
}
export default Verify;