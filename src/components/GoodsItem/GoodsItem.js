/**
 * Created by web前端 on 2017/8/9.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './GoodsItem.less';
import LazyLoad from 'react-lazy-load';
class GoodsItem extends Component{
    state={
        itemInfo:[],
        userInfo:null,
        groupId:this.props.groupId
    };
    componentWillMount(){

    }
    componentDidMount(){
        this.setState({
            itemInfo:this.props.itemInfo
        })
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.itemInfo!=this.props.itemInfo){
            this.setState({
                itemInfo:nextProps.itemInfo
            })
        }

    }
    showId=()=>{
    };
    render(){
        return(
            this.state.itemInfo.length === 0?
                null
                :
                <Link to={'/detail/' + this.state.itemInfo.id} className="good-wrapper clearfix" onClick={this.showId}>
                    <div className="good-inner">
                        <div className="good-pic">
                            <LazyLoad><img src={this.state.itemInfo.listImage} alt=""/></LazyLoad>
                        </div>
                        <div className="describe">
                            <h1 className="good-title">{this.state.itemInfo.goodsName}</h1>
                            <div className="price-wrapper">
                                <span className="price">售价：</span><span className="good-price">{this.state.itemInfo.price}</span>
                            </div>
                            <div className="good-item-earnings">
                                {
                                    this.state.groupId!=1?<div>收益：<span>{this.state.itemInfo.incomeRate.toFixed(2)}%</span></div>:""
                                }
                                {
                                    this.state.itemInfo.isGroupBuy === "1"?
                                        <div className="strategy-sub">
                                            <span className="strategy-group-tag">团</span>
                                            <span>{this.state.itemInfo.groupBuyNum}人团</span>
                                        </div>
                                        :
                                        ""
                                }
                                {
                                    this.state.itemInfo.marketingStrategyModels?
                                        this.state.itemInfo.marketingStrategyModels.map((item,index)=>{
                                            return (
                                                <div className="strategy-sub pinkage" key={index}>
                                                    <span className="strategy-sub-tag strategy-pinkage-tag">邮</span>
                                                    <span>{item.strategyName}</span>
                                                </div>

                                            )

                                        })
                                        :
                                        ""
                                }



                                {
                                    this.state.itemInfo.marketingStrategyList?
                                        this.state.itemInfo.isGroupBuy === '2'?
                                            <div className="strategy-sub">
                                                <span className="strategy-sub-tag">减</span>
                                                <div>
                                                    {
                                                        this.state.itemInfo.marketingStrategyList.map((item,index)=>{
                                                            return <div key={index}>{item.strategyName}</div>
                                                        })
                                                    }
                                                </div>

                                            </div>
                                            :
                                            ""
                                        :
                                        ""
                                }






{/*
                                            <div className="strategy-sub">
                                                <span className="strategy-sub-tag">减</span>
                                                {
                                                    this.state.itemInfo.marketingStrategyModels.map((item,index)=>{
                                                        return (
                                                            <span key={index}>{item.strategyName}</span>
                                                        )
                                                    })
                                                }

                                            </div>
*/}




                            </div>
                        </div>
                    </div>
                </Link>

        )
    }
}
export default GoodsItem
