/**
 * Created by web前端 on 2017/8/8.
 */
import React, {Component} from 'react';
import {Tabs, Icon, Carousel, Radio} from 'antd';
import {Link} from 'react-router-dom'
import './Detail.less';
import Loading from '../../components/Loading/Loading';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import wx from 'weixin-js-sdk';
import Timer from '../../components/Timer/Timer'
import { connect } from 'react-redux'
import { openId } from '../../util/openId'
import {get} from '../../fetch/get';
import CommentItem from '../../components/CommonItem/CommonItem';
import {API} from '../../constants/API';
class Detail extends Component {
    constructor(props){
        super(props);
        this.state={
            detailGoodData: {},
            addToCart: false,//控制规格弹框的显示隐藏
            hasAddToCart: false,
            count: 1,
            thisGood: 0,
            whichSpeci: 0,
            myCartGoodsCount: 0,
            detailPic: "",
            commonList: "",
            commentPageNummber: 1,
            loagingPage: false,
            hasBeenBottom: true,
            noData: false,
            favorite: false,
            favoriteBtnDisable:false,
            btnDisable:false,
            openId:openId(document.cookie),
            userInfo:"",
            isHasImg:"",
            isGroup:false,
            groupOrderId:null,
            collectionData:"",
            numToCart:0
        }
    }

    componentWillMount(){
        let userData = JSON.parse(localStorage.getItem('userData'));
        this.setState({
            userInfo:userData
        })
    }
    componentDidMount() {
        this.setState({
            //openId(document.cookie)
            thisGood: this.props.match.params.id,
        }, () => {
            get(`${API}/detail/${this.state.thisGood}?openId=${this.state.openId}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                //console.log(data)
                    this.setState({
                        detailGoodData: data,
                        collectionData:data.collection,
                        hasBeenBottom: true
                    },()=>{
                        console.log(this.state.detailGoodData)
                        get(`${API}/weixin/fetchconfig?openId=${this.state.openId}&url=http://m.baobaofarm.com/?/detail/${this.props.match.params.id}`).then(res=>{
                            return res.json()
                        }).then(data=>{
                            wx.config({
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: data.objData.appId, // 必填，公众号的唯一标识
                                timestamp:data.objData.config_timestamp , // 必填，生成签名的时间戳
                                nonceStr: data.objData.config_nonceStr, // 必填，生成签名的随机串
                                signature: data.objData.config_signature,// 必填，签名，见附录1
                                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            });

                            wx.onMenuShareTimeline({
                                    title: this.state.detailGoodData.goodsName, // 分享标题
                                    link: data.objData.redirect_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    imgUrl: this.state.detailGoodData.listImage, // 分享图标
                                    success: function () {
                                        //alert('已分享')
                                        //window.location.href = 'http://test.baobaofarm.com/'
                                    },
                                    cancel: function () {
                                        //alert('已取消')
                                        //window.location.href = 'http://test.baobaofarm.com/'
                                    }
                                });
                                //分享给朋友
                                wx.onMenuShareAppMessage({
                                    title: this.state.detailGoodData.goodsName, // 分享标题
                                    desc: '好东西分享给你', // 分享描述
                                    link: data.objData.redirect_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    imgUrl: this.state.detailGoodData.listImage, // 分享图标
                                    type: '', // 分享类型,music、video或link，不填默认为link
                                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                    success: function () {
                                        // 用户确认分享后执行的回调函数
                                        //alert('已分享')
                                        //window.location.href = 'http://test.baobaofarm.com/'
                                    },
                                    cancel: function () {
                                        // 用户取消分享后执行的回调函数
                                        //alert('已取消')
                                        //window.location.href = 'http://test.baobaofarm.com/'
                                    }
                                });
                        });
                    })
                })
        });

