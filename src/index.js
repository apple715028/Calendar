import React from "react";
import ReactDOM from "react-dom";
import Calendar from "./component/Calendar"
// import DateShow from "./data/data1.json";
import "./index.scss";




class App extends React.Component {
  constructor(props){
    super(props);
    this.namefun = React.createRef();
  }
  nextMonth = (e) =>{
    this.namefun.current.next(e);    
    console.log(this);
  }
  prevMonth = (e) =>{
    this.namefun.current.prev(e);
    console.log(this);
  }
  switch = () =>{
    this.namefun.current.list();
  }

  destroy =()=>{
    this.namefun.current.destroy();
  }
  resetData =() =>{
    let inputData1=[{
      "guaranteed": true, 
      "date": "2016/09/20", 
      "price": 235, 
      "availableVancancy": 30, 
      "totalVacnacy": 20, 
      "status": "報名" 
  },{
    "guaranteed": true, 
    "date": "2016/10/21", 
    "price": 235, 
    "availableVancancy": 30, 
    "totalVacnacy": 20, 
    "status": "報名" 
  }
];
    this.namefun.current.resetData(inputData1);
  }
  inputData =()=>{
    let inputData1=[{
      "guaranteed": true, 
      "date": "2016/09/20", 
      "price": 235, 
      "availableVancancy": 30, 
      "totalVacnacy": 20, 
      "status": "報名" 
  },{
    "guaranteed": false,
    "date": "2016/09/30",
    "price": 72420,
    "availableVancancy": 17,
    "totalVacnacy": 235,
    "status": "截止"
}
];
    this.namefun.current.initData(inputData1);
  }
  render(){
    let dataShow="./data/data5.json";
    let datakey;
    let initYearMonth= '2016/11';    
    if( dataShow ==="./data/data2.json"){
      datakey  =  {
        "guaranteed":"certain",
        "date":"date",
        "price":"price",
        "availableVancancy":"onsell",
        "totalVacnacy":"total",
        "state":"state"
      };
    }else{
      datakey=  {
        "guaranteed":"guaranteed",
        "date":"date",
        "price":"price",
        "availableVancancy":"availableVancancy",
        "totalVacnacy":"totalVacnacy",
        "state":"status"
      };
    }
   
      return (
        <div className="App">
          <Calendar ref={this.namefun} dataShow={dataShow} datakey={datakey}initYearMonth={initYearMonth}/>
          <button onClick={this.nextMonth}>nextMonth</button>
          <button onClick={this.prevMonth}>prevMonth</button>
          <button onClick={this.switch}>switch</button>
          <button onClick={this.inputData}>inputData</button>
          <button onClick={this.resetData}>resetData</button>
          <button onClick={this.destroy}>destroy</button>
        </div>
      );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);