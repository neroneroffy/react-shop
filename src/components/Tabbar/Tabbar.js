/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import './tabbar.less';


class Tabbar extends Component{
    componentWillMount(){

    }
    state={
        highlight:'/',
        tabbatBtns:[
            {
                name:'推荐',
                icon:'like-o',
                linkTo:'/index',
                iconType:'appstore-o'
            },

            {
                name:'购物车',
                icon:'shopping-cart',
                linkTo:'/shopcart',
                iconType:'shopping-cart'
            },
            {
                name:'会员中心',
                icon:'user',
                linkTo:'/membercenter',
                iconType:'bank'
            },
        ]
    };
    selectedBtn=(name)=>{
    };

    render(){
        return(
            <div className="tabbar" ref="mainBtn">
                {this.state.tabbatBtns.map((item)=>{
                    return (
                            <NavLink
                                to={item.linkTo}
                                key={item.linkTo}
                                activeClassName='active-btn'
                                onClick={this.selectedBtn.bind(this,item.name)}
                            >
                                <p className="tabbar-icon"><Icon type={item.icon}/></p>
                                <p className="tabbar-name">{item.name}</p>
                            </NavLink>

                    )
                })}
            </div>
        )
    }
}

export default Tabbar