/*
        function parseUrl(_url) {
            var pattern = /(\w+)=(\w+)/ig;
            var parames = {};//定义数组
            _url.replace(pattern, function (a, b, c) {
                parames[b] = c;
            });
            return parames;
        }
*/
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    //点击唤出选择规格弹框  自己发起拼单选择规格
    selectSpeci = (e) => {
        if(e.target.innerHTML === '发起团购'){
            this.setState({
                isGroup:true
            })
        }
        this.setState({
            addToCart: true
        }, () => {
            this.refs.speciList.children[this.state.whichSpeci].className = "myItems";
            let bodyHeight = document.body.scrollHeight+"px";
            let modal =document.getElementsByClassName("specificationModal")[0];
            modal.style.height = bodyHeight;
        })
    };
    //加入别人的拼团
    toJoinAndSelect=(index)=>{
            this.setState({
                isGroup:true,
                addToCart:true,
                groupOrderId:this.state.detailGoodData.groupOrderList[index].id
            }, () => {
                this.refs.speciList.children[this.state.whichSpeci].className = "myItems";
                let bodyHeight = document.body.scrollHeight+"px";
                let modal =document.getElementsByClassName("specificationModal")[0];
                modal.style.height = bodyHeight;
            })
    };
    //点击加入购物车按钮，向后台传递数据
    addToMyCart = () => {
        this.setState({
            numToCart:this.state.numToCart + this.state.count
        },()=>{
            console.log(`所选商品的累计数量-------------${this.state.numToCart}`);
            console.log(`商品的库存----------${this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock}`)

            if(this.state.numToCart>this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock){
                alert("所选数量超出库存数量");
                return
            }else{
                //获取用户选择的商品数据，添加进购物车
                let cartData = {
                    goodsId: parseInt(this.state.thisGood),
                    specId: this.state.detailGoodData.specification[0].specId,
                    specItemId:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemId,
                    num:this.state.count,
                    openId:this.state.openId
                };
                //console.log(cartData);
                //禁止用户多次点击，提交数据
                if(!this.state.btnDisable){
                    this.setState({
                        btnDisable:true
                    },()=>{
                        fetch(`${API}/cart/add`,{
                            method:'POST',
                            body:JSON.stringify(cartData)
                        }).then( res=>{
                            return res.json()
                        }).then( data=>{
                            //加入成功后返回数据，改变状态
                            if(data.result){
                                this.setState({
                                    hasAddToCart: true,
                                    myCartGoodsCount: data.dataNum
                                });
                                setTimeout(() => {
                                    this.setState({
                                        hasAddToCart:false,
                                        btnDisable:false
                                    })
                                }, 500)
                            }
                        })
                    });
                }
            }
        });


    };
    //点击收藏
    favorite = () => {
        //获取用户选择的商品数据，添加进收藏
        let favouriteData = {
            goodsId: parseInt(this.state.thisGood),
            specId: this.state.detailGoodData.specification[0].specId,
            specItemId:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemId,
            num:this.state.count,
            openId:this.state.openId
        };
        //防止用户多次点击
        fetch(`${API}/member/collection/add`,{
            method:'POST',
            body:JSON.stringify(favouriteData)
        }).then( res=>{
            return res.json()
        }).then( data=>{
            if(data.msg.indexOf(1)>0){
                this.setState({
                    collectionData:1
                })
            }else{
                this.setState({
                    collectionData:2
                })
            }
        })
    };
    //隐藏选规格列表,同时团购
    hideAddToCart = () => {
        this.setState({
            addToCart: false,
        },()=>{
            let goodInfo = [{
                groupOrderId:this.state.groupOrderId,
                goodsId:this.state.thisGood,
                goodsName:this.state.detailGoodData.goodsName,
                listImage:this.state.detailGoodData.listImage,
                price:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].groupBuyPrice,
                specItemName:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemName,
                specStock:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock,
                specItemId:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemId,
                total:this.state.count,
                weight:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].weight,
                marketingStrategyModel:this.state.detailGoodData.marketingStrategyModel
            }];
            //console.log(goodInfo);

            if(this.state.isGroup){
                sessionStorage.setItem('goodInfo',JSON.stringify(goodInfo))
                window.location.hash='/groupsubmitorder'
            }
        });
    };

    //隐藏模态层y
    hideAddToCartModal = () => {
        this.setState({
            addToCart: false,
            isGroup:false
        })
    };
    //弹出框内选择规格
    selectMySpeci = (e) => {

        if (e.target.className !== "myItems") {
            this.setState({
                count: 1
            })
        }
        for (var i = 0; i < this.refs.speciList.children.length; i++) {
            this.refs.speciList.children[i].className = "speciItems";
        }
        this.setState({
            whichSpeci: e.target.id
        }, () => {
            this.refs.speciList.children[this.state.whichSpeci].className = "myItems"
        })
    };
    //加减数量
    addCount = () => {
        if(this.state.count < this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock){
            this.setState({
                count: this.state.count + 1
            })
        }else{
            alert('超出库存')
        }
    };
    subCount = () => {
        if (this.state.count > 1) {
            this.setState({
                count: this.state.count - 1
            })
        }
    };
    tabTheDetail = (key) => {
        if (key === "detail") {
            if(this.state.detailGoodData.detailContent){
                console.log(111111111)
                this.refs.detailContent.innerHTML = this.state.detailGoodData.detailContent;
            }else{
                console.log(2222222222)
                this.refs.detailContent.innerHTML = `<div class = "detail-loading">加载中...</div>`
            }
        }
        if (key === "comment") {
            window.addEventListener('scroll', this.handleScroll);
            let commentData = {
                goodsId:this.state.thisGood,
                isHasImg:this.state.isHasImg
            };
            console.log(commentData);
            fetch(`${API}/comment/detail`, {
                method: 'post',
                body: JSON.stringify(commentData)
            }).then(res=>{
                return res.json()
            }).then(data=>{
                if(data.result){
                    data.data.map((item,index)=>{
                        if(item.imgPaths){
                            item.imgPaths = item.imgPaths.split(',');
                        }
                    });
                    //data.data.imgPaths = data.data.imgPaths.split(',');
                    //console.log(data.data[0].imgPaths)
                    this.setState({
                        commonList: data.data
                    })
                }else{
                    this.setState({
                        noData:true
                    })
                }
            });
        }
    };
    commentType = (e) => {
        this.setState({
            isHasImg:e.target.value,
            commonList:"",
            commentPageNummber:1,
            hasBeenBottom:true,
            noData:false
        },()=>{
            let commentData = {
                goodsId:this.state.thisGood,
                isHasImg:this.state.isHasImg
            };
            console.log(commentData);
            fetch(`${API}/comment/detail`,{
                method:"POST",
                body:JSON.stringify(commentData)
            }).then( res=>{
                return res.json()
            }).then( data=>{

                if(data.result){
                    data.data.map((item,index)=>{
                        if(item.imgPaths){
                            item.imgPaths = item.imgPaths.split(',')
                        }
                    });
                    this.setState({
                        commonList: data.data
                    })
                }else{
                    this.setState({
                        noData:true
                    })
                }
            })
        })
    };
    //单独购买
    transferGoodData=()=>{
        let goodInfo =[{
            goodsId:this.state.thisGood,
            goodsName:this.state.detailGoodData.goodsName,
            listImage:this.state.detailGoodData.listImage,
            price:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].price,
            specItemName:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemName,
            specStock:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock,
            specItemId:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemId,
            total:this.state.count,
            weight:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].weight,
            marketingStrategyModel:this.state.detailGoodData.marketingStrategyModel
        }];
        sessionStorage.setItem('goodInfo',JSON.stringify(goodInfo))
        //console.log(goodInfo);
        //this.props.transferGoodToOrder(goodInfo)

    };
    handleScroll = () => {
        //滚动请求分页
        let totalHeight = document.body.scrollHeight;
        let scrolledTop = document.body.scrollTop;
        let screenHeight = document.body.clientHeight;
        if (this.state.hasBeenBottom) {
            if (scrolledTop + screenHeight === totalHeight &&  totalHeight != screenHeight) {
                this.setState({
                    commentPageNummber: this.state.commentPageNummber + 1,
                    loagingPage: true,
                    hasBeenBottom: false
                }, () => {
                    let commentData = {
                        goodsId:this.state.thisGood,
                        isHasImg:this.state.isHasImg
                    };
                    //console.log(`滚动请求分页-----------${API}/comment/detail?pageNumber=${this.state.commentPageNummber}`)
                    fetch(`${API}/comment/detail?pageNumber=${this.state.commentPageNummber}`,{
                        method:"POST",
                        body:JSON.stringify(commentData)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{

                        if(data.result){
                            data.data.map((item,index)=>{
                                if(item.imgPaths){
                                    item.imgPaths = item.imgPaths.split(',')
                                }
                            });

                            this.setState({
                                loagingPage:false,
                                commonList: this.state.commonList.concat(data.data),
                                hasBeenBottom:true
                            })
                        }else{
                            this.setState({
                                loagingPage:false,
                                hasBeenBottom:false,
                                noData:true
                            })
                        }
                    })
                })
            }
        }
    };
    componentWillUnmount(){
        sessionStorage.setItem('goodsId',this.state.thisGood);
        sessionStorage.setItem('lastPage','detail');
    }
    render() {
        const data = this.state.detailGoodData;
        return (
            <div className="detail">
                <Tabs defaultActiveKey="1" className='detail-tab' onTabClick={this.tabTheDetail}>
                    <Tabs.TabPane tab="商品" key="goods">
                        {
                            this.state.detailGoodData.goodsName ?
                                <div className="good-info">
                                    <div className="detail-banner">
                                        {/*----------------------轮播图---------------------*/}
                                        <div className="banner-wrapper">
                                            <Link to="/index" className="go-back-to-home">
                                                <Icon type="home"/>
                                            </Link>
{/*
                                            <div className="go-back-to-home go-back-where">
                                                <Icon type="left" />
                                            </div>
*/}
                                            <Carousel autoplay nextArrow={true} speed={800} className="carousel">
                                                {
                                                    this.state.detailGoodData.detailImage.map((item, index) => {
                                                        return (
                                                            <img src={item} key={index} className="detail-banner-img"/>
                                                        )
                                                    })
                                                }
                                            </Carousel>
                                        </div>
                                    </div>
                                    <div className="other-info">
                                        <div className="name-content">
                                            {/*------------------------商品名称--------------------*/}
                                            <div className="good-name">
                                                {this.state.detailGoodData.goodsName}
                                            </div>
                                            <div className="price-info">
                                                <div className="sale-price">
                                                    {
                                                        this.state.detailGoodData.isGroupBuy==="1"?
                                                            <div>
                                                                <span>拼团价 :<span className="real-price">￥{this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].groupBuyPrice}</span></span>
                                                                <span>单价 :<span className="real-price">￥{this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].price}</span></span>
                                                            </div>
                                                            :
                                                            <span>单价 :<span className="real-price">￥{this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].price}</span></span>

                                                    }
                                                    <div className="select-repertory">
                                                        剩余：<span
                                                        className="realPrice">{this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock}</span>
                                                    </div>

                                                </div>

                                                {
                                                    this.state.userInfo.groupId !=1 ?
                                                        <div className="earnings">
                                                            <span>收益：</span>{this.state.detailGoodData.incomeRate.toFixed(2)}%
                                                        </div>
                                                        :
                                                        ""
                                                }
                                                {
                                                    this.state.detailGoodData.isGroupBuy === "1"?
                                                        <div className="detail-strategy">
                                                            <span className="detail-strategy-group-tag">团</span>
                                                            <span>{this.state.detailGoodData.groupBuyNum}人团</span>
                                                        </div>
                                                        :
                                                        ""
                                                }

                                                {
                                                    this.state.detailGoodData.marketingStrategyModel?
                                                        this.state.detailGoodData.marketingStrategyModel.map((item,index)=>{
                                                            return (
                                                                <div className="detail-strategy pinkage" key={index}>
                                                                    <span className="detail-strategy-pinkage">邮</span>
                                                                    <span>{item.strategyName}</span>
                                                                </div>

                                                            )

                                                        })
                                                        :
                                                        ""
                                                }



                                                {
                                                    this.state.detailGoodData.marketingStrategyList?

                                                            <div className="detail-strategy">
                                                                <span className="detail-strategy-sub">减</span>
                                                                <div>
                                                                    {
                                                                        this.state.detailGoodData.marketingStrategyList.map((item,index)=>{
                                                                            return <div key={index}>{item.strategyName}</div>
                                                                        })
                                                                    }
                                                                    {
                                                                        this.state.detailGoodData.isGroupBuy === '1'?
                                                                            <div className="group-msg">拼团不享受满减优惠</div>
                                                                            :
                                                                            ""
                                                                    }

                                                                </div>
                                                            </div>

                                                        :
                                                        ""
                                                }

                                            </div>
                                            {/*------------------------打折信息--------------------*/}
                                            <div className="discount-info">
                                                {
                                                    this.state.detailGoodData.strategyName ?
                                                        this.state.detailGoodData.strategyName.map((item, index) => {
                                                            return (
                                                                <p key={index}>{item}</p>
                                                            )
                                                        })
                                                        :
                                                        ""
                                                }
                                            </div>
                                            <div className="remark">
                                                {this.state.detailGoodData.remark}
                                            </div>
                                        </div>
                                        <div className="my-specification" onClick={this.selectSpeci}>
                                            <div>
                                                已选择：<span><span
                                                className="realPrice">{this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specItemName}</span> </span>
                                            </div>
                                            <Icon type="right"/>
                                        </div>
                                        <div className="send">
                                            {
                                                this.state.detailGoodData.sendArea?
                                                    <div className="delivery-area clearfix">
                                                        <div>配送范围：</div>
                                                        <p> {this.state.detailGoodData.sendArea} </p>
                                                    </div>
                                                        :
                                                    ""
                                            }
                                            {
                                                this.state.detailGoodData.sendTime?
                                                    <div className="send-time clearfix">
                                                        <div>发货时间：</div>
                                                        <p>{ this.state.detailGoodData.sendTime == undefined ? "" : data.sendTime }</p>
                                                    </div>
                                                        :
                                                    ""
                                            }
                                            {
                                                this.state.detailGoodData.groupOrderList?
                                                    <div className="group-buy-list">
                                                        <div className="group-buy-top">
                                                            <div>
                                                                可直接参与拼单
                                                            </div>
                                                        </div>
                                                        <div className="group-buy-content">

                                                            {

                                                                this.state.detailGoodData.groupOrderList.map((item,index)=>{
                                                                    return (
                                                                        <div className="group-buy-item" key={index}>
                                                                            <div className="group-user">
                                                                                <div className="group-avatar">
                                                                                    <img src={item.photo} alt="加载失败咯"/>
                                                                                </div>
                                                                                <span className="user">{item.memberName}</span>
                                                                            </div>
                                                                            <div className="group-buy-info">
                                                                                <div className="group-buy-info-left">
                                                                                    <div className="group-buy-info-left-top">
                                                                                        还差<span>{item.groupNum-item.num}人</span>拼成
                                                                                    </div>
                                                                                    <div className="group-buy-info-left-bottom">
                                                                                        还剩<Timer date={item.date} timerStyle={{"color":"#757575","fontSize":"10px",'display':"inline"}} day={false} second={true} minutes={true} character={true}/>
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    item.memberIdList.join(',').indexOf(this.state.userInfo.id.toString())>=0?
                                                                                        <div className="group-buy-info-right group-buy-info-right-gray">
                                                                                            已参与
                                                                                        </div>
                                                                                        :
                                                                                        <div className="group-buy-info-right" onClick={this.toJoinAndSelect.bind(this,index)}>
                                                                                            去拼单
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    :
                                                    ""

                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="good-detail-data-loading">
                                    <Loading/>
                                </div>
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="详情" key="detail" forceRender={true}>
                        <div className="detail-Info" ref="detailContent">

                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="评价" key="comment">
                        <div className="comment-wrapper">
                            <div className="comment-select-wrapper">
                                <Radio.Group defaultValue="" className="comment-select" size="large" onChange={this.commentType.bind(this)}>
                                    <Radio.Button value="">全部评价</Radio.Button>
                                    <Radio.Button value="1">有图评价</Radio.Button>
                                </Radio.Group>
                            </div>
                            <div className="comment-list">
                                {
                                    this.state.commonList === "" ?
                                        this.state.noData?
                                            <div className="no-data">没有更多数据</div>
                                                :
                                            <div className="comment-loading">
                                                <Loading/>
                                            </div>
                                        :
                                        <div>
                                            {
                                                this.state.commonList.map((item,index)=>{
                                                    return <CommentItem commentItemData={item} key={index}/>
                                                })

                                            }
                                            {
                                                this.state.noData?
                                                    <div className="no-data">没有更多数据</div>
                                                    :
                                                    ""
                                            }
                                        </div>
                                }
                                {this.state.loagingPage ? <div className="comment-bottom-loading"><Loading className="loading-page"/></div> : ""}
                            </div>
                        </div>
                    </Tabs.TabPane>
                    {/*----待后期开发<Tabs.TabPane tab="同店推荐" key="recommend">同店推荐</Tabs.TabPane>*/}
                </Tabs>
                {
                    this.state.detailGoodData.goodsName?
                        this.state.detailGoodData.isGroupBuy === "1"?
                            <div className="buy group">
                                <Link to="/index" className="service"><Icon type="home" /><span>首页</span></Link>
                                <div className="collect" onClick={this.favorite}>
                                    {
                                        this.state.collectionData==1?
                                            <Icon type="star" style={{color: "#64a930"}}/>
                                            :
                                            <Icon type="star-o"/>
                                    }<span>收藏</span>
                                </div>
                                <div className="group-buy" onClick={this.selectSpeci.bind(this)} name="group">
                                    发起团购
                                </div>
                                <Link to='/submitorder' className="add-to-cart" onClick={this.transferGoodData.bind(this)}>单独购买</Link>
                            </div>
                            :
                            <div className="buy">
                                <Link to="/index" className="service"><Icon type="home" /><span>首页</span></Link>
                                <div className="collect" onClick={this.favorite}>
                                    {
                                        this.state.collectionData==1?
                                            <Icon type="star" style={{color: "#64a930"}}/>
                                            :
                                            <Icon type="star-o"/>
                                    }
                                <span>收藏</span></div>
                                <Link to="/shopcart" className="my-shop-cart">
                                    {this.state.myCartGoodsCount === 0 ? "" : <div className="my-cart-count">{this.state.myCartGoodsCount}</div>}
                                    <Icon type="shopping-cart"/><span>购物车</span>
                                </Link>
                                <div className="add-to-cart" onClick={this.addToMyCart}>加入购物车</div>
                            </div>
                        :
                        ""
                }
                <div className="specification">
                    <ReactCSSTransitionGroup
                        transitionName="my-cart-modal"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {this.state.addToCart?<div className="specificationModal" onClick={this.hideAddToCartModal}></div>:null}
                    </ReactCSSTransitionGroup>

                    <ReactCSSTransitionGroup
                        transitionName="my-cart"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {this.state.addToCart ?
                            <div className="specificationList">
                                <div className="specification-pic">
                                    <img src={this.state.detailGoodData.listImage}/>
                                </div>
                                <div className="speci-info">
                                    <div className="speci-price">
                                        { data.specification == undefined ? "" : <span className="realPrice">￥{this.state.isGroup?this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].groupBuyPrice:this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].price}</span> }
                                    </div>
                                    <div className="speci-repertory">
                                        剩余：{ data.specification == undefined ? "" : this.state.detailGoodData.specification[0].specificationItems[this.state.whichSpeci].specStock}
                                    </div>
                                    <div className="speci-repertory">
                                        名称：{ data.specification == undefined ? "" : this.state.detailGoodData.specification[0].specName}
                                    </div>
                                </div>
                                <div className="speci-count">
                                    <div className="sub">
                                        <Icon type="minus" onClick={this.subCount}/>
                                    </div>

                                    <div className="good-number">{this.state.count} </div>
                                    <div className="add" onClick={this.addCount}>
                                        <Icon type="plus"/>
                                    </div>

                                </div>
                                {data.specification == undefined ? "" : data.specification.map((item, index) => {
                                    return (
                                        <div className="specifications" ref="speciList" key={item.specId}>
                                            {
                                                item.specificationItems.map((item, index) => {
                                                    return (
                                                        <div className="speciItems" key={item.specItemId} id={index}
                                                             onClick={this.selectMySpeci}>
                                                            {item.specItemName}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })}
                                <div className="speci-confirm" onClick={this.hideAddToCart}>确定</div>
                            </div> : null}
                    </ReactCSSTransitionGroup>
                </div>
                <ReactCSSTransitionGroup
                    transitionName="success-to-cart"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.hasAddToCart ? <div className="confirm-box">
                            <div className="comfirm-box-text">
                                <span><Icon type="check-circle-o"/></span>加入购物车成功
                            </div>
                            <div className="comfirm-box-modal"></div>
                        </div> : null
                    }
                </ReactCSSTransitionGroup>

            </div>
        )
    }
}
const mapPropsToState = (state)=>{
    return state
};
const mapDispatchToState = (dispatch)=>{
    return {
        transferGoodToOrder(data){
            dispatch({
                type:"TRANSFER_GOOD_DATA",
                data:data
            })
        }
    }
};

export default connect(mapPropsToState,mapDispatchToState)(Detail)