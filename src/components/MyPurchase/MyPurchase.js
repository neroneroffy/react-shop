/**
 * Created by web前端 on 2017/8/10.
 */
import React,{Component} from 'react';
import { Link } from'react-router-dom'
import { Icon } from 'antd';
import { connect } from 'react-redux';
import './MyPurchase.less';
class MyPurchare extends Component{
    state={
        myPurchareSpecies:[
            {
                title:'未付款',
                iconType:'credit-card',
                id:1
            },
            {
                title:'待收货',
                iconType:'schedule',
                id:3
            },
            {
                title:'已完成',
                iconType:'check-circle-o',
                id:50
            },
            {
                title:'退款',
                iconType:'message',
                linkTo:"/membercenter/refund"
            },
        ]
    };
    componentWillUnmount(){
        this.props.fatherMark()
    }
    render (){
        return(
            <div className="my-purchase">
                <div className="my-purchase-wrapper">
                    <Link to='/membercenter/myorderform'>
                        <div className="title clearfix">
                            <h1 className="title-name">我的订单</h1>
                            <Icon className="title-icon" type="right" />
                        </div>

                    </Link>
                    <div className="my-purchase-species">
                        {
                            this.state.myPurchareSpecies.map((item,index)=>{
                                return (
                                    <Link to={item.title==="退款"?item.linkTo:"/membercenter/myorderform/"+item.id} className="purchase-item" key={index} >
                                        <div className="species-icon"><Icon type={item.iconType}/></div>
                                        <div className="species-txt">{item.title}</div>
                                    </Link>
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    return state
};
const mapDispatchToProps=(dispatch)=>{
    return {
        fatherMark(){
            dispatch({
                type:"FATHER_MARK"
            })
        }
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(MyPurchare)