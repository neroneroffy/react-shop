/**
 * Created by web前端 on 2017/9/3.
 */
import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import './GoodPayItem.less';
class GoodPayItem extends Component{
    state={
      goodData:this.props.data,
      isLink:this.props.isLink
    };
    componentDidMount(){
            this.setState({
                goodData:this.props.data
            })
    }

    render(){
        return (
                !this.state.isLink?
                    <div  className="good-pay-item">
                        <Link to={'/detail/'+this.state.goodData.goodsId} className="good-pay-pic">
                            <img src={this.state.goodData.listImage} alt="加载失败咯~"/>
                        </Link>
                        <div className="info">
                            <Link to={'/detail/'+this.state.goodData.goodsId} >
                                <div className="name">{this.state.goodData.goodsName}</div>
                                <div className="speci">{this.state.goodData.specItemName}</div>
                            </Link>
                            <div className="price-count">
                                <div className="price"><span>¥</span>{this.state.goodData.price}</div>
                                {
                                    this.props.isEvaluate === undefined?<div className="count"><Icon type="close" /> {this.state.goodData.total}</div>:<Link to="/membercenter/evaluate" className="evaluate-now" onClick={this.props.onClick}>立即评价</Link>
                                }

                            </div>
                        </div>
                    </div>
                        :
                    <div className="good-pay-item">
                        <div className="good-pic">
                            <img src={this.state.goodData.listImage} alt="加载失败咯~"/>
                        </div>
                        <div className="info">
                            <div className="name">{this.state.goodData.goodsName}</div>
                            <div className="speci">{this.state.goodData.specItemName}</div>
                            <div className="price-count">
                                <div className="price"><span>¥</span>{this.state.goodData.price}</div>
                                {
                                    this.props.isEvaluate === undefined?<div className="count"><Icon type="close" /> {this.state.goodData.total}</div>:<Link to="/membercenter/evaluate" className="evaluate-now" onClick={this.props.onClick}>立即评价</Link>
                                }
                            </div>
                        </div>
                    </div>
        )
    }
}
export default GoodPayItem;