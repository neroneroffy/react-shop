import React,{ Component } from 'react';
import './CheckResult.less';
import {Link} from 'react-router-dom';
import { Icon,Button } from 'antd';
import { API } from '../../constants/API';
import { get } from '../../fetch/get';
import { openId } from '../../util/openId';
class CheckResult extends Component{
    state={
        userData:{},
        openId:openId(document.cookie),
        submitLoading:false
    };
    componentWillMount(){
        this.setState({
            userData:JSON.parse(localStorage.getItem("userData"))
        })
    }
    reApply=()=>{
        this.setState({
            submitLoading:true
        });
        get(`${API}/memberFarmerStaus/${this.state.openId}`).then(res=>{
            return res.json()
        }).then(data=>{
            if(data.result){
                this.setState({
                    submitLoading:false
                },()=>{
                    window.location.hash = '#/membercenter/becomefarmer'
                });


            }
        })
    };
    render(){
        return(
            <div className="review-body">
                {
                    this.state.userData.status==3?
                        <div  className="under-review-body">
                            <div className="under-review-body-inner">
                                <Icon type="check-circle-o" />
                                <span>审核成功</span>
                            </div>
                            <Link to="/membercenter/myshop"  className="back-to-index">
                                <Button>进入我的小店</Button>
                            </Link>
                        </div>
                        :
                        this.state.userData.status==2?
                                <div  className="under-review-body">
                                    <div className="under-review-body-inner">
                                        <Icon type="clock-circle-o" />
                                        <span>审核中...</span>
                                        <div>
                                            请您耐心等待哦~
                                        </div>
                                    </div>
                                    <Link to="/index" className="back-to-index">
                                        <Button>返回商城首页</Button>
                                    </Link>

                                </div>
                            :
                            this.state.userData.status==4?
                                <div  className="under-review-body">
                                    <div className="under-review-body-inner">
                                        <Icon type="close-circle-o" />
                                        <span>审核失败</span>
                                    </div>
                                    <div className="check-opreation">
                                        <Link to="/index" className="back-to-index">
                                            <Button>返回首页</Button>
                                        </Link>
                                        <div className="back-to-index" onClick={this.reApply.bind(this)}>
                                            <Button>重新申请</Button>
                                        </div>

                                    </div>

                                </div>
                                :
                                ""

                }
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

export default CheckResult