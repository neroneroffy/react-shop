/**
 * Created by web前端 on 2017/8/8.
 */
import React, { Component } from 'react';
import './carousel.less';
import { Carousel } from 'antd';
class CarouselComponent extends Component{
    state={
        pic:[{}]
    };
    componentWillMount(){
        this.setState({
            pic:this.props.picPath
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.picPath!=this.props.picPath){
            this.setState({
                pic:nextProps.picPath
            })
        }
    }

    render(){
        return (
            <Carousel autoplay nextArrow={true} speed={800} className="carousel">
                {
                    this.state.pic.map((item,index)=>{
                        return (
                            <a href={item.url} key={index}><img src={item.coverImage} className="banner"/></a>
                        )
                    })
                }
            </Carousel>
        )
    }
}
export default CarouselComponent

