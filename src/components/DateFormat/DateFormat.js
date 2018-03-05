export function DateFormat(fmt)
{
    var o = {
        Y : fmt.getFullYear(),
        M : fmt.getMonth()+1,                 //月份
        D : fmt.getDate(),                    //日
        h : fmt.getHours(),                   //小时
        m : fmt.getMinutes(),                 //分
        s : fmt.getSeconds(),                 //秒
        q : Math.floor((fmt.getMonth()+3)/3), //季度
        S  : fmt.getMilliseconds()             //毫秒
    };

        return (o.Y+"-"+o.M+"-"+o.D);




    /*if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;*/
};
