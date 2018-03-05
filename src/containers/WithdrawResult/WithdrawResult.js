import React,{ Component } from 'react';
import './WithdrawResult.less';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

class WithdrawResult extends Component{
    state={
        //withdrawData:[],
        //openid:"oYShxv-i28ctNbZjiFy3hI-KBp9k"
    };
    componentDidMount(){
        /*
        *   post(`${API}/withdrawapply/list/${this.state.openid}`).then(res=>{
            return res.json()
        }).then(data=>{
            console.log(data);
            this.setState({

            })
        })
        * */

    }
    render(){
        return(
            <div className="withdraw-result">

                <div className="withdraw-result-head">
                    <div className="withdraw-result-div">
                        <Link to="/membercenter/WithdrawDetail">
                            查看申请记录
                        </Link>
                    </div>
                </div>

                <div className="withdraw-result-body">
                    <div className="withdraw-result-inner">
                        <Icon type="check-circle-o"/>
                        <span>申请成功</span>
                    </div>
                </div>

            </div>
        )
    }
}
export default WithdrawResult;