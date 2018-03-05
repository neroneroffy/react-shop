/**
 * Created by web前端 on 2017/9/11.
 */
import React,{ Component } from 'react';
import './SingleCoupon.less';
class SingleCoupon extends Component {

    state={
        price:this.props.price,
        condition:this.props.condition,
        deadline:this.props.deadline,
        liked:true,
        isSelect:this.props.isSelect,
        isUsed:this.props.isUsed,
        couponName:this.props.couponName
    };
    componentWillMount(){
        //console.log(this.state.isSelect)
    }
    componentWillReceiveProps(nextProps){
        if(this.props!==nextProps){
            this.setState({
                price:nextProps.price,
                condition:nextProps.condition,
                deadline:nextProps.deadline,
                isSelect:nextProps.isSelect
            },()=>{
                //console.log(this.state.isSelect)
            })
        }
    }

    render(){
        {
            return (
                <div className={this.state.isSelect ==1?"single-coupon selected":"single-coupon"} >
                    <div className="left-dotted">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="right-dotted">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="single-coupon-left">
                        <div className="coupon-des">
                            <div className="coupon-price">
                                <span>¥</span>{this.state.price}
                            </div>
                            <div className="coupon-condition">
                                满{this.state.condition}可用
                            </div>
                        </div>
                        {
                            this.state.couponName?
                                <div className="coupon-name">{this.state.couponName}</div>
                                :
                                ""
                        }
                        <div>
                        </div>
                        {
                            this.state.deadline?
                                <div className="coupon-deadline">
                                    有效期{this.state.deadline}
                                </div>
                                :
                                ""
                        }
                    </div>
                    {
                        window.location.hash === '#/membercenter/mycou'?
                            <div className="single-coupon-right">{/*父组件引用子组件时候绑定的事件要在子组件中再写一下*/}
                                {
                                    this.state.isUsed === 1?"未使用":"已使用"
                                }

                            </div>
                            :
                            <div className="single-coupon-right" onClick={this.props.onClick}>{/*父组件引用子组件时候绑定的事件要在子组件中再写一下*/}
                                点击使用
                            </div>

                    }
                </div>

            )
        }

    }
}
export default SingleCoupon