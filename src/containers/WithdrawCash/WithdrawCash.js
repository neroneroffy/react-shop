import React,{ Component } from 'react';
import './WithdrawCash.less';
import {Link} from 'react-router-dom';
import { Icon } from 'antd';
import {API} from '../../constants/API';

class WithdrawCash extends Component{
    state={
        withdrawMethod:[
            {
                name:"提现到余额",
                isSelected:true
            },{
                name:"提现到微信钱包",
                isSelected:false
            }
        ],
        openId:"oYShxv-i28ctNbZjiFy3hI-KBp9k",
        withdrawNum:"",
        submitWithdraw:[],
        withdrawIndex:1,
        canUseMoney:200
    };

    inputSelected=(index)=>{
        //console.log(index)
      this.setState({
          withdrawIndex:index+1
      },()=>{
          this.state.withdrawMethod.map((item,index)=>{
              item.isSelected=false;
              this.setState(this.state)
          });
          this.state.withdrawMethod[index].isSelected=true
      })
    };

    changeWithdraw=()=>{
        this.setState({
            withdrawNum:this.refs.withdrawInput.value
        })
    };

    ensureWithdraw=()=>{
        let reg=/^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/;
        if(this.state.withdrawNum<=this.state.canUseMoney){
            if(reg.test(this.state.withdrawNum)==true){
                this.setState({
                    submitWithdraw:{
                        openid:this.state.openId,
                        mode:this.state.withdrawIndex,
                        withdrawNum:this.refs.withdrawInput.value
                    }
                },()=>{
                    console.log(this.state.submitWithdraw);
                    fetch(`${API}/withdrawapply/add`,{
                        method:"POST",
                        body:JSON.stringify(this.state.submitWithdraw)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        if(data.result==true){
                            window.location.pathname="/membercenter/withdrawresult"
                        }else{
                            return null
                        }
                    })
                })
            }
        }else{
            return null
        }
    };

    withdrawAll=()=>{
        this.refs.withdrawInput.value=this.state.canUseMoney;
        this.setState({
            withdrawNum:this.refs.withdrawInput.value
        })
    };




    render(){
       return (
           <div className="withdraw-cash">

                <div className="withdraw-cash-head">
                    <div className="withdraw-cash-inner">
                        <Link to="/membercenter/myShop">
                            <Icon type="left"/>
                            <span className="withdraw-cash-content">
                                提现
                            </span>
                        </Link>
                    </div>
                </div>

               <div className="withdraw-cash-body">
                    <div className="withdraw-cash-body-inner">
                        {
                            this.state.withdrawMethod.map((item,index)=>{
                                return(
                                    <div className="withdraw-cash-body-txt" key={index}>
                                        <div onClick={this.inputSelected.bind(this,index)} className={item.isSelected?"withdraw-cash-body-div withdraw-cash-body-div-checked":"withdraw-cash-body-div"}></div>
                                        <span>{item.name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
               </div>

               <div className="withdraw-cash-foot">
                   <div className="withdraw-cash-foot-inner">

                       <div className="withdraw-cash-foot-cash">
                           <div className="withdraw-cash-foot-txt">提现金额</div>
                       </div>
                       <div className="withdraw-cash-foot-input">
                           <span>￥</span>
                           <input type="text" ref="withdrawInput" onChange={this.changeWithdraw}/>
                       </div>
                       <div className="withdraw-cash-foot-context">
                           <div className="withdraw-cash-foot-residue">
                               {
                                   this.state.withdrawNum<= this.state.canUseMoney?
                                       <div>可用余额 <span>{this.state.canUseMoney}</span>元</div>
                                       :
                                       <div className="withdraw-cash-foot-red">金额已超过可提现金额</div>
                               }
                           </div>
                           <div className="withdraw-cash-foot-all" onClick={this.withdrawAll}>全部提现</div>
                       </div>
                   </div>
               </div>

               <div onClick={this.ensureWithdraw} className={this.state.withdrawNum>0?"withdraw-cash-green":"withdraw-cash-btn"}>确认提现</div>

           </div>
       )
    }
}
export default WithdrawCash