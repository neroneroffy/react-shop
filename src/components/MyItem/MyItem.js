/**
 * Created by web前端 on 2017/8/10.
 */
import React,{Component} from 'react';
import { Icon } from 'antd';
import {Link} from 'react-router-dom';
import './MyItem.less';
class MyItem extends Component{
    state={
      MyItem:[
          {
              title:'我的资料',
              iconType:'contacts',
              linkTo:'/membercenter/myinfo'
          },
          {
              title:'我的优惠券',
              iconType:'tags-o',
              linkTo:'/membercenter/mycou'
          },
          {
              title:'我的收藏',
              iconType:'star-o',
              linkTo:'/membercenter/mycollect'
          },
          {
              title:'充值记录',
              iconType:'file-text',
              linkTo:'/membercenter/myrecharge'
          },
/*          {
              title:'消息提醒设置',
              iconType:'exclamation-circle-o',
              linkTo:'/membercenter/message'
          },*/
          {
              title:'收货地址管理',
              iconType:'environment-o',
              linkTo:'/membercenter/newaddress'
          }
/*
          {
              title:'代理',
              iconType:'solution',
              linkTo:'/membercenter/agency'
          },
*/

      ]
    };
    render(){
        return (
            <div className="my-item">
                <div className="my-item-content">
                    {
                        this.state.MyItem.map((item)=>{
                            return(
                                <Link to={ item.linkTo } key={item.iconType} className="my-item-item">
                                    <div className="my-item-icon">
                                        <Icon type={item.iconType}/>
                                    </div>
                                    <div className="my-item-txt">{item.title}</div>
                                </Link>
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}
export default MyItem