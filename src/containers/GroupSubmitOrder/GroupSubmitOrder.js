/**
 * Created by web前端 on 2017/9/3.
 */
import React,{ Component } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { get } from '../../fetch/get';
import GoodPayItem from '../../components/GoodPayItem/GoodPayItem';
import Loading from '../../components/Loading/Loading';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './GroupSubmitOrder.less';
import Logo from './logo.png'
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
//const userOpenId = JSON.parse(openId(document.cookie));
let minItem = "";

class GroupSubmitOrder extends Component{
    state={
        logo:'',
        payGoodInfo:null,
        goodInfo:[],
        totalPrice:0,//商品总价，价格*数量
        selectWrapperShow:false,
        modalShow:false,
        expressTypeShow:false,
        allPrice:0,//包含所有的总价
        thisExpress:"",//当前选中的配送方式
        expressChargeList:[],//配送方式的数组，包含了快递名称，是都是当前选中，id，只匹配当前城市的运费
        markValue:"",
        goodTotalWeight:0,
        openId:openId(document.cookie),
        submitLoading:false
    };
    componentDidMount(){

        let goodInfo = JSON.parse(sessionStorage.getItem("goodInfo"));
        //请求商品订单详情
        let addressId = sessionStorage.getItem('addressId');
        if(addressId === null){
            let fetchData = {
                goodsIds:sessionStorage.getItem('goodsId'),
                openId:this.state.openId
            };
            fetch(`${API}/cart/presettlement/`,{
                method:'POST',
                body:JSON.stringify(fetchData)
            }).then(res=>{
                return res.json();
            }).then(data=>{
                this.setState({
                    payGoodInfo:data,
                    goodInfo:goodInfo
                },()=>{
                    console.log(this.state.payGoodInfo);
                    console.log(this.state.goodInfo);
                    if(this.state.payGoodInfo.addressInfo){
                        this.goodPrice();
                        //this.goodWeight();
                        this.goodExpressCharge();
                        this.calculateTotalPrice();
                    }else{
                        this.state.totalPrice = this.state.totalPrice+this.state.goodInfo[0].price*this.state.goodInfo[0].total;
                        this.setState({
                            allPrice:this.state.totalPrice
                        },()=>{
                            console.log(`总价格--------------${this.state.allPrice}`)
                        })
                    }
                });
            });
        }else{
            get(`${API}/member/logistics/list/${addressId}`).then( res=>{
                return res.json()
            }).then(data=>{

/*
                console.log(this.state.payGoodInfo)
                this.state.payGoodInfo.express = data.express;
                this.state.payGoodInfo.addressInfo = data.addressInfo;
                this.state.payGoodInfo.result = data.result;
*/
                this.setState({
                    payGoodInfo:data,
                    expressChargeList:[],
                    goodInfo:goodInfo,
                },()=>{
                    console.log(this.state.goodInfo)
                    this.goodPrice();
                    //this.goodWeight();
                    this.goodExpressCharge();
                    this.calculateTotalPrice()
                })
            })

        }

    }
    //--------------------商品的总价
    goodPrice=()=>{
        this.state.goodInfo.map((item,index)=>{
            this.state.totalPrice+=item.price*item.total;
            this.setState({})
        });    };
    //--------------------商品重量
    goodWeight=()=>{
        this.state.goodTotalWeight = this.state.goodTotalWeight+this.state.goodInfo.weight*this.state.goodInfo.total;
        this.setState(this.state);
    };
    //--------------------计算运费

