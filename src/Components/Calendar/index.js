import React from 'react';
import moment from 'moment';
import './style.css';

export default class Calendar extends React.Component{
	state ={
		dateContext:moment(),
		today:moment(),
		showMonthPopup:false,
		showWeekPopup:false
	}
	constructor(props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || {};
        this.style.width = this.width; 
    }

weekdays=moment.weekdays();
weekdaysShort= moment.weekdaysShort();
months=moment.months();	
	year= () => {
		return this.state.dateContext.format("Y");
	}
month= () =>{
	return this.state.dateContext.format("MMMM");
}
week= () =>{
	return this.state.dateContext.format("dddd");
}
daysInMonth= () =>{
	return this.state.dateContext.daysInMonth();
}
currentDate= () =>{
	return this.state.dateContext.get("date");
}
currentDay= () =>{
	return this.state.dateContext.format("D");
}

 firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); 
        return firstDay;
    }
   setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }
   
  nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }
	
 onSelectChange=(e,data) =>{
	 this.setMonth(data);
	 this.props.onMonthChange && this.props.onMonthChange(); 
 }
hideDiv=()=>{
	document.getElementById("list").style.cssText="display:inline-block;";
	document.getElementById("open").style.cssText="display:none";
    document.getElementById("close").style.cssText="display:inline-block";
		
}
showDiv=()=>{
	document.getElementById("list").style.cssText="display:none";
	document.getElementById("close").style.cssText="display:none";
	document.getElementById("open").style.cssText="display:inline-block";
}
changeElem=()=>{
	document.getElementById("MainElement").style.cssText="display:none";
	document.getElementById("MainWeekElement").style.cssText="display:inline-block";
	this.nextWeek();
}
changeWeekElem=()=>{
	document.getElementById("MainWeekElement").style.cssText="display:none";
	document.getElementById("MainElement").style.cssText="display:inline-block";
}
 SelectList=(props) =>{
	 let popup=props.data.map((data)=>{
		 	   document.getElementById("list").style.cssText="display:none";
		 return(
			 <div key={data}>
			     <a href="#" onClick={(e)=> {this.onSelectChange(e,data)}}>
			        {data}
			     </a>	
			 </div>
		 );
	 });
	 return (	
		 <div className="month-popup">
		 {popup}
		 </div>
	 );
 }
 onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

 MonthNav= () =>{
	 return(
		  <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
		 {this.month()}
  {this.state.showMonthPopup &&
                 <this.SelectList data={this.months} />
                }
		 </span>
	 );
 }

onlyWeek = (e) =>{
      for (let i=0;i<=6;i++){
        if(document.querySelector("tr.week" + i)!=undefined)
          document.querySelector("tr.week" + i).style.display = "none";
      }

      
      this.props.onlyWeek && this.props.onlyWeek(e);
    }

    nextWeek = () => {
      let dateContext = Object.assign({}, this.state.dateContext);
      dateContext = moment(dateContext).add(1, "week");
      this.setState({
        dateContext:dateContext
      });

      let i_max = ((document.querySelector("tr.week6")!=undefined)
        || (document.querySelector("tr.selectedWeek6")!=undefined)) ?6:5;

      for(let i=0;i<=i_max;i++){
        if(document.querySelector("tr.selectedWeek"+i)!=undefined){
          document.querySelector("tr.selectedWeek"+i).className = "week" +i;
          i = (i== i_max)?1: ++i;
          document.querySelector("tr.week" +i).className = "selectedWeek" +i;
          document.querySelector("tr.selectedWeek" +i).style.display="table-row";
        }
      }

      this.onlyWeek();
      this.props.onNextWeek && this.props.onNextWeek();
    }

WeekNav=() => {
	return(
		<span 
		className="label-year"
		onClick={(e)=> {this.onChangeWeek(e)}}>
			{<i id="lol" class="fas fa-angle-down blackiconcolorYe"></i>}
		</span>
	);
} 

AddEvent=()=>{
	return(
		<span className="label-event" onClick={(e)=>{this.onButClick(e)}} >
		{<i class="fas fa-plus-circle blackiconcolor"></i> }
		 </span>
	);
}
 onButClick =(e)=>{
	 var b = prompt("Enter number of day:", ''); 
	 document.getElementById('event-but').innerHTML=  b;
	 var c = prompt("Enter your event:", ''); 
	 document.getElementById('event-but').innerHTML=  b+": "+c;
	 
 }
 onDayClick = (e, day) => {
        this.setState({
            selectedDay: day
        }, () => {
            console.log("SELECTED DAY: ", this.state.selectedDay);
        });

        this.props.onDayClick && this.props.onDayClick(e, day);
    }
	render(){
		let daysinthisWeek = [];
       let startWeek = moment().startOf("week");
       let endWeek = moment().endOf("week");
       let dayOfWeek = startWeek;

       while(dayOfWeek <= endWeek){
         daysinthisWeek.push(dayOfWeek.format("DD MM YY"));
         dayOfWeek = dayOfWeek.clone().add(1, 'd');
       }
		
		let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });
		let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
                </td>
            );
        }
        console.log("blanks: ", blanks);
		
		let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == this.currentDay() ? "day current-day": "day");
			daysInMonth.push(
                <td key={d} className={className} >
                    <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                </td>
            );
        }
		
   console.log("days: ", daysInMonth);
		
      var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })
		
		let trWeekElems = rows.map((d,i)=>{
                 let className = (i -1 ==moment().startOf("week").format('d'))? "selectedWeek"+i:"week"+i;
                 return(
                   <tr key={i*100} className = {className}>
                     {d}
                   </tr>
                 );
              })
		
		return(
			<div className="calendar-container" style={this.style}>
			   <table className="calendar">
		<thead>
		 
			<tr className="calendar-header">
			
			<this.AddEvent />
			
			   <td colspan="7">
			<td  className="nav-month-prev">
			<span 
                                    onClick={(e)=> {this.prevMonth()}}>
			PREV
                                </span> </td>
							
			       
		    
				<p id="open" onClick={(e)=>{this.hideDiv()}}><span id="nav"><this.MonthNav/></span><i class="fas fa-angle-down blackiconcolorIcon" ></i></p>
					
                <p id="close" onClick={(e)=>{this.showDiv()}}><span id="nav"><this.MonthNav/></span><i class="fas fa-angle-up blackiconcolorIcon" ></i></p>
			
		
			<td  className="nav-month-next">
			<span 
                                    onClick={(e)=> {this.nextMonth()}}>
										NEXT
                                </span>
			   </td>
			
                            </td>

			</tr>

					<span id="list">
		<button id="menu" onClick={(e)=>{this.changeElem()}}>This week</button>
        <button id="menu" onClick={(e)=>{this.changeWeekElem()}}>This month</button>
		</span>					


	
		      </thead>
	      <tbody>
	          <tr className="weekdays">
			                    {weekdays}
	          </tr>

	       </tbody>
</table>
<div id="MainWeekElement">
				  
			           {trWeekElems}
</div>
<div id="MainElement">
				  
			           {trElems}
</div>
        <div class="data">
                 {this.week()},  {this.currentDay()} {this.month()}
        </div>
        <div class="note">
                 <p id="events">Your events</p>
        <div class="main-event">
                <div class="stil">
                       <p id="event"></p>
                </div>
          <div class="stil">
	                <p id="event-but"></p>
	         </div>
         </div>
      </div>
</div>
		);
	}
	
}