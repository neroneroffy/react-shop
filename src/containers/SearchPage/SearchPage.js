/**
 * Created by web前端 on 2017/8/31.
 */
import React,{ Component } from 'react';
import { Icon } from 'antd';
import Loading from '../../components/Loading/Loading'
import GoodsItem from '../../components/GoodsItem/GoodsItem';
import './SearchPage.less';
import {API} from '../../constants/API';

class SearchPage extends Component{
    state={
        searchReturn:null,
        isLoading:false
    };

    search=()=>{
        this.setState({
            isLoading:true
        });
        let searchData = {
            word:this.refs.keyWords.value
        };
        console.log(searchData);
        fetch(`${API}/search/goods`,{
            method:"POST",
            body:JSON.stringify(searchData)
        }).then(res=>{
            console.log(res)
            return res.json()
        }).then(data=>{
            console.log(data);
            if(data.result){
                this.setState({
                    isLoading:false,
                    searchReturn:data
                })
            }else{
                this.setState({
                    isLoading:false,
                    searchReturn:data
                })
            }
        });
    };

    render(){
        return (
            <div className="search-page">
                <div className="search-top">
                    <div className="search-input-wrapper">
                        <input type="text"  className="search-input" ref="keyWords" placeholder="请输入关键字"/>
                        <Icon type="search" className="to-search" onClick={this.search.bind(this)}/>
                    </div>
                </div>

                    {
                       this.state.searchReturn===null?
                           ""
                           :
                               !this.state.isLoading?
                                   <div className="search-result-loading">
                                       <Loading className = "search-loading"/>
                                   </div>
                                   :
                                   this.state.searchReturn.result?
                                       <div className="search-result ">
                                           {
                                               this.state.searchReturn.data.map((item,index)=>{
                                                   return(
                                                       <GoodsItem itemInfo = {item} key = {index}/>
                                                   )
                                               })

                                           }
                                       </div>
                                       :
                                       <div className='search-result-prompt'>没有结果</div>
                    }


            </div>
        )
    }
}
export default SearchPage;
