/**
 * Created by web前端 on 2017/8/9.
 */
import React, { Component } from 'react';
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import GoodItem from '../../components/GoodsItem/GoodsItem';
import { get } from '../../fetch/get';
import Loading from '../../components/Loading/Loading';
import './Home.less';
import {API} from '../../constants/API';
class Recommend extends Component{
    state={
        goodsItemInfo:[],
        banner:[],
        pageNumber:1,
        loagingPage:false,
        hasBeenBottom:true,
        haveData:{result:true},
        classifyPage:this.props.match.params.id,
        groupId:1,
        isLoading:true,
        bannerLoading:false
    };
    componentWillMount(){
        let userData = JSON.parse(localStorage.getItem('userData'));
        //初始进入页面或者刷新页面时候请求对应的数据
        this.setState({
            classifyPage:this.props.match.params.id,
            groupId:userData.groupId,
            bannerLoading:true
        },()=>{

        });

        get(`${API}/index/${this.state.classifyPage}?pageNumber=${this.state.pageNumber}`)
            .then((res)=>{return res.json();})
            .then((data)=>{
                console.log(data)
                this.setState({
                    goodsItemInfo:data,
                    isLoading:false
                },()=>{
                    console.log(this.state.goodsItemInfo)
                })
            });

        get(`${API}/banner/${this.state.classifyPage}`)
            .then((res)=>{return res.json()})
            .then((data)=>{
                this.setState({
                    banner:data,
                    bannerLoading:false
                })
            });
    }
    //首页分类路由变化时候请求对应的数据
    componentWillReceiveProps(nextProps){
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.setState({
                classifyPage:nextProps.match.params.id,
                goodsItemInfo:[],
                banner:[],
                pageNumber:1,
                loagingPage:false,
                hasBeenBottom:true,
                haveData:{result:true},
                bannerLoading:true,
                isLoading:true
            },()=>{
                //请求商品列表页数据
                get(`${API}/index/${this.state.classifyPage}?pageNumber=${this.state.pageNumber}`)
                    .then((res)=>{return res.json();})
                    .then((data)=>{
                    console.log(data)
                        this.setState({
                            goodsItemInfo:data,
                            isLoading:false
                        })
                    });
                //请求商品轮播图数据
                get(`${API}/banner/${this.state.classifyPage}`)
                    .then((res)=>{return res.json()})
                    .then((data)=>{
                        console.log(data);
                        this.setState({
                            banner:data,
                            bannerLoading:false
                        })
                    })
                })
        }
    }
    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll);
    }
    handleScroll=()=>{
        //滚动请求分页
        let totalHeight = document.body.scrollHeight;
        let scrolledTop = document.body.scrollTop;
        let screenHeight = document.body.clientHeight;

        if(this.state.hasBeenBottom){
            if(scrolledTop+screenHeight == totalHeight){
                this.setState({
                    pageNumber:this.state.pageNumber+1,
                    loagingPage:true,
                    hasBeenBottom:false
                },()=>{
                    get(`${API}/index/${this.state.classifyPage}?pageNumber=${this.state.pageNumber}`).then(res=>{
                        return res.json()
                    }).then(data=>{
                        if(data.result){
                            console.log(this.state.goodsItemInfo.data);
                            if(this.state.goodsItemInfo.data){
                                this.state.goodsItemInfo.data=this.state.goodsItemInfo.data.concat(data.data);
                                this.setState({
                                    loagingPage:false,
                                    hasBeenBottom:true
                                });
                            }
                        }else{
                            this.setState({
                                haveData:data,
                                loagingPage:false
                            })

                        }

                    })

                })
            }
        }
    };
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
        sessionStorage.setItem('lastPage','index');
    }
    render(){
        return(
            <div className="recommend">
                {this.state.bannerLoading?
                    <div className="home-loading"><Loading/></div>
                    :
                    this.state.banner.result === true?
                    <CarouselComponent className="banner" picPath={this.state.banner.data}/>
                        :
                        <div className="no-banner">
                            banner走丢了~~
                        </div>
                }
                <div className="recommend-wrapper" onScroll={this.scroll}>
                    {
                        this.state.isLoading?
                            <div className="list-loading">加载中……</div>
                            :
                            this.state.goodsItemInfo.result?
                                this.state.goodsItemInfo.data.map((item,index)=>{
                                    return(
                                        <GoodItem itemInfo={item} key={index} groupId={this.state.groupId}/>
                                    )
                                })
                                :
                                <div className="home-msg">{this.state.goodsItemInfo.msg}</div>
                    }
                </div>
                {/*页面拉到底部显示loading*/}
                {this.state.haveData.result?this.state.loagingPage? <div className="bottom-loading"><Loading className="loading-page"/></div> :"":<div className="home-no-data">{this.state.haveData.msg}</div>}

            </div>
        )
    }
}
export default Recommend