    goodExpressCharge=()=>{
        let expressFee = [];//声明一个数组，存储计算后的运费，便于取最小值
        //循环运费信息，每个配送方式出一个运费
        this.state.payGoodInfo.express.map((item,index)=>{
            let expressTempInfo = {
                name:item.logisticsName,
                matchCharge:0,
                id:item.id,
                isCurrent:0
            };

            //刨除包邮商品，计算运费

            this.state.goodInfo.map((goodInfoItem,index)=>{
                let goodTotalWeight = 0;
                let noFreeExpressTotalPrice = 0;
                if(!goodInfoItem.marketingStrategyModel){
                    //如果商品没包邮策略，那么运费直接算
                    goodTotalWeight += goodInfoItem.weight*goodInfoItem.total;
                    noFreeExpressTotalPrice += goodInfoItem.price*goodInfoItem.total;
                    if(item.quota){
                        //console.log(`有物流满包邮策略`);
                        console.log(`商品的价格${noFreeExpressTotalPrice}`)
                        console.log(`运费满减条件${item.quota}`)
                        if(noFreeExpressTotalPrice>=item.quota){
                            expressTempInfo.matchCharge = 0;
                            console.log(`直接减`)
                        }else{
                            console.log(`正常算`);
                            if(goodTotalWeight <= item.initialWeight){
                                console.log(`商品重量小于首重`);
                                expressTempInfo.matchCharge = item.initialFee
                            }else{
                                console.log(`商品重量大于首重`);
                                expressTempInfo.matchCharge = item.initialFee+((goodTotalWeight-item.initialWeight)/item.addWeight)*item.addFee
                            }
                        }
                    }else{
                        //console.log(`正常算`);
                        if(goodTotalWeight <= item.initialWeight){
                            //console.log(`商品重量小于首重`);
                            expressTempInfo.matchCharge = item.initialFee
                        }else{
                            //console.log(`商品重量大于首重`);
                            expressTempInfo.matchCharge = item.initialFee+((goodTotalWeight-item.initialWeight)/item.addWeight)*item.addFee
                        }
                    }

                }else{
                    //如果商品有包邮策略，那么直接运费为0
                    expressTempInfo.matchCharge = 0;
                }
            });

            //如果物流有物流满包邮策略，直接减,如果没有，正常算
            expressFee.push(expressTempInfo.matchCharge);
            this.state.expressChargeList.push(expressTempInfo);
        });
        //将运费最低的配送方式打上对号
        for(let i=0;i<this.state.expressChargeList.length-1;i++){
            for(let j = i+1;j<this.state.expressChargeList.length;j++){
                let temp = this.state.expressChargeList[i];
                if(temp.matchCharge>this.state.expressChargeList[j]){
                    let temp2 = this.state.expressChargeList[j];
                    this.state.expressChargeList[j] = temp;
                    this.state.expressChargeList[i] = temp2
                }
            }
        }
        this.state.expressChargeList[this.state.expressChargeList.length-1].isCurrent = 1;
        this.setState({
            thisExpress:this.state.expressChargeList[this.state.expressChargeList.length-1]
        },()=>{
            this.calculateTotalPrice();
        })
        /*
         this.state.expressChargeList.map((item,index)=>{
         if(item.matchCharge === Math.min.apply(null,expressFee)){
         item.isCurrent = 1;
         minItem = item;
         this.setState({
         thisExpress:item
         },()=>{
         console.log(this.state.thisExpress)
         this.calculateTotalPrice();
         })
         }
         });
         */
    };
    //-------------------------计算付款价格函数
    calculateTotalPrice=()=>{
        this.setState({
            allPrice:Number(this.state.totalPrice)+Number(this.state.thisExpress.matchCharge)
        });
    };
    //阻止滚动穿透
    preventBodyScroll=()=>{
        /*      let wrapper = document.getElementsByTagName("body")[0];
         wrapper.onTouchMove = function(e){
         e.preventDefault()
         }*/
        //document.body.clientHeight = document.body.scrollHeight
        const body = document.getElementsByTagName('body')[0];
        const html = document.getElementsByTagName('html')[0];
        let scrollTop = -document.body.scrollTop+25;

        if(this.state.modalShow){
            html.style.cssText=`position: relative;top:${scrollTop}px;height:100%;overflow: hidden;`;
            body.style.cssText=`position: relative;top:${scrollTop}px;height:100%;overflow: hidden;`;
        }else{
            html.style.cssText="";
            body.style.cssText="";
        }
    };
    //设置模态层的高度
    setModalHeight(){
        let bodyHeight = document.body.scrollHeight+"px";
        let modal =document.getElementsByClassName("select-wrapper-modal")[0];
        modal.style.height = bodyHeight;
    }
    //弹出优惠券
    showSelectWrapper=()=>{
        this.setState({
            selectWrapperShow:true,
            modalShow:true
        },()=>{
            //this.preventBodyScroll();
            this.setModalHeight()
        });
    };
    //隐藏模态层和弹出层
    hideSelectWrapper=()=>{
        this.setState({
            selectWrapperShow:false,
            expressTypeShow:false,
            modalShow:false
        },()=>{
            this.preventBodyScroll();
        })
    };
    //弹出配送方式
    showExpressType=()=>{
        this.setState({
            expressTypeShow:true,
            modalShow:true
        },()=>{
            //this.preventBodyScroll();
            this.setModalHeight()
        })
    };

