/**
 * Created by web前端 on 2017/9/26.
 */
import React,{ Component } from 'react';
import './Evaluate.less';
import { Upload, Icon, Modal } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router'
import GoodPayItem from '../../components/GoodPayItem/GoodPayItem';
import { API } from '../../constants/API';
import { openId } from '../../util/openId';

class Evaluate extends Component{
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        goodData:[],
        openId:openId(document.cookie),
        orderId:null,
    };
    componentDidMount(){
        let tempData = JSON.parse(sessionStorage.getItem('tempData'));
        let evauateData = JSON.parse(sessionStorage.getItem('evaluateData'));
        console.log(tempData);
        this.setState({
            goodData:tempData,
            orderId:evauateData.orderId
        });



    };
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => {
        this.setState({ fileList });
    };
    goBack=()=>{
        sessionStorage.removeItem('tempData');
    };
    submitEvaluate=()=>{
        let picList = [];
        this.state.fileList.map((item,index)=>{
            picList.push(item.response.resultData[0])
        });
        picList=picList.join(',')
        let evaluateData = {
            orderId:this.state.orderId,
            score:3,
            openid:this.state.openId,
            goodsId:this.state.goodData.goodsId,
            content:this.refs.evaluateContent.value,
            imgPaths:picList
        };
        console.log(evaluateData)
        fetch(`${API}/memeber/comment`,{
            method:'POST',
            body:JSON.stringify(evaluateData)
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            if(data.result){
                this.success()
            }else{
                this.error()
            }
        })

    };
    success=()=>{
        Modal.success({
            title: '评论成功~~',
            content: '再继续逛逛吧~~',
            okText:"确定",
            onOk(){
                window.location.href="http://test.baobaofarm.com/#/membercenter/myorderform/0"
            }
        });
    };
    error=()=>{
        Modal.error({
            title: '评论失败。。',
            content: '请重新评论',
            okText:"确定"
        });
    };
    componentDidUpdate(){
        sessionStorage.setItem('tempData',JSON.stringify(this.state.goodData))
    };
    componentWillUnmount(){
        //sessionStorage.removeItem('tempData');
    }
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        return (
            <div className="clearfix evaluate">
                <div className="evaluate-top" onClick={this.goBack.bind(this)}>
                    <Link to="/membercenter/evaluatelist" className="evaluate-go-back">
                        <Icon type="left"/>
                        <span>发表评价</span>
                    </Link>
                </div>

                <div className="evaluate-box">
                    <div className="evaluate-wrapper">
                        <div className="evaluate-good-item">
                            {
                                console.log(this.state.goodData)
                            }
                            {
                                this.state.goodData.length === 0?"":<GoodPayItem data={this.state.goodData}/>
                            }
                        </div>
                        <div className="evaluate-content">
                            <textarea type="text" className="evaluate-text" placeholder="说说您的感觉，分享给想买的他们吧" ref="evaluateContent"/>
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
                    </div>
                </div>
                <div className="evaluate-submit" onClick={this.submitEvaluate.bind(this)}>发布评论</div>
            </div>
        );
    }
};
const mapStateToProps=(state)=>{
   return {
        evaluateItem:state.evaluateGoodItem,
        singleGoodEvaluate:state.singleGoodEvaluate

   }
};
const mapDispatchToProps=(dispatch)=>{
    return {

    }
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Evaluate));