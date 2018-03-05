import React,{ Component } from 'react';
import './MyCollect.less';
import { get } from "../../fetch/get";
import {Link} from 'react-router-dom';
import { Icon,Modal  } from 'antd';
import Tabbar from '../../components/Tabbar/Tabbar';
import {API} from '../../constants/API';
import { openId } from '../../util/openId';
class MyCollect extends Component{
    state={
        collectData:[],
        tipModal:false,
        delData:[],
        delDataTow:[],
        openId:openId(document.cookie)
    };
    componentDidMount(){
        get(`${API}/member/collection/list/${this.state.openId}`).then(function(res){
            return res.json()
        }).then(data=>{
            console.log(data);
            if(!data.result){
                this.setState({
                    collectData:[]
                })
            }else{
                this.setState({
                    collectData:data.data
                },()=>{
                    console.log(this.state.collectData)
                })

            }
        })
    };
    //点击单选删除按钮
    isCollect=(index)=>{
        //console.log(this.state.collectData[index].id);

        this.setState({
            tipModal:true,
            delData:[]
        },()=>{
            this.state.delData.push(this.state.collectData[index].id);
            console.log(typeof(this.state.delData))
        })
    };
    //点击复选框
    handleSelect=(index)=>{
        let selectedBox = document.getElementsByClassName('select-box');
        if(this.state.delDataTow.indexOf(this.state.collectData[index].id)<0){
            this.state.delDataTow.push(this.state.collectData[index].id);
            selectedBox[index].className="select-box select-box-active"
            //this.setState(this.state)
        }else{
            this.state.delDataTow.splice(this.state.delDataTow.indexOf(this.state.collectData[index].id),1);
            selectedBox[index].className="select-box"
            //this.setState(this.state)
        }
        /*数组状态*/
        console.log(this.state.delDataTow)
    };

    handleCancel=()=>{
        this.setState({
            tipModal:false
        },()=>{
            console.log(this.state.delData)
        })
    };

    handleOk=()=>{
        /*单选框传参
        post("/api",this.state.delData);*/

        let deleteData=this.state.delData.join(',');
        console.log(this.state.delData);
        get(`${API}/member/collection/del/${deleteData}`).then( res=>{
            return res.json()
        }).then( data=>{
            console.log(data);
            if(data.result){
                let selectedBox = document.getElementsByClassName('select-box');
                for(let i = 0;i<selectedBox.length;i++){
                    selectedBox[i].className = 'select-box'
                }

                this.setState({
                    collectData:data.data,
                    tipModal:false,
                    delDataTow:[]
                })
            }else{
                this.setState({
                    collectData:[],
                    tipModal:false,
                    delDataTow:[]
                })

            }
        });

    };

    /*复选框传参*/
    handleDelete=()=>{
       let deleteData=this.state.delDataTow.join(",");
       console.log(deleteData);
       if(deleteData!==""){
           get(`${API}/member/collection/del/${deleteData}`).then(res=>{
               return res.json();
           }).then(data=>{
               console.log(data);
               if(data.result){
                   let selectedBox = document.getElementsByClassName('select-box');
                   for(let i = 0;i<selectedBox.length;i++){
                       selectedBox[i].className = 'select-box'
                   }
                   this.setState({
                       collectData:data.data,
                       delDataTow:[]
                   })
               }else{
                   this.setState({
                       collectData:[],
                       delDataTow:[]
                   })
               }
           })
       }
    };




    render(){
        return (
            <div className="myCollect">

                        :
                        <div className="collectContent">
                            <div className="my-coollect-headC my-coollect-head">
                                <div className="my-collect-head-inner">
                                    <Link to="/membercenter" >
                                        <Icon type="left" />
                                        <div className="my-collect-head-contents">我的收藏({this.state.collectData.length})</div>
                                    </Link>
                                    <input  type="button" value="删除" className="btn"  onClick={this.handleDelete}/>
                                </div>
                            </div>
                            {
                                this.state.collectData.length === 0?
                                    <div className="collectNull">
                                        <p >您没有浏览过任何商品</p>
                                        <p >主人快去给我找点东西吧</p>
                                    </div>
                                    :
                                    <div className="my-Collect">
                                        {
                                            this.state.collectData.map((item,index)=>{
                                                return (
                                                    <div className="my-collect-body" key={index}>
                                                        <div key={index} className="my-collect-body-content">
                                                            <div className="my-collect-body-left">
                                                                {/*<input type="checkbox"  onClick={this.handleSelect.bind(this,index)}/>*/}
                                                                {
                                                                    console.log(this.state.delDataTow.indexOf(item.id))
                                                                }
                                                                <div className="select-box " onClick={this.handleSelect.bind(this,index)}></div>
                                                            </div>

                                                            <Link to={'/detail/'+item.goodsId} className="my-collect-body-center">
                                                                <div className="my-collect-body-pic">
                                                                    <img src={item.listImage} alt=""/>
                                                                </div>
                                                                <div>
                                                                    <div>{item.goodsName}</div>
                                                                    <span className="my-collect-body-pricenew">¥{item.price.toFixed(2)}</span>
                                                                </div>
                                                            </Link>
                                                            <div className="my-collect-body-right">
                                                                <Icon type="close"  onClick={this.isCollect.bind(this,index)}/>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            }

                        </div>

                <Modal
                    visible={this.state.tipModal}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    style={{top:180}}
                >
                    <div className="my-info-area-drop">
                        <p>确认从我的收藏删除这些商品?</p>
                    </div>
                </Modal>
                <Tabbar id="tabbar"/>


            </div>
        )
    }
}

export default MyCollect;




