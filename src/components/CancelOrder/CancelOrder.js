/**
 * Created by web前端 on 2017/9/29.
 */
import React,{ Component } from 'react';
import { Modal,Tag,Icon } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './CancelOrder.less';
import { API } from '../../constants/API';
class CancelOrder extends Component{
    state={
        confirmLoading:false,
        cancelOrder:false,
        newModal:0,
        cancelReason:["拍错了","不想买了","信息有误"],
        newCancelReason:["拍错了","不想买了","信息有误"],
        selectedTags:[],
        cancelReasons:[],
        orderId:this.props.cancelOrderId,
        isSubmitComplete:false
    };
    componentWillReceiveProps(nextProps){
        if(this.props!=nextProps){

            this.setState({
                orderId:nextProps.cancelOrderId
            })
        }
    }
    cancelMyOrder=()=>{

        this.setState({
            cancelOrder:true,
            confirmLoading: false
        })
    };

    handleSubmit=()=>{
        let myCancelReason = this.refs.myCancelReason.value;
        this.state.cancelReasons.push(myCancelReason);
        this.setState(this.state.cancelReasons);
        this.setState({
            newModal:this.state.newModal+1,
            confirmLoading: true
        });
        let cancelData={
            cancelReasons:this.state.cancelReasons.join(','),
            id:this.state.orderId
        };

        fetch(`${API}/order/cancel`,{
            method:'POST',
            body:JSON.stringify(cancelData)
        }).then(res=>{
            return res.json()
        }).then(data=>{
            if(data.result){
                this.setState({
                    confirmLoading: true,
                    isSubmitComplete:true
                },()=>{
                    window.setTimeout(()=>{
                        this.setState({
                            isSubmitComplete:false
                        },()=>{
                            window.location.reload()
                            //window.location.href=window.location.href+123*Math.random();
                        })
                    },1000)
                })
            }
        });
        this.setState({
            cancelOrder:false,
            newModal:this.state.newModal+1,
            cancelReason:["拍错了","不想买了","信息有误"],
            selectedTags:[],
            cancelReasons:[]
        });


    };
    cancelSubmit=()=>{
        this.setState({
            newModal:this.state.newModal+1,
            cancelOrder:false,
            cancelReason:["拍错了","不想买了","信息有误"],
            selectedTags:[],
            cancelReasons:[]
        })
    };

    selectTag=(index)=>{
        //点击标签，把点选的标签push进已选标签数组
        this.state.selectedTags.push(this.state.cancelReason[index]);
        this.state.cancelReasons.push(this.state.cancelReason[index]);
        this.state.cancelReason.splice(index,1);
        this.setState(this.state)
    };
    delTag=(index)=>{
        this.state.cancelReason.push(this.state.selectedTags[index]);
        this.state.cancelReasons.splice(index,1);
        this.setState(this.state);
    };

    render(){
        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="drawback-tip-modal"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.isSubmitComplete?
                        <div className="drawback-submit-success">
                            <div>
                                <Icon type="smile-o" />
                                <div>"取消成功"</div>
                            </div>
                        </div>
                        :null
                    }
                </ReactCSSTransitionGroup>
                <Modal title="填写取消原因"
                       visible={this.state.cancelOrder}
                       onOk={this.handleSubmit}
                       confirmLoading={this.state.confirmLoading}
                       onCancel={this.cancelSubmit}
                       key={this.state.newModal}
                >

                    <div className="cancel-reason">

                        <div className="cancel-tags">
                            {
                                this.state.cancelReason.map((item,index)=>{
                                    return (
                                        <Tag key={index} color="#87d068" onClick={this.selectTag.bind(this,index)}>{item}</Tag>
                                    )
                                })
                            }
                        </div>
                        <div className="selected-tags">
                            <div className="my-tags">
                                {
                                    this.state.selectedTags.map((item,index)=>{
                                        return (
                                            <Tag closable onClose={this.delTag.bind(this,index)} key={index}>{item}</Tag>
                                        )
                                    })
                                }
                            </div>
                            <textarea type="text" className="custom-reason" ref="myCancelReason" placeholder="(选填)请写上您取消订单的原因"/>
                        </div>

                    </div>
                </Modal>

            </div>


        )
    }
};
export default CancelOrder