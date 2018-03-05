import React,{ Component } from 'react';
import './ShopSetting.less';
import {Link} from 'react-router-dom';
import { Upload, Icon, message } from 'antd';
import { API } from '../../constants/API'


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    const isBMP = file.type === 'image/bmp';
    if (!isJPG && !isGIF && !isPNG && !isBMP) {
        message.error('图片格式不正确!');
    }
    const isLt8M = file.size / 1024 / 1024 < 8;
    if (!isLt8M) {
        message.error('Image must smaller than 5MB!');
    }
    return (isJPG||isGIF||isPNG||isBMP) && isLt8M;
}


    class ShopSetting extends Component{
        state={
            divInner:"",
            userName:"",
            openId:"oYShxv-i28ctNbZjiFy3hI-KBp9k",
            noticeInformation:"",
            liked:false,
            liked1:false,
            backgroundImage:""
         };

        shopChange=(e)=>{
            let uName=e.target.value;
            this.setState({
                userName:uName
            })
        };

        noticeChange=(e)=>{
            let uNotice=e.target.value;
            this.setState({
                noticeInformation:uNotice
            })
        };

        shopFocus=()=>{
            this.setState({
                liked:false
            })
        };




    handleChange = (info) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
            this.setState({
                backgroundImage:info.file.response.resultData[0],
                divInner:"",
                liked:false
            });
            // Get this url from response in real world.



        }
    };

        confirmSubmit=()=>{
            if(this.state.userName===""){
                console.log(this.state.userName);
                this.setState({
                    divInner:"小店名称不能为空",
                    liked:true
                });
                return
            }else if(this.state.backgroundImage===""){
                this.setState({
                    divInner:"小店头像不能为空",
                    liked:true
                })
            }else{
                this.setState({
                    userInformation:{
                        openid:this.state.openId,
                        shopName:this.state.userName,
                        notice:this.state.noticeInformation,
                        shopLogo:this.state.backgroundImage
                    }
                },()=>{
                    console.log(this.state.userInformation);
                    fetch(`${API}/memeber/shop`,{
                        method:"POST",
                        body:JSON.stringify(this.state.userInformation)
                    }).then(res=>{
                        return res.json()
                    }).then(data=>{
                        console.log(data);
                        if(data.result===true){
                            setTimeout(()=>{
                                this.setState({
                                    liked1:true
                                })
                            },1000);
                            setTimeout(()=>{
                                this.setState({
                                    liked1:false
                                })
                            },2000);
                        }else{
                           return null
                        }
                    })
                })
            }
        };


    render(){
        {
            const text=this.state.liked?"block":"none";
            const text1=this.state.liked1?"block":"none";
            const style1={
                display:text
            };
            const style2={
                display:text1
            };


            const imageUrl = this.state.imageUrl;
            return(
                <div className="shop-setting">

                    <div className="shop-setting-head">
                        <div className="shop-setting-head-inner">

                            <Link to="/membercenter/myshop" >
                                <Icon type="left" />
                            </Link>
                            <div className="shop-setting-head-content">小店设置</div>
                        </div>
                    </div>

                    <div className="shop-setting-body">

                        <div className="shop-setting-inner">
                            <div className="shop-setting-txt">
                                <span className="shop-setting-span">小店名称</span>
                                <input type="text" className="shop-setting-inp" onFocus={this.shopFocus.bind(this)} onChange={this.shopChange.bind(this)}/>
                            </div>
                        </div>

                        <div className="shop-setting-inner">
                            <div className="shop-setting-txt">
                                <span className="shop-setting-span">店铺公告</span>
                                <input type="text" className="shop-setting-inp" onChange={this.noticeChange.bind(this)}/>
                            </div>
                        </div>

                        <div className="shop-setting-image">
                            <div className="shop-setting-image-txt">
                                <span className="shop-setting-image-span">小店头像</span>
                                <div className="shop-setting-image-div">

                                    <Upload
                                        className="avatar-uploader"
                                        name="avatar"
                                        showUploadList={false}
                                        action={`${API}/upload/uploadImg`}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange}
                                    >
                                        {
                                            imageUrl ?
                                                <img src={imageUrl} alt="" className="shop-setting-image-avatar" /> :
                                                <Icon type="plus" className="avatar-uploader-trigger" />
                                        }
                                    </Upload>
                                </div>
                            </div>
                        </div>
                        <div className="clearDiv" style={style1}>{this.state.divInner}</div>
                    </div>

                    <div className="shop-setting-foot">
                        <div className="shop-setting-foot-inner">
                            <div className="successDiv" style={style2}>设置成功!</div>
                            <button onClick={this.confirmSubmit.bind(this)}>确认</button>
                        </div>
                    </div>

                </div>
            )
        }
    }
}
export default ShopSetting