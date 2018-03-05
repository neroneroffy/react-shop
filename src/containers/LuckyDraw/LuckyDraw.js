/**
 * Created by web前端 on 2017/11/22.
 */
import React,{Component} from 'react';
import './LuckyDraw.less';
import runner from './runner.png';
import btn from './btn.png'
class LuckyDraw extends Component{
    constructor(props){
        super(props);
        this.state={
            award:[
                '特等奖','一等奖','二等奖','三等奖',"","","","","","","","","","","","","","","","","","","",""
            ],
            offOn:true,

        }
    }
    begin=()=>{
        if(this.state.offOn){
            this.rotate();
            this.setState({
                offOn:false
            })
        }
    };
    rotate=()=>{
        let random = Math.random()*this.state.award.length;
        let totalAngle = random%1>0?random%1*360+720:random*360+720;
        let step = 0;
        let timer = 0;
        let stepLength = 1;
        let speed = 0
        timer = window.setInterval(()=>{
            if(step<=totalAngle){
/*
                stepLength-=0.01;
                step+=(totalAngle/step);
                console.log(step)*/
/*
                step += 4;
                this.refs.runner.style.transform=`rotate(${step}deg)`;

*/
                if(step+stepLength<=540){
                    step += 4;
                    this.refs.runner.style.transform=`rotate(${step}deg)`;
                }else{
                    step+=totalAngle/step-0.5;
                    this.refs.runner.style.transform=`rotate(${step}deg)`;
                }
            }else{

                if(totalAngle%360>=0&&totalAngle%360<=90){
                    alert('三等奖')
                }else if(totalAngle%360>90&&totalAngle%360<=180){
                    alert('二等奖')
                }else if(totalAngle%360>180&&totalAngle%360<=270){
                    alert('一等奖')
                }else{
                    alert('特等奖')
                }
                window.clearInterval(timer)

            }
        },8)



/*
        let angle = 360/this.state.award.length
        let step = 0;
        let randomAngle = Math.random()*360;
        //躲过特等奖
        if(randomAngle>=90 && randomAngle<=120){
            randomAngle = 128
        }
        this.state.award.forEach((item,index)=>{
            if(randomAngle>=(index-1)*angle && randomAngle<=index*angle){
                alert(`中奖序号${index}-----什么奖${item}`)
            }
        })

        let awardAngle = 360+randomAngle
        let timer = 0;
        let add = 0
        timer = window.setInterval(()=>{
            if(step+add<360){
                add +=0.3;
                step ++;
                this.refs.runner.style.transform=`rotate(${step+add}deg)`;
            }else{
                step ++;
                add -=0.2;
                this.refs.runner.style.transform=`rotate(${step+add}deg)`;
                if(step+add>=awardAngle){
                    window.clearInterval(timer);
                    this.setState({
                        offOn:true
                    })
                }
            }
        },8)
*/
    };
    render(){
        return(
            <div className="lucky-draw">
                <div className="lucky-bg">
                    <div className="lucky-runner-wrapper">
                        <img src={runner} alt="图片丢失了" className="lucky-runner" ref="runner"/>
                        <img src={btn} alt="" className="lucky-btn" onClick={this.begin}/>
                    </div>
                </div>
            </div>
        )
    }
}
export default LuckyDraw