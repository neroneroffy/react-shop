/**
 * Created by web前端 on 2017/9/26.
 */
import React,{ Component } from 'react';
import { Icon,Timeline } from 'antd';
import { get } from '../../fetch/get';
import Loading from '../../components/Loading/Loading';
import './Logistics.less';
import { API } from '../../constants/API';
class Logistics extends Component{
    state={
        data:null,
        goodsInfo:""
    };
    componentDidMount(){
        console.log(this.props.match.params.id);
        get(`${API}/express/search/${this.props.match.params.id}`).then((res)=>{
            return res.json()
        }).then((data)=>{
            console.log(data);
            this.setState({
                data:data,
                goodsInfo:JSON.parse(sessionStorage.getItem('logisticsGoods'))
            })
        });
        document.body.scrollTop = 0;
    }
    goBack=()=>{
        window.history.back();
        sessionStorage.removeItem('drawbackOrder');
        sessionStorage.removeItem('logisticsGoods');
    };
    componentWillUnmount(){

        sessionStorage.removeItem('drawbackOrder');
        sessionStorage.removeItem('logisticsGoods');

    }
    render(){
        return (
            <div className="logistics">
                <div className="logistics-top">
                    <div className="logistics-go-back" onClick={this.goBack.bind(this)}>
                        <Icon type="left"/>
                        <span>物流详情</span>
                    </div>
                </div>
                {
                    this.state.data===null?
                        <div className="logistics-loading">
                            <Loading/>
                        </div>
                        :
                        this.state.data.result?
                            <div className="logistics-wrapper">
                                <div className="logistics-good-info">
                                    <div className="img">
                                        <img src={this.state.goodsInfo[0].listImage} alt="加载失败咯~"/>
                                        <div className="logistics-order-info">
                                            共{this.state.goodsInfo.length}件商品
                                        </div>
                                    </div>
                                    <div className="good-status">
                                        <div>
                                            物流状态 <span>{this.state.data.status===1?"待发货":"已发货"}</span>
                                        </div>
                                        <div>
                                            承运公司 <span>{this.state.data.status===1?"暂无":this.state.data.objData.shipperCode}</span>
                                        </div>
                                        <div>
                                            运单编号 <span>{this.state.data.status===1?"暂无":this.state.data.objData.logisticCode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="express-progress">
                                    <div className="express-status">
                                        物流状态
                                    </div>
                                    {
                                        this.state.data.objData.traces?
                                            <Timeline>
                                                {
                                                    this.state.data.objData.traces.map((item,index)=>{
                                                        return (
                                                            <Timeline.Item key={index} color={index === this.state.data.objData.traces.length-1?"#64a930":"#e4e4e4"}>
                                                                <p>{item.acceptStation}</p>
                                                                <p>{item.acceptTime}</p>
                                                            </Timeline.Item>
                                                        )
                                                    })
                                                }
                                            </Timeline>
                                            :
                                            <div className="logistics-no">
                                                {this.state.data.objData.reason}
                                            </div>

                                    }
                                </div>
                            </div>
                            :
                            <div>
                                暂无物流信息
                            </div>

                }
            </div>
        )
    }
};
export default Logistics;
