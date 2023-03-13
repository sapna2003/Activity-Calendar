const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventSubmit = document.querySelector(".add-event-btn");


let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//default events array
// const eventsArr = [
//     {
//         day:11,
//         month:03,
//         year:2023,
//         events: [
//             {
//                 title: "Event 1 lorem ipsum dolar sit genfs tersd dsad",
//                 time: "10:00 AM",
//             },
//             {
//                 title: "Event 2",
//                 time: "11:00 AM"
//             },
//         ],
//     },
//     {
//         day:13,
//         month:03,
//         year:2023,
//         events: [
//             {
//                 title: "Event 1 lorem ipsum dolar sit genfs tersd dsad",
//                 time: "10:00 AM",
//             },
//         ],
//     },
// ];

let eventsArr = [];

//call getEvents function
getEvents();

// function to add days

function initCalendar(){
    // to get prev month days and current month all days and rem next months days 
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month +1,0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const LastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay()-1;

    //update date top of calendar
    date.innerHTML = months[month] + " " + year;

    //adding days 
    let days = "";

    //prev month days
    for(let x = day; x>0;x--){
        days += `<div class = "day prev-date" >${prevDays - x + 1}</div>`;
    }

    //current month days
    for(let i=1;i<=LastDate;i++){
        
        //check if the event is present on current day
        let event = false;
        eventsArr.forEach((eventobj)=>{
            if(
                eventobj.day ===i &&
                eventobj.month ===month +1 &&
                eventobj.year ===year
            ){
                //if event found
                event = true;
            }
        });

        //if day is today then add class today
        if(i == new Date().getDate() && year == new Date().getFullYear() && month == new Date().getMonth()){

            activeDay = i;
            getActiveDay(i);
            updateEvents(i);
            //if event found also add event class
            // add active on today at start
            if(event){
                days += `<div class = "day today active event" >${i}</div>`;
            }
            else{
                days += `<div class = "day today active" >${i}</div>`;
            }
        }
        //add remaining as it is
        else{
            if(event){
                days += `<div class = "day event" >${i}</div>`;
            }
            else{
                days += `<div class = "day" >${i}</div>`;
            }
        }
    }
    //next month days
    for(let j= 1; j<= nextDays; j++){
        days += `<div class="day next-date " >${j}</div>`;
    }
    daysContainer.innerHTML = days;
    //add listner after calendar initialized
    addListner();
}

initCalendar();

//prev month
function prevMonth(){
    month--;
    if(month <0){
        month=11;
        year--;
    }
    initCalendar();
}

//next month
function nextMonth(){
    month++;
    if(month>11){
        month=0;
        year++;
    }
    initCalendar();
}

//add eventlistener on prev and next
prev.addEventListener("click",prevMonth);
next.addEventListener("click",nextMonth);

//our calendar is ready :)
//add goto date and today functionality

todayBtn.addEventListener("click",()=>{
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input",(e)=>{
    //allow only numbers remove anything else
    dateInput.value=dateInput.value.replace(/[^0-9/]/g, "");
    if(dateInput.value.length === 2){
        //add a slash if two numbers entered
        dateInput.value += "/";
    }
    if(dateInput.value.length>7){
        //dont't allow more than 7 character
        dateInput.value = dateInput.value.slice(0,7);
    }

    //if backspace pressed
    if(e.inputType === "deleteContentBackward"){
        if(dateInput.value.length === 3){
            dateInput.value = dateInput.value.slice(0,2);

        }
    }
});

gotoBtn.addEventListener("click",gotoDate);

//function to go to entered date
function gotoDate(){
    const dateArr = dateInput.value.split("/");
    //some date validation
    if(dateArr.length ===2){
        if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4){
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    // if invalid date
    alert("invalid date");
}


const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click",()=>{
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click",()=>{
    addEventContainer.classList.remove("active");
});

document.addEventListener("click",(e)=>{
    //if click outside
    if(e.target != addEventBtn && !addEventContainer.contains(e.target)){
        addEventContainer.classList.remove("active");
    }
});

//allow only 50 characters in title
addEventTitle.addEventListener("input",(e)=>{
    addEventTitle.value = addEventTitle.value.slice(0,50);
});

//time format in from and to time
addEventFrom.addEventListener("input",(e)=>{
    //remove anything else numbers
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");

    //if two numbers entered auto add
    if(addEventFrom.value.length === 2){
        addEventFrom.value += ":";
    }

    //don't let user enter more than 5 characters
    if(addEventFrom.value.length >5){
        addEventFrom.value = addEventFrom.value.slice(0,5);
    }
});

