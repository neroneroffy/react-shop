/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import { get } from '../../fetch/get';
import { post } from '../../fetch/post';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import './SourceShopCart.less';
import { API } from '../../constants/API';
import { openId } from '../../util/openId'
import Loading from '../../components/Loading/Loading';

let goodsInfo = [];
class SourceShopCart extends Component{
    state={
        count:1,
        goodsItemInfo:[],
        allRepertoryGood:[],
        totalMoney:0,
        payInfo:[],
        checked:[],
        mySelect:false,
        openId:openId(document.cookie),
        result:null,
        msg:""
    };
    componentWillMount(){
        //let openId = document.cookie.user_name;
        //需替换openId

        get(`${API}/cart/list/${this.state.openId}`)
            .then((res)=>{return res.json();})
            .then((data)=>{
            console.log(data);
            //字符数超出一定数量显示省略号
/*                data.goodsItemInfo.map((item)=>{
                    item.goodTitle = item.goodTitle.length >50? item.goodTitle.substr(0,60)+'...': item.goodTitle;
                });*/
                this.setState({
                    goodsItemInfo:data.data,
                    result:data.result,
                    msg:data.msg
                },()=>{
                    if(this.state.result){
                        this.state.goodsItemInfo.map((item,index)=>{
                            this.state.allRepertoryGood.push(index);
                            this.setState(this.state)
                        })

                    }
                });
                goodsInfo = data.goodsItemInfo
            })
    }
    selectSingle=()=>{
        this.calculate();
    };
    subCount=(index)=>{
        if(this.state.goodsItemInfo[index].total>1){
            this.state.goodsItemInfo[index].total = this.state.goodsItemInfo[index].total-1;
            this.setState(this.state);
        }
        this.calculate()
    };
    addCount=(index)=>{
        this.state.goodsItemInfo[index].total = this.state.goodsItemInfo[index].total+1;
        this.setState({});
        this.calculate()
    };
    mySelect=()=>{

        this.setState({
            mySelect:!this.state.mySelect
        },()=>{

            if(this.state.mySelect) {
                for (let i = 0; i < this.refs.cartItem.children.length; i++) {
                    if (this.state.goodsItemInfo[i].specStock!==0) {
                        this.refs.cartItem.children[i].children[0].children[0].checked = true;
                    }
                }
            }else{
                for (let i = 0; i < this.refs.cartItem.children.length; i++) {
                    this.refs.cartItem.children[i].children[0].children[0].checked = false;
                }
            }
            //计算价格
            let item = this.refs.cartItem.children;
            let calRes = 0;
            let payInfoTemp = [];
            for(var i =0;i<item.length;i++){

                if(item[i].children[0].children[0].checked){
                    calRes += parseFloat(this.state.goodsItemInfo[i].price).toFixed(2)*this.state.goodsItemInfo[i].total;
                    payInfoTemp.push(this.state.goodsItemInfo[i])
                }
            }
            this.setState({
                totalMoney:calRes,
                payInfo:payInfoTemp
            });

        });
    };
    //计算价格函数
    calculate = ()=>{
        let item = this.refs.cartItem.children;
        let calRes = 0;
        let payInfoTemp = [];
        for(var i =0;i<item.length;i++){

            if(item[i].children[0].children[0].checked){
                calRes += parseFloat(this.state.goodsItemInfo[i].price).toFixed(2)*this.state.goodsItemInfo[i].total;
                payInfoTemp.push(this.state.goodsItemInfo[i])
            }
        }
        this.setState({
            totalMoney:calRes,
            payInfo:payInfoTemp
        },()=>{
            //子input全选中，全选按钮选中
            console.log("payInfo--------->"+this.state.payInfo.length);
            console.log("allRepertoryGood--------->"+this.state.allRepertoryGood.length);

            if(this.state.payInfo.length === this.state.allRepertoryGood.length && this.state.allRepertoryGood.length>0){
                this.setState({
                    mySelect : true
                });
            }else{
                this.setState({
                    mySelect : false
                });
            }
        })
    };
    myCartDel = ()=>{
        if(this.state.totalMoney!==0){
            let ids = [];
            this.state.payInfo.map((item,index)=>{
                ids.push(item.id)
            });
            ids = ids.toString();
            post(`${API}/cart/del/${ids}`).then( res=>{
                return res.json()
            }).then( data=>{
                console.log(data);
                if(data.result){
                    this.setState({
                        goodsItemInfo:data.data,
                        result:data.result,
                        msg:data.msg,
                        payInfo:[],
                        allRepertoryGood:[]
                    },()=>{
                        //先将所有checkbox状态置为未选中，再调用计算价格函数
                        let checkBox = document.getElementsByClassName('checkboxs');
                        for(let i=0;i<checkBox.length;i++){
                            checkBox[i].checked = false
                        }
                            //重新设置库存不为0的数组，便于所有选框选中后全选状态的改变
                            this.state.goodsItemInfo.map((item,index)=>{
                                if(item.specStock!=0){
                                    this.state.allRepertoryGood.push(index);
                                    this.setState(this.state)
                                }
                            });

                        this.calculate();
                    })
                }else{
                    this.setState({
                        payInfo:[],
                        goodsItemInfo:[],
                        allRepertoryGood:[],
                        msg:data.msg,
                        mySelect : false,
                        totalMoney:0,
                        result:data.result
                    })
                }
            });
        }
    };
    delNoRepertoryItem=(index)=>{
        //删除，发送被删除的项id，返回数据重新赋值渲染
        post(`${API}/cart/del/${this.state.goodsItemInfo[index].id}`).then( res=>{
            return res.json()
        }).then( data=>{
            if(data.result){
                this.setState({
                    goodsItemInfo:data.data,
                    result:data.result,
                    msg:data.msg
                })
            }else{
                this.setState({
                    goodsItemInfo:[],
                    result:data.result,
                    msg:data.msg
                })
            }
        });
    };
    pay=()=>{
        this.calculate();
        sessionStorage.setItem('goodInfo',JSON.stringify(this.state.payInfo));
        let cartPayInfo = [];
        this.state.payInfo.map((item,index)=>{
            cartPayInfo.push(item.goodsId)
        });
    };

