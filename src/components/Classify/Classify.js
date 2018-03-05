/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Classify.less';
import { get } from '../../fetch/get';
import Loading from '../Loading/Loading';
import {API} from '../../constants/API'

class Classify extends Component{

    componentWillMount(){
        get(`${API}/bar/list`)
            .then((res)=>{
                return res.json()
            })
            .then((data)=>{
                this.setState({
                    classifyBtns:data.data
                })
            })

    }
    state={
        classifyHighlight:'/',
        classifyBtns:[
        ]
    };

    selectedBtn=()=>{

    };
    render(){
        return(
            <div className="classify-tabbar-wrapper">
                <div className="classifyTabbar" ref="nav">
                    {this.state.classifyBtns.length === 1?<Loading/>:this.state.classifyBtns.map((item,index)=>{
                        return (
                            <NavLink
                                to={'/index/'+item.id}
                                key={index}
                                onClick={this.selectedBtn}
                                activeClassName='classify-activity-btn'
                            >{item.name}</NavLink>
                        )
                    })}
                </div>


            </div>
        )
    }
}
export default Classify
