/**
 * Created by web前端 on 2017/9/27.
 */
import React,{ Component } from 'react';
import './EvaluateList.less';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import GoodPayItem from '../../components/GoodPayItem/GoodPayItem';
class EvaluateList extends Component{
    state={
        goodList:[]
    };
    componentDidMount(){
        let evaluateData = JSON.parse(sessionStorage.getItem('evaluateData'));
            this.setState({
                goodList:evaluateData
            },()=>{
                console.log(this.state.goodList)
            })
    }
    componentDidUpdate(){
        sessionStorage.setItem("goBackKey",0);
        sessionStorage.setItem('evaluateData',JSON.stringify(this.state.goodList));
    }
    clearData(){
        //sessionStorage.clear();

    }

    whichItem=(index)=>{
        //this.props.singleGood(this.state.goodList[index])
        sessionStorage.setItem('tempData',JSON.stringify(this.state.goodList.data[index]))
    };
    render(){
        return (
            <div className="good-evaluate">
                <div className="good-evaluate-top">
                    <Link to={"/membercenter/myorderform/"+sessionStorage.getItem('goBackKey')} className="good-evaluate-goback" onClick={this.clearData.bind(this)}>
                        <Icon type="left"/>
                        <span>评价商品</span>
                    </Link>
                </div>
                <div className="good-evaluate-wrapper">
                    <div className="good-evaluate-item">
                        {
                            this.state.goodList.data?
                                this.state.goodList.data.map((item,index)=>{
                                    return (
                                            <GoodPayItem data={item} key={index} isEvaluate={true} onClick={this.whichItem.bind(this,index)}/>
                                        )
                                })
                                :
                                ""
                        }
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return {
        goodList:state.evaluateGoodItem,
        goBackKey:state.orderKey
    }
};
const mapDispatchToProps=(dispatch)=>{
    return {
        singleGood(data){
            dispatch({
                type:"SINGLE_GOOD_EVALUATE",
                data:data
            })
        }
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(EvaluateList);