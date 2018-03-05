/**
 * Created by web前端 on 2017/8/23.
 */
import React,{Component} from "react";
import { Carousel,Modal } from "antd";
import './CommonItem.less'
class CommentItem extends Component{
    state={
        commentData:this.props.commentItemData,
        filterCommentData:this.props.commentItemData,
        showBigPic:false,
        bigPics:[],
        picModalKye:0
    };

    componentWillReceiveProps(nextProps){

        if(nextProps.commentItemData!=this.props.commentItemData){
            this.setState({
                filterCommentData:nextProps.commentItemData
            })
        }

    }
/*    showPicComment=()=>{
        let picComment = [];
        this.state.commentData.forEach((item,index)=>{
            if(item.commentPic.length!=0){
                picComment.push(item)
            }

        });
        this.setState({
            filterCommentData : picComment
        })
    };*/
/*    showAllComment=()=>{
        this.setState({
            filterCommentData : this.state.commentData
        })

    };*/
    showBigPic=(index,event)=>{

        let bigPicList = [];
        for(let i=0;i<event.target.parentNode.parentNode.childNodes.length;i++){
            bigPicList.push(event.target.parentNode.parentNode.childNodes[i].childNodes[0].src)
        }
/*
        console.log(event.target.parentNode.parentNode.childNodes);
        event.target.parentNode.parentNode.childNodes.map((item,index)=>{
            bigPicList.push(item.childNodes[0].src)
        });
*/


        this.setState({
            showBigPic:true,
            bigPics:bigPicList,
            picModalKye:this.state.picModalKye+1
        },()=>{
            this.refs.swipeBigPic.refs.slick.innerSlider.slickGoTo(index);
        })
    };
    handleOk=()=>{
        this.setState({
            showBigPic:false
        })
    };
    handleCancel=()=>{
        this.setState({
            showBigPic:false
        })
    };
    render(){
        return(
            <div>
                <div className="comment-item">
                    <div className="comment-item-inner">
                        <div className="comment-user-info">
                            <div className="comment-avatar">
                                <img src={this.state.commentData.photo} alt=""/>
                            </div>
                            <div className="comment-user-name">
                                {this.state.commentData.wxName}
                            </div>
                            <div className="comment-time">
                                {this.state.commentData.createTime}
                            </div>
                        </div>
                        <div className="comment-content">
                            {this.state.commentData.content}
                        </div>
                        {
                            this.state.commentData.imgPaths?
                                <div className="comment-pic-wrapper">
                                    {this.state.commentData.imgPaths.map((item,index)=>{
                                        return(
                                            <div className="connent-pic-item" key={index}>
                                                <img src={item} onClick={this.showBigPic.bind(this,index)}/>
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                ""
                        }
                    </div>
                </div>
                <Modal
                    title="卖家晒图"
                    visible={this.state.showBigPic}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    key={this.state.picModalKye}
                    footer={null}
                    width={200}
                    style={{ top: 30,width:300 }}
                >
                    <Carousel
                        ref="swipeBigPic"
                    >
                        {
                            this.state.bigPics.map((item,index)=>{
                                return (
                                        <div className="big-pic-wrapper" key={index}>
                                            <img src={item}/>
                                        </div>
                                    )
                            })
                        }
                    </Carousel>
                </Modal>
            </div>
        )
    }

}
export default CommentItem
