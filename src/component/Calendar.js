import React from "react";
import ReactDOM from "react-dom";

import moment from 'moment';
import 'moment/locale/zh-cn';

class Calendar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            titledate: this.props.initYearMonth,
            fetch:false,
            newshowDate:{},
            calendarcalss:"",
            txt:"",
            licurrent:-1
            
        };
        this.newshowDate ="";
        this.titelepos=0;//指定日期位置
        this.titletime="";
        this.contentdata="";
        this.week="";
        this.allweek="";
        this.maxdays="";
    }
    componentDidMount(){
        this.initData();   
    }
    //資料整理排序
    initData =(inputData1)=>{
        let dataSource;
        dataSource=this.props.dataShow;
        let adddata=inputData1;//是否有新增資料      
       if(typeof(dataSource) === "string"){
            dataSource=dataSource;
       }else if(typeof(dataSource) === "array"){
            dataSource=dataSource;
       }else{
           alert("資料格式不符");
       }

        fetch(dataSource,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
            .then(res => {  
                console.log(res);
              return res.json()
            })
            .then(result => {    
                if(JSON.stringify(adddata) === '{}'|| JSON.stringify(adddata) === undefined){
                    result=result;
                }else{
                    for(let i=0;i <= adddata.length-1;i++ ){
                        result.push( adddata[i]);
                    }
                }  
                               
                result.sort(function(a,b){
                    return Date.parse(a.date) - Date.parse(b.date);//时间正序
                });
                const newshowDate = [...new Set(result.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
                this.newshowDate = newshowDate;
                this.setState({
                    newshowDate:newshowDate,
                })
                this.titledate();
                this.contentdate();
                this.setState({
                    fetch:true
                })
             
            }).catch(
                 e => console.log("错误:", e)
            );
    }
    //原始資料刪除剩下新增資料
    resetData=(inputData1)=>{
        let result =inputData1;
            result.sort(function(a,b){
                return Date.parse(a.date) - Date.parse(b.date);//时间正序
            });
            const newshowDate = [...new Set(result.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
            this.newshowDate = newshowDate;
            this.setState({
                newshowDate:newshowDate,
            },() =>{
                this.titledate();
                this.contentdate();
            })
            this.setState({
                fetch:true
            })                     
    }


    // 指定年月份處理
    titledate = () =>{
        // 取出全部年月不重複
        moment.locale("zh-cn");
        let allnewdate =[], newdate=[];
        let datemin,datemax;
        let nowdate = this.state.titledate;//指定哪個年月
        let newshowDate= this.state.newshowDate;
        //取得全部月份前面日期 EX:2018/07
        this.setState({
            licurrent:-1
        })
 
        newshowDate.map((item,i) => {
            let titledate =item.date.slice(0,7);
            allnewdate.push(titledate);
        })
        //把重複月份刪除並且重新排列 EX:[2018/01,2018/02 ......];
        const titledate = [...new Set(allnewdate.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
        datemin = 0; //最小月份
        datemax=titledate.length-1;//最大月份
        this.titletime =titledate;

        if(titledate.length <= 2){
            this.titletime = titledate;
            let yearmon =titledate.indexOf(nowdate)+this.titelepos;
             if(yearmon >=1){
                yearmon=1;
             }else{
                yearmon=0;
             }
            this.setState({
                titledate:titledate[0],
            })
            if(yearmon === 1 ){
                yearmon=0;
                console.log(titledate[1]);
                this.setState({
                    titledate:titledate[1],
                })
            }
        }else{
            //如果這個日期是空的
            // 比指定日期小跟大的陣列(比日期大小)
            let min=[];
            let max=[];
            titledate.map((item,i)=>{
                // console.log(item,i);
                if(nowdate>item){
                    min.push(item);
                }else{
                    max.push(item)
                }

            })
            //min[min.length-1]<指定日期<max[0]
            // console.log("min:", min.length-1,min ,max);
            let datamore1=[];
            let datamore2=[];
            newshowDate.map((item,j) => {
                let datename =item.date.slice(0,7);
                //取的min最大值
                if(datename === min[ min.length-1]){  
                //塞入指定日期資料(比指定日期小)
                datamore1.push(item);
                }
                //取的max最小值
                if(datename ===max[0]){  
                    //塞入指定日期資料(比指定日期大)
                    datamore2.push(item);
                }
            })

            //將 比日期大 跟 比日期小的做比較 看誰資料誰比較多就顯示誰
            if(datamore1.length<datamore2.length){
                nowdate=max[0];
            }else if(datamore1.length<datamore2.length){
                nowdate=min[ min.length-1]
            }else{
                //如果指定月份>現在最大月份:就以最大月份顯示, 指定月份<現在最小月份:就以最小月份顯示
                if(nowdate >titledate[datemax] ){
                    nowdate=titledate[datemax];
                }else if (nowdate < titledate[datemin]){
                    nowdate=titledate[datemin];
                }
            }

            let yearmon ;//根據上面日期判斷指定時間位置 this.titelepos=>按鈕加減移動位置
                if(titledate.indexOf(nowdate)+this.titelepos >= datemax ){
                    yearmon=datemax;
                }else if(titledate.indexOf(nowdate)+this.titelepos <= datemin){
                    yearmon=datemin;
                }else{
                    yearmon=titledate.indexOf(nowdate)+this.titelepos;
                }
            // console.log(yearmon);
            // console.log(yearmon,this.titelepos);
            
            let end,first=false;//判斷最後跟初始
            //現在日期位置< 0 : titledate 陣列選取 0,1,2 位置
            if(yearmon < datemin){
                yearmon= [0,1,2]
                first=true;
            }else if(yearmon >= datemax){
                yearmon=[datemax-2,datemax-1,datemax];
                end=true;
                //datemax(最大日期位置),現在日期位置>=最大日期 : titledate 陣列選取 datemax-2,datemax-1,datemax 位置
            }else{
                // console.log(yearmon,"now");
                if(yearmon-1 <0){
                    yearmon=[yearmon,yearmon+1,yearmon+2]
                    first=true;
                }else if (yearmon >= datemax){
                    yearmon=[yearmon-2,yearmon-1,yearmon]
                    end=true;
                }else{
                    yearmon=[yearmon-1,yearmon,yearmon+1]
                }
            }
            newdate.push(titledate[yearmon[0]],titledate[yearmon[1]],titledate[yearmon[2]]);//重新塞入年月日
            
            this.titletime = newdate;
            // console.log(newdate);

            //指定脽亮燈
            if(end === true){
                this.setState({
                    titledate:titledate[yearmon[2]],
                })
            }else if(first === true){
                this.setState({
                    titledate:titledate[yearmon[0]],
                })
            }else{
                this.setState({
                    titledate:titledate[yearmon[1]],
                })
            }
        // console.log(this.state.titledate);
        }
    }
    //指定當月資料處理
    contentdate = () =>{
        // console.log(this.titletime);
        let titledate2 =this.state.titledate;
        let contentdata =[];
        let newcontentdata =[];
        let allweek=[];
        let newallweek=[];
        let date1=new Date(titledate2.slice(0,4),titledate2.slice(5,7),0);//判斷指定日期的年月
        let days=date1.getDate();// 看指定日期當月有幾天
        this.maxdays= days;
        let newshowDate= this.state.newshowDate;

       
        //取得指定日期
        newshowDate.map((item,j) => {
            let datename =item.date.slice(0,7);
            if(datename ===titledate2){
                //把所有日期轉換星期
                let week= moment(item.date).format('dddd');    
               //塞日指訂日期資料
                contentdata.push(item);
                allweek.push(week);//塞入日期
            }
        
        })

    // console.log(contentdata);
        let obj={};
        // 拿到當月日期最大天數，列出要放資料跟星期的空物件
        for(let i= 0; i<days ; i++){
            newcontentdata.push(obj);
            newallweek.push([]);
        } 
        // console.log(newcontentdata);
        //將資料所以年份切割到日期
        contentdata.map((item,j)=>{
            let datename =item.date.slice(8,10);
            // console.log(datename);
            if(datename < 10){
                datename=datename.slice(1,2);
                // console.log("yes");
            }else{
                datename=datename;
            }
            //將星期也放入相對應的數字
            newallweek[datename-1]= allweek[j];
            //將取得日期放入相對應的數字
            newcontentdata[datename-1]= item;
            // console.log(newcontentdata[datename],datename,item);
        })
           this.contentdata = newcontentdata;
           this.allweek=newallweek;
            // 將日期傳回
           this.week=moment(titledate2).format('dddd');
        //    console.log(newallweek);
    }
    // 每個月初是否要空格
    startweek = ()=>{
        let weekdata =["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        let licol,sunli=[];

        // console.log(this.week,this.maxdays);
        weekdata.map((item,i) =>{
            if(this.week == item){
                licol=i;
            }
        })

        this.week =licol;
        // console.log(licol);
        for(let i =0 ;i<licol ; i++){
            sunli.push(i);
        }
        // console.log(sunli);
        return(
            sunli.map((item ,j) =>{
                return(
                    <li key={j} className="ligray"></li>
                )
            })
        )
    }
    // 每個月底是否要空格
    endweek =() =>{
        let licol,sunli=[];
        licol=42-(this.week +this.maxdays);
        for(let i =0 ;i<licol ; i++){
            sunli.push(i);
        }
        return(
            sunli.map((item ,j) =>{
                return(
                    <li key={j} className="ligray"></li>
                )
            })
        )

    }

    next = (e) =>{
        this.titelepos=1;
        this.titledate();
        console.log(e.currentTarget,this.contentdata);
    }
    prev = (e) =>{
        this.titelepos=-1;
        this.titledate();   
        console.log(e.currentTarget,this.contentdata);
    }
    now = (e) =>{
        let date=e.target.innerText.slice(0,4)+"/"+e.target.innerText.slice(5,7);
        this.state.titledate=date;
        console.log(date);
        this.titelepos=0;
        this.setState({
            titledate:date,
            licurrent:-1
        },this.titledate());
        console.log(e.currentTarget,this.contentdata);      
    }
    list = () =>{
        let listclass =this.state.calendarcalss ===""?"list":"";
        this.setState({
            calendarcalss:listclass,
            licurrent:""
        })
    }

    destroy = ()=>{
        this.setState({
            titledate: this.props.initYearMonth,
            fetch:false,
            newshowDate:{},
            calendarcalss:"",
            txt:"",
            licurrent:""
            
        });
        this.newshowDate ="";
        this.titelepos=0;
    }
    liclickon =(e) =>{
        let changepos =e.currentTarget.getAttribute('id');
        this.setState({
            licurrent:changepos
        })
    }
    render(){
        const{titledate,fetch,calendarcalss,licurrent} = this.state;
        let on;
        if(fetch){
            this.contentdate();
            
            return(
                <div className={`th_calendar ${calendarcalss}`}>
                    <a href="javascript:;" onClick={this.list}>切換{this.state.calendarcalss ===""?"列表":"月曆"}顯示</a>
                    <header>
                        <a className="prevbtn" href="javascript:;" onClick={this.prev}></a>
                        <ul>
                            {
                               this.titletime.map((item,i)=>{
                                    on = item === titledate ? 'on':'';
                                    return(
                                        <li key={i} className={on} onClick={this.now} >
                                            <span> {item.slice(0,4)}年{item.slice(5,7)}月 </span>
                                        </li>
                                    )
                              })
                            }
                           
                        </ul>
                        <a className="nextbtn" href="javascript:;" onClick={this.next}></a>
                    </header>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>星期日</th>
                                    <th>星期一</th>
                                    <th>星期二</th>
                                    <th>星期三</th>
                                    <th>星期四</th>
                                    <th>星期五</th>
                                    <th>星期六</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <footer>
                        <ul>
                           {this.startweek()}
                           { 
                                this.contentdata.map((item,i) =>{
                                    const datakey=this.props.datakey;
                                    let guaranteed2 =datakey.guaranteed,
                                        availableVancancy2=datakey.availableVancancy,
                                        totalVacnacy2=datakey.totalVacnacy,
                                        price2 =datakey.price,
                                        state2 =datakey.state;

                                    let disn = JSON.stringify(item) === "{}" ?'disn':"";
                                    let go = item[guaranteed2] === true ? 'go':'disn';
                                    let buy =item[availableVancancy2] === " "? 'disn':'';
                                    let buy2 =item[totalVacnacy2] === " "? 'disn':'';
                                    let red =item[price2] === " "? 'disn':'red';
                                    let color ;
                           
                                   switch(item.status){
                                        case "關團":
                                            color="gray"
                                            break;
                                        case "報名":
                                            color="or"
                                            break;
                                        case "額滿":
                                            color="red"
                                            break;
                                        default:
                                            color="green"
                                    }                        
                                    return(
                                        <li id={i} className={`${disn} ${i == licurrent ? 'on':''}`} key={i} onClick={this.liclickon}>
                                            <span className='pc'>
                                                {i+1}
                                            </span>
                                                
                                            <span> 
                                                {this.allweek[i] === "星期六"|| this.allweek[i] ==="星期日" ?  <span className='red'><span>{i+1}</span>{this.allweek[i]}</span>: <span><span>{i+1}</span>{this.allweek[i]}</span> }
                                            </span>
                                           
                                            <div>
                                                <span className={go}>成團</span>
                                                <p className={`pc ${color}`}>{item[state2]}</p>
                                                <header>
                                                    <p className={buy}>可賣:{item[availableVancancy2]}</p>
                                                    <p className={buy2}>團位:{item[totalVacnacy2]}</p>
                                                </header>
                                                <div>
                                                    <p className={`m ${color}`}>{item[state2]}</p>
                                                    <p className={red}>${item[price2]}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                
                                })
                            }
                            {this.endweek()}
                        </ul>
                    </footer>
                </div>
                 )
        }else{
                return null;
            }
        }
        
    
}
export default Calendar;