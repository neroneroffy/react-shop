/**
 * Created by web前端 on 2017/8/24.
 */
import { get } from './get'

export default function scrollPagnation(url,pagesInfo,loading,isbottom,data){
    let totalHeight = document.body.scrollHeight;
    let scrolledTop = document.body.scrollTop;
    let screenHeight = document.body.clientHeight;
    if(this.state.hasBeenBottom){
        if(scrolledTop+screenHeight == totalHeight){
            this.setState({
                pagesInfo:this.state.pagesInfo+1,
                loading:true,
                isbottom:false
            },()=>{
                get(url,{pagesInfo:this.state.pagesInfo})
                    .then((res)=>{return res.json();})
                    .then((data)=>{
                        console.log(data)
                        this.setState({
                            data:this.state.data.concat(data.data),
                            loading:false,
                            isbottom:true
                        });
                    });


            })

        }

    }
}