/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import Carousel from '../../../components/Carousel/CarouselComponent';
import './Bbgrain.css'
class Bbgrain extends Component{
    render(){
        return(
            <div className="bbgrain">
                <Carousel className="banner"></Carousel>
            </div>
        )
    }
}
export default Bbgrain
