/**
 * Created by web前端 on 2017/7/18.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
class Index extends Component {

    render(){
        return (
            <div>
                <Link to="/index">验证</Link>
            </div>
        )
    }
}
export default Index;