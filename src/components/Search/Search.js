/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import './search.less';
class Search extends Component{

    render(){
        return(
            <Link to="/search" className="search-wrapper">
                <div className="outside-wrapper">
                    <div className="search">
                        <span>请输入关键字</span>
                    </div>
                    <Icon type="search" className="search-icon"/>
                </div>
            </Link>
        )
    }
}
export default Search