//same with to time
addEventTo.addEventListener("input",(e)=>{
    //remove anything else numbers
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");

    //if two numbers entered auto add
    if(addEventTo.value.length === 2){
        addEventTo.value += ":";
    }

    //don't let user enter more than 5 characters
    if(addEventTo.value.length >5){
        addEventTo.value = addEventTo.value.slice(0,5);
    }
});

//lets create function to add listener on days after rendered
function addListner(){
    const days = document.querySelectorAll(".day");
    days.forEach((day)=>{
        day.addEventListener("click",(e)=>{
            //set current day as active
            activeDay = Number(e.target.innerHTML);

            //call active day after click
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            //remove active day from already active
            days.forEach((day)=>{
                day.classList.remove("active");
            });

            //if prev month day clicked goto prev month and add active
            if(e.target.classList.contains("prev-date")){
                prevMonth();

                setTimeout(()=>{
                    //select all the days of the month
                    const days = document.querySelectorAll(".day");

                    //after going to prev month and active to clicked    
                    days.forEach((day)=>{
                        if(
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ){
                            day.classList.add("active");
                        }
                    });
                },100);

                //same with next months
            }else if(e.target.classList.contains("next-date")){
                nextMonth();

                setTimeout(()=>{
                    //select all the days of the month
                    const days = document.querySelectorAll(".day");

                    //after going to prev month and active to clicked    
                    days.forEach((day)=>{
                        if(
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ){
                            day.classList.add("active");
                        }
                    });
                },100);
            }
            else{
                //remaining current months days
                e.target.classList.add("active");
            }
        });
    });
}

// lets show active day events and date at top
function getActiveDay(date){
    const day = new Date(year , month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = date + " " + months[month] + " " + year;
}

//function to show events of the day
function updateEvents(date){
    let events = "";
    eventsArr.forEach((event)=>{
        //get events of active dat only
        if(
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ){
            //then show event on document
            event.events.forEach((event)=>{
                events += `
                <div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>            
                `;
            });
        }
    });
    
    //if nothing found
    if((events === "")){
        events = `<div class="no-event">
            <h3>No Event</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
    //save the previous event when update event is called
    saveEvents();

}

//lets create function to add events
addEventSubmit.addEventListener("click",()=>{
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    //some validations
    if(
        eventTitle === "" ||
        eventTimeFrom === "" ||
        eventTimeTo === ""
    ){
        alert("Please fill all the fields");
        return;
    }
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeFrom.split(":");

    if(
        timeFromArr.length != 2 ||
        timeToArr.length != 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ){
        alert("Invalid Time Format");
    }
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);  

    const newEvent = {
        title: eventTitle,
        time: `${timeFrom} - ${timeTo}`
    };

    let eventAdded = false;
    //check if eventsarr not empty
    if(eventsArr.length > 0){
        //check if current dat has already any event then add to that
        eventsArr.forEach((item) => {
            if(
                item.day === activeDay && 
                item.month === month + 1 &&
                item.year === year
            ){
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    // if event array empty or current day has no event create new
    if(!eventAdded){
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year : year,
            events: [newEvent],
        });
    }

    //remove active from add event form
    addEventContainer.classList.remove("active");
    //clear the fields
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    //show the current event
    updateEvents(activeDay);

    //also add event class to the newly added day if not already
    const activeDayElem = document.querySelector(".day.active");
    if(!activeDayElem.classList.contains("event")){
        activeDayElem.classList.add("event");
    }
});

function convertTime(time){
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

//function to remove the events onclick
eventsContainer.addEventListener("click",(e)=>{
   if(e.target.classList.contains("event")){
    const eventTitle = e.target.children[0].children[1].innerHTML;
    console.log(eventTitle);
    //get the title of event than search by title and delete
    eventsArr.forEach((event)=>{
        console.log(event);
        if(
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ){
            event.events.forEach((item,index)=>{
                if(item.title === eventTitle){
                    let confirmValue = confirm("Are you sure, you want to Delete this Event");
                    if(confirmValue)
                        event.events.splice(index,1);
                }
            });

            //if no event remains on that day then remove the complete day
            if(event.events.length === 0){
                eventsArr.splice(eventsArr.indexOf(event),1);

                //after removing the complete  day also remove the active class of that day
                const activeDayElem = document.querySelector(".day.active");
                if(activeDayElem.classList.contains("event")){
                    activeDayElem.classList.remove("event");
                }
            }
        }
    });
    //after removing from array update the event
    updateEvents(activeDay);
   } 
});

//store the events in local storage
function saveEvents(){
        localStorage.setItem("events",JSON.stringify(eventsArr));
}

function getEvents(){
    if(localStorage.getItem("events") != null){
        console.log("I Am not Empty :D");
        eventsArr.push(...JSON.parse(localStorage.getItem("events")));
    }
}