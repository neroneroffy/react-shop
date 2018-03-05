/**
 * Created by web前端 on 2017/11/6.
 */
import React,{ Component } from 'react';
import { get } from '../../fetch/get';
import { openId } from '../../util/openId';
import { API } from '../../constants/API';
import Loading from '../../components/Loading/Loading';
import { Icon } from 'antd'
import { Link } from 'react-router-dom';
import './Agency.less';
class Agency extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:null,
            openId : openId(document.cookie),
            userData:JSON.parse(localStorage.getItem('userData'))
        }
    }
    componentDidMount(){
        get(`${API}/openId=${this.state.openId}`).then(res=>{
            return res.json()
        }).then(data=>{
            this.setState({
                //data:data.data
            })
        });
        console.log(this.state.userData)

    }
    render(){
        return (
            <div className="agency">
                {
                    this.state.data !== null?
                        <div className="agency-loading">
                            <Loading/>
                        </div>
                        :
                        <div>
                            <div className="agency-header">
                                <Link to='/membercenter' className = 'agency-back'>
                                    <Icon type="left" />
                                </Link>
                                <div className="angecy-avatar">
                                    <img src={this.state.userData.photo} alt=""/>
                                </div>
                                <div className="agency-user-name">
                                    <div>
                             <span>
                                {this.state.userData.nickName}
                            </span>
                                        <span>
                                 二级
                            </span>
                                    </div>
                                </div>
                                <div className="agency-discount">
                                    享受9折优惠
                                </div>
                            </div>
                            <div className="agency-content">
                                <Link to="/membercenter/ordergoodsrecord" className="agency-item"><span>订货记录</span><Icon type="right" /></Link>
                                <Link to="/membercenter/sourcelist" className="agency-item"><span>货源列表</span><Icon type="right" /></Link>
                                <Link to="/membercenter/sourceshopcart" className="agency-item"><span>购物车</span><Icon type="right" /></Link>
                            </div>
                        </div>

                }
            </div>
        )
    }
}
export default Agency;