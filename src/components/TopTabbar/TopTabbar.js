/**
 * Created by web前端 on 2017/9/15.
 */
import React,{ Component } from 'react';
import { NavLink } from 'react-router-dom';
import './TopTabbar.less';
class TopTabbar extends Component{
    state={
        tabbarButtons:this.props.buttons
    };
    componentDidMount(){
        console.log(this.state.tabbarButtons)
    }

    render(){
        return (
            <div className="top-tabbar-wrapper">
                {
                    this.state.tabbarButtons.length === 0?"":
                    this.state.tabbarButtons.map((item,index)=>{
                        return (
                            <NavLink
                                to={item.linkTo+item.id}
                                key={index}
                                className="top-tabbar-button"
                                activeClassName="top-tabbar-active"
                                onClick={this.props.onClick}
                            >
                                {item.name}
                            </NavLink>
                        )
                    })
                }
            </div>
        )
    }
}
export default TopTabbar;