    //点击选择配送方式
    selectExpress=(index)=>{
        //改变UI层面，点击当前激活
        this.state.expressChargeList.map((item,index)=>{
            item.isCurrent = 0;
            this.setState(this.state);
        });
        this.state.expressChargeList[index].isCurrent = 1;
        this.state.expressCharge = this.state.expressChargeList[index].matchCharge;
        this.state.thisExpress = this.state.expressChargeList[index];
        this.setState(this.state,()=>{
            //调用一下计算价格函数
            this.calculateTotalPrice();

        });
        let _this = this;
        setTimeout(()=>{
            _this.setState({
                expressTypeShow:false,
                modalShow:false
            },()=>{
                _this.preventBodyScroll()
            })
        },60);

    };
    //提交订单
    submitMyOrder=()=>{
        console.log(this.state);
        //获取地址ID
        let addressId = this.state.payGoodInfo.addressInfo.id;
        //获取物流ID
        let expressId = "";
        this.state.expressChargeList.map((item,index)=>{
            if(item.isCurrent === 1){
                expressId = item.id
            }
        });
        //获取商品信息
        let goods = [];
        this.state.goodInfo.map((item,index)=>{
            goods.push({
                goodsId:item.goodsId,
                specItemId:item.specItemId,
                num:item.total
            });
        });
        //获取价格
        let price = this.state.allPrice;
        //获取备注
        let remark = this.state.markValue;
        let goodSubmitInfo = {
            openId:this.state.openId,
            groupOrderId:this.state.goodInfo[0].groupOrderId,
            addressId : addressId,
            expressId : expressId,
            goods : goods,
            price : price,
            remark : remark,
            expressFee : this.state.thisExpress.matchCharge
        };
        this.setState({
            submitLoading:true
        });

        fetch(`${API}/groupbuy/add`,{
            method:'POST',
            body:JSON.stringify(goodSubmitInfo)
        }).then(res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                submitLoading:false
            });

