/**
 * Created by web前端 on 2017/8/29.
 */
import React,{ Component } from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ShopCartItem.less'
let cartItemInfo=[];
class ShopCartItem extends Component{
    state={
        itemInfo:this.props.cartItemInfo,
        itemCount:1,
        isSelectAll:this.props.all
    };
    subCount=()=>{
        if(this.state.itemInfo.count>1){
            this.setState({
                itemInfo:{
                    goodPic:this.state.itemInfo.goodPic,
                    goodTitle:this.state.itemInfo.goodTitle,
                    goodPrice:this.state.itemInfo.goodPrice,
                    id:this.state.id,
                    specification:this.state.itemInfo.specification,
                    count:this.state.itemInfo.count-1
                }
            })

        }
    };
    addCount=()=>{
        this.setState({
            itemInfo:{
                goodPic:this.state.itemInfo.goodPic,
                goodTitle:this.state.itemInfo.goodTitle,
                goodPrice:this.state.itemInfo.goodPrice,
                id:this.state.id,
                specification:this.state.itemInfo.specification,
                count:this.state.itemInfo.count+1
            }
        })
    };
    componentWillReceiveProps(nextProps){
        this.setState({
            isSelectAll:nextProps.all,

        },()=>{
            this.refs.shopCartItemSelect.checked = this.state.isSelectAll
        });
    }
    render(){
        cartItemInfo = this.state.itemInfo;
        return (

            <div className="shop-cart-item">
                <div className="every-item" >
                    <input className="checkbox-green item-select" type="checkbox" ref="shopCartItemSelect" onClick={this.props.selectSingle}/>
                    <div className="good-item-pic">
                        <img src={this.state.itemInfo.specification[0].specificationItems[0].speciPic} alt=""/>
                    </div>
                    <Link to={'/detail/' + this.state.itemInfo.id} className="goods-item-in-cart-info">
                        <p className="goods-item-in-cart-name">{this.state.itemInfo.goodTitle}</p>
                        {this.state.itemInfo.specification===undefined? "":
                            this.state.itemInfo.specification.map((item,index)=>{
                                return (
                                    <p className="cart-specification" key={index}>{item.name}:{item.specificationItems[0].speciName}</p>
                                )
                            })}
                        <p className="good-price">{this.state.itemInfo.goodPrice}元</p>
                    </Link>
                    <div className="cart-goods-count">
                        <div className="sub" onClick={this.subCount}>
                            <Icon type="minus"/>
                        </div>
                        <div className="good-number" >{this.state.itemInfo.count}</div>
                        <div className="add" onClick={this.addCount}>
                            <Icon type="plus"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        count:state.count
    }
};
const mapDispatchToProps=(dispatch)=>{
    return {
/*
        addCount:()=>{
            dispatch({
                type:"MY_CART_ADD_COUNT"
            })
        },
        subCount:()=>{
            dispatch({
                type:"MY_CART_SUB_COUNT"
            })
        }
*/
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ShopCartItem);