    render(){
        return(
            <div className="shop-cart">
                <div className="shop-cart-wrapper">
                    <div className="shop-cart-title clearfix">
                        <Link to="/membercenter/agency" className="go-back">
                            <Icon type="left"/>
                        </Link>

                        <span className="cart-name">购物车({this.state.goodsItemInfo?this.state.goodsItemInfo.length:0})</span>
                        <button className={this.state.payInfo.length===0?"remove-goods-in-cart":"remove-goods-in-cart-active"} onClick={this.myCartDel}>删除</button>
                    </div>
                </div>
                <div className="item-list-wrapper">
                    <div className="item-list" ref="cartItem">

                        {
                            this.state.result === null?
                                <div className="shop-cart-loading">
                                    <Loading/>
                                </div>
                                :
                                this.state.result?
                                    this.state.goodsItemInfo.map((item,index)=>{
                                        return (
                                            <div className="shop-cart-item" key={index}>
                                                <div className="every-item" >
                                                    <input className="checkbox-green checkboxs item-select" type="checkbox" ref="shopCartItemSelect"  onClick={this.selectSingle.bind(this,index)}/>
                                                    <div className="good-item-pic">
                                                        <img src={item.listImage} alt=""/>
                                                    </div>
                                                    <div className="goods-item-in-cart-info">
                                                        <p className="goods-item-in-cart-name ">{item.goodsName}</p>
                                                        <p className="cart-specification">{item.specItemName}</p>
                                                        {item.specStock === 0?<p className="no-repertory">库存为0</p>:""}
                                                        <p className="goods-item-good-price">{item.price.toFixed(2)}元</p>
                                                    </div>
                                                    <div className="cart-goods-count">
                                                        <div className="sub" onClick={this.subCount.bind(this,index)}>
                                                            <Icon type="minus"/>
                                                        </div>
                                                        <div className="good-number" >{item.total}</div>
                                                        <div className="add" onClick={this.addCount.bind(this,index)}>
                                                            <Icon type="plus"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                :
                                    <div className="cart-no-data"><Icon type="frown-o" />{ this.state.msg}</div>
                        }
                    </div>
                </div>
                <div className="buy">
                    <div className="select-all">
                        <div className={this.state.mySelect?"checkbox-green all":"checkbox-green"} onClick={this.state.allRepertoryGood.length>0?this.mySelect.bind(this):""} type="checkbox"  ref="all"></div>
                        <span >全选</span>
                    </div>
                    {
                        this.state.totalMoney === 0?
                            <div  className="pay">
                                结算
                            </div>:
                            <Link to="/membercenter/sourcesubmitorder" className="pay pay-active" onClick={this.pay.bind(this)}>
                                结算({this.state.payInfo.length})
                            </Link>

                    }
                    <div className="total">
                        合计：<span>{this.state.totalMoney.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default SourceShopCart;