            if(data.result){
                if(data.msg === '已经参与拼单'){
                    alert(data.msg)
                    window.location.hash ="/index";
                }else{
                    window.location.hash ="/myorderformdetail/"+data.msg
                }

            }else{
                alert('提交失败')
            }
        })

    };
    //记录备注信息
    recordRemark =()=>{
        this.setState({
            markValue:this.refs.remark.value
        })
    };
    //点击选择地址，session
    storeOrderData=()=>{
        let initialData={
            goodInfo:this.state.goodInfo,
            markValue:this.state.markValue,
            openId:this.state.openId,
            payGoodInfo:this.state.payGoodInfo
        };
        sessionStorage.setItem("initialData",JSON.stringify(initialData))
        sessionStorage.setItem('lastPage','groupsubmitorder');
        //this.props.storageOrderData(orderData)
    };
    goBackToCart=()=>{
        this.props.goBack();
        sessionStorage.clear();
        //window.history.go(-1)
        //console.log(this.state.goodInfo[0].goodsId)

    };
    componentDidUpdate(){
        //刷新的时候把state存储到session中
        let initialData={
            goodInfo:this.state.goodInfo,
            markValue:this.state.markValue,
            openId:this.state.openId,
            payGoodInfo:this.state.payGoodInfo,
            minItem:minItem
        };
        sessionStorage.setItem("initialData",JSON.stringify(initialData));
    }
    //组件卸载，把session的addressId去掉
    componentWillUnmount(){
        sessionStorage.removeItem('addressId');
    }
    render(){
        return (
            <div className="submit-order">
                <div className="confirm-order">
                    <div className="confirm-order-inner">
                        {
                            console.log(sessionStorage.getItem("lastPage"))
                        }
                        <Link to={"/detail/"+sessionStorage.getItem("goodsId")} className="go-back" onClick={this.goBackToCart}>
                            <Icon type="left" />
                            <span>确认订单</span>
                        </Link>
                    </div>
                </div>
                {
                    this.state.payGoodInfo === null?
                        <div className="submit-order-loading"><Loading/></div>
                        :
                        <div className="submit-order-content">
                            {
                                this.state.payGoodInfo.addressInfo?
                                    <Link to="/newaddress" className="address-info" onClick={this.storeOrderData}>
                                        <div className="address-info-inner">
                                            <div className="Consignee">
                                                <span>收货人：</span><span>{this.state.payGoodInfo.addressInfo.consignee}</span><span>{this.state.payGoodInfo.addressInfo.telephone}</span>
                                            </div>
                                            <div className="info">
                                                <Icon type="environment-o" />
                                                <div className="myAdress" >
                                                    收货地址：{this.state.payGoodInfo.addressInfo.address}
                                                </div>
                                                <Icon type="right"/>
                                            </div>
                                        </div>
                                        <div className="decoration">
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                            <div className="blue"></div>
                                            <div className="red"></div>
                                        </div>
                                    </Link>
                                    :
                                    <div className="address-info add-address-wrapper" onClick={this.storeOrderData}>
                                        <Link to="/newaddress" className="add-address">
                                            <Icon type="plus-circle-o" /> 新增地址
                                        </Link>
                                    </div>
                            }
                            <div className="submit-order-good-info">
                                <div className="goodInfoInner">
                                    <div className="title">
                                        <span className="logo"><img src={Logo} alt=""/></span><span>宝宝的农场</span>
                                    </div>
                                    <div className="goodWrapper">
                                        <GoodPayItem data={this.state.goodInfo[0]} />
                                    </div>
                                    <div className="submit-order-price-info">
                                        <span>共{this.state.goodInfo.length}件商品</span>  小计 <span>¥</span> <span>{this.state.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {/*----------------配送方式--------------*/}
                            {
                                this.state.payGoodInfo.addressInfo?
                                    <div className="submit-order-express">
                                        <div className="submit-order-express-inner" onClick={this.showExpressType}>
                                            <span>配送方式</span>
                                            <div className="express-type">
                                                <span >{this.state.thisExpress.name}  运费：<span>¥</span> <span>{this.state.thisExpress.matchCharge}</span></span>
                                                <Icon type="right" />
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="submit-order-express">
                                        <div className="submit-order-express-inner" onClick={this.showExpressType}>
                                            <span>配送方式</span>
                                            <div className="express-type please-add-address">
                                                请先添加地址
                                            </div>
                                        </div>
                                    </div>

                            }

                            {/*--------------------------可用积分(后期开发)-------------------------*/}
                            {/*                <div className="submit-discount-coupon">
                             <div className="submit-discount-coupon-inner">
                             <span>可用积分</span>

                             <div className="discount-count">
                             {

                             this.state.payGoodInfo.score === 0? <span className="noDiscount">无可用积分</span>:
                             <span className="userScore">
                             {this.state.payGoodInfo.score}
                             </span>
                             }
                             </div>
                             </div>
                             </div>*/}
                            {/*--------------------------是否使用包邮券(后期开发)-------------------------*/}
                            {/*
                             <div className="submit-discount-coupon">
                             <div className="submit-free-post-inner">
                             <span>是否使用包邮券</span>
                             <div className="check-post-wrapper" onClick={this.useFreePost.bind(this)}>
                             <div className={this.state.useFreePost?"check-post check-post-active":"check-post"} ></div>
                             </div>

                             </div>
                             </div>
                             */}
                            {/*--------------------------买家留言-------------------------*/}
                            <div className="submit-order-remark">
                                <div className="submit-order-remark-inner">
                                    <span>买家留言:  </span><input type="text" ref="remark" placeholder="（选填）对本次交易的说明" onChange={this.recordRemark.bind(this)} value={this.state.markValue}/>
                                </div>
                            </div>
                            {/*--------------------------提交订单-------------------------*/}
                            <div className="good-pay-bottom">

                                <div className="total-price"> 合计 <span>¥</span> <span>{this.state.allPrice.toFixed(2)}</span></div>
                                <div className={this.state.payGoodInfo.addressInfo?"submit-button":"not-allow-submit"} onClick={this.state.payGoodInfo.addressInfo?this.submitMyOrder:""}>提交订单</div>
                            </div>

                            {/*--------------------------模态层---------------------------*/}
                            <ReactCSSTransitionGroup
                                transitionName="modal-display"
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={300}
                            >
                                {
                                    this.state.modalShow? <div className="select-wrapper-modal"onClick={this.hideSelectWrapper}></div>:null
                                }
                            </ReactCSSTransitionGroup>
                            {/*--------------------------配送方式-------------------------*/}
                            <ReactCSSTransitionGroup
                                transitionName="select-wrapper-display"
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={300}
                            >
                                {
                                    this.state.expressTypeShow?
                                        <div className="select-wrapper">
                                            <p><span className="alert-title">配送方式</span></p>
                                            <div className="select-wrapper-inner">
                                                {
                                                    this.state.expressChargeList.map((item,index)=>{
                                                        return (
                                                            <div className={item.isCurrent === 1? "express-select express-select-current":"express-select"} key={index} onClick={this.selectExpress.bind(this,index)}>
                                                                <span>{item.name}</span>
                                                                <span>运费：<span>{item.matchCharge.toFixed(2)}</span> 元</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>:null
                                }
                            </ReactCSSTransitionGroup>

                        </div>

                }
                {
                    this.state.submitLoading?
                        <div className="submit-loading">
                            <div>
                                <Icon type="loading" />
                            </div>
                            <div>
                                提交中……
                            </div>
                        </div>
                        :
                        ""
                }

            </div>
        )
    }
}
const mapStateToProps=(state)=>{

    return {
        storedData:state.goBack.storedMyData,
        selectAddress:state.goBack.address,
        goodInfoFromCart:state.transferGoodToOrder,
        returnedGoodInfo:state.goBack.returnedGoodInfo,
        addressId:state.addressId
    };

};
const mapDispatchToProps=(dispatch)=>{
    return {
        storageOrderData(data){
            dispatch({
                type:"STORE_ORDER_DATA",
                data:data
            })
        },
        goBack(){
            dispatch({
                type:"CLEAR_STORE",
                data:{}
            })
        }
    }

};
export default connect (mapStateToProps,mapDispatchToProps)(GroupSubmitOrder)