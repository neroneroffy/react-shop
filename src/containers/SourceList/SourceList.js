/**
 * Created by web前端 on 2017/11/7.
 */
import React,{Component} from 'react';
import './SourceList.less';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { get } from '../../fetch/get';
import Loading from '../../components/Loading/Loading';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
class SourceList extends Component{
    constructor(props){
        super(props);
        this.state={
            data:null,
            noData:false,
            pageNumber:1,
            isLoading:true,
            hasNoData:false,
            hasBeenBottom:true,
            cartNum:0,
            submitLoading:false,
            postToCart:[],
            openId:openId(document.cookie)
        }
    }
    componentDidMount(){
        get(`/mock/orderGoodsList${this.state.pageNumber}.json`).then(res=>{
            return res.json()
        }).then(data=>{

            if(data.result){
                this.setState({
                    data:data.data,
                    isLoading:false,
                })
            }else{
                this.setState({
                    noData:true,
                    isLoading:false,
                })
            }
        });
        window.addEventListener("scroll",this.onScroll);
    }
    onScroll=()=>{
        let scrollTop = document.body.scrollTop;
        let totalHeight = document.body.scrollHeight;
        let screenHeight = document.body.clientHeight;
        if(scrollTop+screenHeight === totalHeight){
            this.setState({
                pageNumber:this.state.pageNumber+1
            },()=>{
                if(this.state.hasBeenBottom){
                    this.setState({
                        hasBeenBottom:false,
                        loadingPage:true
                    },()=>{
                        get(`/mock/orderGoodsList${this.state.pageNumber}.json`).then((res)=>{
                            return res.json()
                        }).then(data=>{
                            this.setState({
                                loadingPage:false
                            },()=>{
                                if(data.result){
                                    this.state.data = this.state.data.concat(data.data);
                                    this.setState({
                                        hasBeenBottom:true
                                    })
                                }else{
                                    this.setState({
                                        hasNoData:true
                                    })
                                }

                            });
                        })
                    });


                }

            });

        }
    };
    selectThis =(index)=>{
        let sleectBtn = this.refs.sourceList.children[index].children[1].children[0].children[1];
        if(sleectBtn.className === "source-list-select"){
            sleectBtn.className = "source-list-select source-list-select-active";
            this.state.postToCart.push(this.state.data[index].id);
            this.setState(this.state)
       }else{
            sleectBtn.className = "source-list-select";
            this.state.postToCart.splice(this.state.postToCart.indexOf(this.state.data[index].id),1);
            this.setState(this.state)
        }
    };
    goToCart=()=>{
          let fetchData = {
              ids:this.state.postToCart.join(","),
              openId:this.state.openId
          };
        console.log(fetchData);
        window.location.hash = '/membercenter/sourceshopcart';
        fetch(`${API}/`,{
              method:"POST",
              body:fetchData
          }).then(res=>{
              return res.json()
          }).then(data=>{
              if(data.result){

              }
          })
    };
    render(){
        return (
            <div className="source-list">
                <div className="source-list-top">
                    <Link to="/membercenter/agency" className="source-list-top-inner">
                        <Icon type="left"/>
                        <span>货源列表</span>
                    </Link>
                </div>
                {
                    this.state.isLoading?
                        <div className="source-list-loading">
                            <Loading/>
                        </div>
                        :
                        this.state.noData?
                            <div>暂无数据</div>
                                :
                            <div className="source-list-wrapper" ref = "sourceList">

                                {
                                    this.state.data.map((item,index)=>{
                                        return (
                                            <div className="source-list-item" key={index} onClick={this.selectThis.bind(this,index)}>
                                                <div className="source-list-img">
                                                    <img src={item.photo}/>
                                                </div>
                                                <div className="source-list-goodinfo">
                                                    <div>
                                                        <div>
                                                            {item.goodName}
                                                        </div>
                                                        <div className="source-list-select"></div>
                                                    </div>
                                                    <div>售价：<span>¥{item.goodPrice}</span></div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    this.state.hasNoData?
                                        <div className="source-list-nodata">没有更多数据了</div>
                                        :
                                        ""
                                }
                                {
                                    this.state.loadingPage?
                                        <div className="source-list-loading-page">
                                            <Loading/>
                                        </div>
                                        :
                                        ""
                                }
                            </div>
                }
                <div className="source-list-cart-wrapper" onClick={this.goToCart.bind(this)}>
                    <div className="source-list-cart-num">{this.state.postToCart.length}</div>
                    <div className="source-list-cart">

                        <Icon type="shopping-cart" />
                    </div>
                </div>
                {
                    this.state.submitLoading?
                        <div className="submit-loading">
                            <div>
                                <Icon type="loading" />
                            </div>
                            <div>
                                跳转中……
                            </div>
                        </div>
                        :
                        ""
                }
            </div>
        )
    }
}
export default SourceList