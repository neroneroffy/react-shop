/**
 * Created by web前端 on 2017/9/29.
 */
import React,{ Component } from 'react';
import { Icon,Modal,Radio,Upload } from 'antd';
import './Drawback.less';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GoodPayItem from "../../components/GoodPayItem/GoodPayItem";
import { API } from '../../constants/API';
import { openId } from '../../util/openId';
//const userOpenId = JSON.parse(openId(document.cookie));
class Drawback extends Component{
    state={
        orderData:[],
        drawBackReason:false,
        value: "太贵了",
        reason:'',
        modalKey:1,
        totalPrice:0,
        drawExplain:"",
        previewVisible:false,
        previewImage:"",
        fileList: [],
        isSubmitComplete:false,
        isFail:false,
        openId:openId(document.cookie),
    };
    componentWillMount(){
        this.setState({
            orderData:JSON.parse(sessionStorage.getItem('drawbackOrder'))
        },()=>{
            console.log(this.state.orderData)
            let price = 0;
            this.state.orderData.data.map((item,index)=>{
                price+=item.price*item.total
            });

        })
    }

    handleOk=()=>{
        this.setState({
            drawBackReason:false,
        })
    };
    handleCancel=()=>{
        this.setState({
            drawBackReason:false,
        })

    };
    selectDrawBackReason=()=>{
        this.setState({
            drawBackReason:true,
            modalKey:this.state.modalKey+1,
            value: "太贵了",
            reason:''
        })
    };
    //选择退款原因
    onChange = (e) => {
        this.setState({
            value: e.target.value,
            reason: e.target.value
        });
    };
    record=(e)=>{
        this.setState({
            reason:`其他原因：${e.target.value}`
        })
    };

    goBack=()=>{
        window.history.back();
        sessionStorage.removeItem('drawbackOrder');
    };
    //退款说明
    recordExplain=(e)=>{
        this.setState({
            drawExplain:e.target.value
        })
    };
    //处理上传图片
    handlePreview = (file) => {
        console.log(file)
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handleChange = ({ fileList }) => {
        this.setState({ fileList });

    };
    //点击提交
    submitDrawback = ()=>{
        let picList = [];
        console.log(this.state.fileList);
        this.state.fileList.map((item,index)=>{
            picList.push(item.response.resultData[0])
        });
/*
        console.log(this.state.fileList)
        this.state.fileList.map((item,index)=>{
            picList.push(item.response.resultData[0])
        });
*/

        let drawbackData={
            openid:this.state.openId,
            orderId:this.state.orderData.orderId,
            summary:this.state.reason,
            //remark:this.state.drawExplain,
            refundmage:picList.join(',')
        };
        console.log(drawbackData)
        this.setState({
            isSubmitComplete:true,
            isFail:true
        });
            fetch(`${API}/refund/order`,{
                method:'POST',
                body:JSON.stringify(drawbackData)
            }).then(res=>{
                    return res.json()
                }).then( data=>{
                    console.log(data)
                    if(data.result){
                        this.setState({
                            isSubmitComplete:true,
                            isFail:false
                        })
                    }else{
                        this.setState({
                            isSubmitComplete:true,
                            isFail:true
                        })
                    }
                    window.setTimeout(()=>{
                        this.setState({
                            isSubmitComplete:false,
                            isFail:false
                        },()=>{
                            window.location.hash = '/membercenter/myorderform'
                        })
                    },500);
                });
        console.log(drawbackData)
    };

    render(){
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { previewVisible, previewImage, fileList } = this.state;
        return (
            <div className="drawback">
                <div className="drawback-top">
                    <div className="drawback-go-back" onClick={this.goBack.bind(this)}>
                        <Icon type="left"/>
                        <span>申请退款</span>
                    </div>
                </div>
                <div className="drawback-content">
                    <div className="drawback-content-order">
                        {
                            this.state.orderData.data.map((item,index)=>{
                                return (
                                    <GoodPayItem data={item} key={index}/>
                                )
                            })
                        }
                    </div>
                    <div className="drawback-reason" onClick={this.selectDrawBackReason.bind(this)}>
                        <span>申请退款原因</span>
                        <div className="drawback-reason-right">
                            <div>{this.state.reason}</div>
                            <Icon type="right"/>
                        </div>
                    </div>
                    <div className="drawback-money" >
                        <span>退款金额: </span>
                        <span> ¥{this.state.orderData.orderPrice}</span>
                    </div>
                    <div className="drawback-money-explain">
                        退款 ¥{this.state.orderData.orderPrice}，含发货邮费 ¥{this.state.orderData.expressProce}元
                    </div>
                    <div className="drawback-explain">
                        <span>退款说明: </span>
                        <input placeholder="选填" onChange={this.recordExplain.bind(this)} value={this.state.drawExplain}/>
                    </div>
                    <div className="drawback-upload-evidence">
                        <span>上传凭证</span>
                        <div className="evaluate-pic">
                            <Upload
                                action={`${API}/upload/uploadImg`}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                            >
                                {this.state.fileList.length >= 5 ? null
                                    :
                                    <div className="upload-text">
                                        <Icon type="camera-o" />
                                        <div className="ant-upload-text">添加图片</div>
                                    </div>}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage}/>
                            </Modal>
                        </div>
                    </div>
                    <div className="drawback-submit" onClick={this.submitDrawback.bind(this)}>
                        提交审核
                    </div>

                </div>
                <ReactCSSTransitionGroup
                    transitionName="drawback-tip-modal"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {this.state.isSubmitComplete?
                        <div className="drawback-submit-success">

                            <div>
                                <Icon type={ this.state.isFail?"frown-o":"smile-o" } />
                                <div>{this.state.isFail?"提交失败":"提交成功"}</div>
                            </div>
                        </div>
                        :null
                    }
                </ReactCSSTransitionGroup>

                <Modal
                    title="申请退款原因"
                    visible={this.state.drawBackReason}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    style={{width:"200px"}}
                    key={this.state.modalKey}
                >
                    <div className="drawback-radio">
                        <Radio.Group onChange={this.onChange} value={this.state.value}>
                            <Radio style={radioStyle} value={"太贵了"}>太贵了</Radio>
                            <Radio style={radioStyle} value={"信息有误"}>信息有误</Radio>
                            <Radio style={radioStyle} value={"想买别的"}>想买别的</Radio>
                            <Radio style={radioStyle} value={"其他原因"}>
                                其他原因
                                <div>
                                    {this.state.value === "其他原因" ? <textarea className="drawback-other-reason" style={{ width: 100, marginLeft: 10 }} onChange={this.record.bind(this)}/> : null}
                                </div>
                            </Radio>
                        </Radio.Group>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default Drawback