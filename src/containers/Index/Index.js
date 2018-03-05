/**
 * Created by web前端 on 2017/8/5.
 */
import React, { Component } from 'react';
import Classify from '../../components/Classify/Classify'
import Search from '../../components/Search/Search'
import './index.less'



class Home extends Component{
    componentWillMount(){

    }
    render(){
        return(
            <div>
                <Search/>
                <Classify className="classifyTabbar"/>

            </div>
        )
    }

}

export default Home;
