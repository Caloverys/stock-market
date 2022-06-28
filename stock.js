







//return true if stock is earning and return false if stock is losing money
function return_color() {
  //raw_data[0].close give us latest/current stock price
  if (timestamp === '1min')
    return raw_data[raw_data.length - 1].close >= find_closed_price() ? "lawngreen" : "red";
  else
    return dataset[0] <= dataset[dataset.length - 1]  ? "lawngreen" : "red";
}
//the index of raw_data that the user is hovering at
let current_Index = 0;

//max and min value existed in the selected time 
let max_value, min_value;

//Array contains the orginial data retrieved from the API 
let raw_data;


//Contains the current ClientX value
let clientX;

//Contains the date (time) for newest data retreieved from website
let latest_date;


//Boolean value return from function isInCanvas to check if mouse position is inside the chart or not
let isInsideChart;

//Contain the number of data that being retrieved from API before the fill_label_array_ function fire for 1 day or 1 week
let valid_data_number;

//Specific timestamp for retrieving data from APi
let timestamp;

//A boolean value return by mousedown to determine whether mouse is down 
let isMouseDown;

//the difference time need to be minus from the user's using date (e.g for one_day range, difference_time is 0, but for 1_week range, difference time is 7)
//This only applies on time range less than or equal to 2 months
let difference_time;

//The variable name for getting data from all_fetch_data object (e.g. "one_day")
let variable_name;

//The id of the range button that being clicked (e.g "#one_day")
let button_being_clicked;

//The array contains the parameter to call the format_data_two function
let parameter_list;

//The symbol of the stock that the application will fetch
let symbol;

//The horizontal line that display previous value (for 1 day range only)
let horizontalLine;



//Boolean value to check if user is waiting for the data (will be true if user click the button before the data about a specific data loaded)
let isWaiting_one = true;

//Boolean value to indicate if user is waiting for all stock symbols data (will be true if user click the stock_market button before all stock symbols data loaded)
let isWaiting_two = false

//Boolean value to indicate if user is waiting for all stock symbols data (will be true if user types something in the search engine before all stock symbols data loaded)
let isWaiting_three = false;

/*

label_array contains the x-axis label value for each data

grid_color_array contains the color for every vertical gridline for each data

symbol_full_list => an array contains objects that have the full data return by the API

symbol_price_list => an array contains all price values of stocks

symbol_symbol_list => an array contains array with all stocks symbol (each subarray is separating by first character e.g. symbol_symbol_list[0] contains all the symbol starts with a )

symbol_full_name_list => an array contains all full name of all stocks 

*/

let [label_array, grid_color_array] = new Array(2).fill([])

//Try to get my_watch_list from localStorage, if there is no data, declared as []
let my_watched_list = JSON.parse(localStorage.getItem('my_watched_list'))

if (!my_watched_list) my_watched_list = []


const all_fetch_data = {
  "one_day": null,
  "one_week": null,
  "one_month": null,
  "two_month": null,
  "three_month": null,
  "all_data": null

}


delete_button.addEventListener('click', (e) => {
  input.blur();
  input.value = ""
  e.target.style.visibility = 'hidden'
  create_sections(symbol_full_name_list)

})


function search_through(search_keyword) {
  //Note search_keyword will always be uppercase 
  const list = [[],[],[]]
  for (let i = 0; i < symbol_symbol_list.length; i++) {

    /*
    symbol_symbol_list[i][0][0] => first character in the first item in symbol_symbol_list[i]

    value[0] => first character in search value 

    the structure of the symbol_symbol_list looks like 

    [[A,AA,AAA.....],[B,BB,BBB,BBBB......].....] 

    for better search purpose.

    here check if they start with the same first character
    */
    if (symbol_symbol_list[i][0][0] === search_keyword[0]) {


      symbol_symbol_list[i].forEach((values, index) => {

        if (values.startsWith(search_keyword)) {
          /*

          The structure of the array looks like 

          [[A,AA,AAA.....],[B,BB,BBB,BBBB......].....] 

          in order to be easier used (displayed) in the future

          we need to get the global index (releative to symbol_full_list) for current values 


          slice(0, i) first slice array the previous subarray exclude current subarray

          use array.reduce to get the indexs passed in previous subarrays and add current i (according to this subarray) as indicated at the end of subarray

          */

          const sum_index = symbol_symbol_list.slice(0, i).reduce((prev, curr) => prev + curr.length, index)

          list[0].push(sum_index)

        }


      })

      //Immediately stop the array from looping after loop over the subarray that contains the search word first character to save performance
      break


    }


  }


  /*
  search by company name:

   only search by company name if search keyword is greater than 1 character

  */

  if (search_keyword.length > 1) {


    for (let i = 0; i < symbol_full_name_list.length; i++) 

      if (symbol_full_name_list[i].toUpperCase().indexOf(search_keyword) > -1 ) 

        list[1].push(i)

  }


/* 
if there is item in my watch list, search over it 

data.search_result['0'] => symbol of the stock

data.search_result['1'] => full name of the stock

if symbol of the stock in my watch_list starts with the search keyword, push it

or the company name of the stock in my watch_list contains the keywords, push it


*/

  if (my_watched_list.length > 0) {

    my_watched_list.forEach((data, index) => {
     
      if (data.search_result['0'].startsWith(search_keyword) || data.search_result['1'].toUpperCase().includes(search_keyword))

        list[2].push(index)


    })

  }

  //make sure the results from search array by symbol doesn't include the index in my watch_list
  list[0] = list[0].filter(i=>!list[2].includes(i))

  //make sure the results from search array by company name doesn't include the index in my watch_list or index in search array by symbol so there is no duplicate item appears in search result
  list[1] = list[1].filter(i => !list[2].includes(i) && !list[0].includes(i))

  create_sections(list);
  console.log(list)

}

input.addEventListener('keyup', (e) => {

  const search_value = input.value.toUpperCase()
  if (search_value.trim() === "") {
    delete_button.style.visibility = 'hidden'
    return
  }
  delete_button.style.visibility = 'visible'

  /*

  immediately return if key is not a alphabet letter or delete or backspace key

  Warning: do not use keyCode, it is not depricated, use key instead

  /[a-z]/i => match a-z case insenstive 

  */
  if (!e.key.match(/[a-z]/i) && e.key !== "Backspace" && e.key !== "Delete"  ) return;
  

   /*

   if symbol has not been loaded from web worker, then add loader effect to search result section  

   isWaiting_three:true indicates that is waiting for symbol data

 */

  if (symbol_full_name_list.length === 0) {

    search_result_element.innerHTML = `
       <div id='loader'></div>
       `;
    isWaiting_three = true;

    return;

  }

  search_through(search_value)

})


/*

return fetch Data by symbol and range of the data

return array contains object data structure

Example:

0 {date: "2022-06-10 09:30:00", open: 159.16, low: 158.95, high: 159.94, close: 159.63, volume: 131955}
1 {date: "2022-06-10 09:31:00", open: 159.55, low: 159.53, high: 160.38, close: 160.32, volume: 31434}

This API only returns data for 1 day to 2 month 

Range refers to the difference between every two dataset 

Example: 1min 5min 15min 1hour 4hours


*/


document.body.addEventListener('mousemove', e => {

  isInsideChart = isInCanvas(e.clientX, e.clientY);
  //console.log(isInsideChart);

  if (isInsideChart) {
    clientX = e.clientX;
    info_price.style.visibility = 'visible'
    info_date.style.visibility = 'visible'

  } 
  else {

    info_price.style.visibility = 'hidden'
    info_date.style.visibility = 'hidden'
    selectAll('#range > button').forEach(i => i.style.visibility = 'visible')
  }

})




//will return false if mousedown but not inside chart
canvas.addEventListener('mousedown', ()=>isMouseDown = (isInsideChart ? true : false))

canvas.addEventListener('mouseup', ()=>isMouseDown = false)








/* 

designed for formating data from 1 day to 2 month only 

difference_range => the difference of days between current date and a specific date 

Example:

2 month => 60 
1 month => 30
1 week => 7 
1 day => 0


*/

function format_data(difference_range) {

  //get the current latest date 

  latest_date = raw_data[raw_data.length - 1].date.format_date();
  
  /*

  get the small accept time

  smallest_accept_time is the latest_date date - difference_range and set hours and minutes to open market time (9:30)

  */

  const smallest_accept_time = new Date(new Date(global_time).setDate(global_time.getDate() - difference_range)).setHours(9,30);
  console.log(smallest_accept_time)

  raw_data.forEach((item, index) => {

    if (item.date.format_date() >= smallest_accept_time) {

      label_array.push(item.date.format_date());
      detail_dataset.push(item);
      dataset.push(item.close.toFixed(2));

    }

  })


  valid_data_number = label_array.length;

  max_value = Math.max.apply(null, dataset)
  min_value = Math.min.apply(null, dataset)

  
  if (timestamp === '1min') {

    //convert label arrays to hours
    label_array = label_array.map(i => new Date(i).getHours())

    if (global_time.return_market_status()) fill_label_array_1min()

    label_array = label_array.map(i => i + (i < 12 ? 'am' : 'pm'))

    grid_color_array = Array(label_array.length).fill("transparent")

    for (let i = 30 / range; i < label_array.length; i += 60 / range) grid_color_array[i] = gridline_color;


  } else if (timestamp === "5min") {
    label_array = label_array.map(i => new Date(i).getDate())
    fill_label_array_5min()

    grid_color_array = Array(label_array.length).fill("transparent")

    for (let i = 0; i < label_array.length; i += Math.ceil(79 / range)) grid_color_array[i] = gridline_color


  } else if (timestamp === "30min") {
    let startingDate = new Date(label_array[0]).getDate()
    label_array = label_array.map(i => {
      const label_date = new Date(i).getDate()
      if (label_date >= startingDate + 7) startingDate = label_date
      return startingDate
    })
    grid_color_array = Array(label_array.length).fill("transparent");
    for (let i = 0; i < label_array.length; i += 70 / range) grid_color_array[i] = gridline_color;


  } else if (timestamp === '1hour') {
    //Use internationalization API to convert number of month to full name (e.g. 0=> January)
    let currentMonth = new Date(label_array[0]).toLocaleString("default", {
      month: 'long'
    });
    const passed_range = [];
    label_array = label_array.map((i, index) => {
      const label_month = new Date(i).toLocaleString("default", {
        month: 'long'
      });
      if (label_month !== currentMonth) {
        currentMonth = label_month
        passed_range.push(index)
      };
      return label_month

    })
    grid_color_array = Array(label_array.length).fill("transparent");
    //Sometimes there will not be enough (three) labels, so we could push the start month as well.
    if (passed_range.length < 3) passed_range.unshift(0)

    for (let i = 0; i < label_array.length; i++) {
      if (passed_range.includes(i))
        grid_color_array[i] = gridline_color;
    }
  }
  grid_color_array[grid_color_array.length - 1] = gridline_color
}




function format_data_two(difference, isYear, filter_value, filter_data_range = 1, label_by_year) {
  Chart.unregister(horizontalLine);
  dataset.length = 0
  const lastest_date = new Date(all_fetch_data['all_data'][all_fetch_data['all_data'].length - 1].date)
  const oldest_date = (!isYear ? new Date(lastest_date.getFullYear(), lastest_date.getMonth() - difference, lastest_date.getDate(), 23, 59) : new Date(lastest_date.getFullYear() - difference, lastest_date.getMonth(), lastest_date.getDate(), 23, 59))

  raw_data.forEach((item, index) => {

    let current_date = new Date(item.date)

    /*
    
    Important notice:

    The default timestamp for new date constructor is EDT timestamp
    

    the item.date retrieving from API is UTC/GMT timestamp

    they have four hour difference 

    For example, in EDT time is 8:00, in UTC/GMT, the time will be 12:00


    So we must add 4 hours to GMT timestamp to make them the same

    Should be very careful handle this

    P.S. spend 2 hours find out the bug caused by this

    */


    if (index % filter_data_range === 0) {

      current_date = new Date(current_date.setHours(current_date.getHours() + 4))
      if (difference) {
        if (current_date >= oldest_date) {
          label_array.push(current_date)
          detail_dataset.push(item)
          dataset.push(item.price.toFixed(2))
        }

      } else {
        label_array.push(new Date(current_date.setHours(current_date.getHours() + 4)))
        detail_dataset.push(item)
        dataset.push(item.price.toFixed(2))
      }


    }
  })


  valid_data_number = label_array.length

  max_value = Math.max.apply(null, dataset)
  min_value = Math.min.apply(null, dataset)

  /*

  fill grid_color array with "transparent" with the number of valid_data_number

  It is used to indicate if gridline of the label should be displayed or not 

  if "transparent" means the gridline will not going to be display

  */
  grid_color_array = Array(valid_data_number).fill('transparent')

  let passed_value = [0];

  if (!label_by_year) {

    /*

    Convert month to full name

    Example:

    0 => January 

    */

    let currentMonth = new Date(label_array[0]).toLocaleString("default", {
      month: 'long'
    });
    label_array = label_array.map((i, index) => {
      const label_month = new Date(i).toLocaleString("default", {
        month: 'long'
      });
      if (label_month !== currentMonth) {
        passed_value.push(index)
        currentMonth = label_month
      };

      return label_month
    })

  } else {
    let currentYear = new Date(label_array[0]).getFullYear()
    label_array = label_array.map((i, index) => {
      const label_year = new Date(i).getFullYear()

      if (label_year !== currentYear) {
        passed_value.push(index)
        currentYear = label_year
      };

      return label_year
    })

  }



  if (filter_value) passed_value = passed_value.filter((i, index) => {
    return index % filter_value === 0
  })

  for (let i = 0; i < label_array.length; i++) {
    if (passed_value.includes(i))
      grid_color_array[i] = gridline_color;
  }

  grid_color_array[grid_color_array.length - 1] = gridline_color;


}





function create_watch_list_section(data, isSearch) {
  //data.length 0 means no matched result in searching my watched list, so return
  if (isSearch && data.length === 0 || my_watched_list.length === 0) return;
    
  search_result_element.innerHTML += `
  <h2 id='header'>My watch list:</h2>
  `

  let search_result = []
  //by checking if data existed to know if this is result from search or recommand
  isSearch ? search_result = data.slice() : search_result = my_watched_list.slice()
  search_result =
    my_watched_list.forEach(i => {
      search_result.innerHTML += `
 <div id='element_${i.index}'>
  <div id='symbol'>${i.search_result['0']}</div>
  <span id='exchange_market_symbol'>${i.search_result["4"]}</span>
  <div id='company_name'>${i.search_result["1"]}</div>
  <div id='current_price'>${i.search_result["2"].toFixed(2)}</div>
</div>
     `
    })

}

function search_or_recommand_section(data, isSearch) {

 search_result_element.innerHTML = ""
  create_watch_list_section(data[2], isSearch)


  search_result_element.innerHTML += `
  <h2 id='header'>${!isSearch ? "Recommand" : "Symbols" }:</h2>`
  let display_list = [];
      console.log(data)

  if (!isSearch) {
    //The list contains 15 random non-repeating choosed index for data that going to be displayed
    let rest_list = data.slice();
    while (display_list.length < 15) {
      const selected_index = Math.floor(Math.random() * rest_list.length)
      if (symbol_full_list[selected_index]["2"] < 100) continue;
      display_list.push({
        index: selected_index,
        data: symbol_full_list[selected_index]
      })
      rest_list.splice(selected_index, 1)

    }
  } else {
    //use XML here to search for html tag by content
    //const matched_element = document.evaluate(`//h2[text()='My watch list:']`,
    // document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //if (matched_element) matched_element.remove()
    if (data[0].length + data[1].length < 15) {
      display_list = data[0].slice().concat(data[1]).map(i => {
        return {
          index: i,
          data: symbol_full_list[i]
        }
      })

    } else {
      let rest_list = data[0].slice()
      while (display_list.length < 15 && rest_list.length > 0) {
        //debugger
        const selected_index = Math.floor(Math.random() * rest_list.length);
        console.log(symbol_full_list[selected_index]["2"],display_list,rest_list)
        if (symbol_full_list[selected_index]["2"] < 10) continue;
         const index = rest_list[selected_index];
        display_list.push({
          index: index,
          data: symbol_full_list[index]
        })
        rest_list.splice(selected_index, 1)
      }

      if (display_list.length < 15) {
        rest_list = data[1].slice()
        while (display_list.length < 15 && rest_list.length > 0) {
          const selected_index = Math.floor(Math.random() * rest_list.length)
          if (symbol_full_list[selected_index]["2"] < 100) continue;
          const index = rest_list[selected_index];
          display_list.push({
            index: index,
            data: symbol_full_list[index]
          })
          rest_list.splice(selected_index, 1)

        }
      }
    }
  }

  display_list.forEach((data, index) => {



    search_result_element.innerHTML += `
    <div id='element_${data.index}'>
    <div id='symbol'>${data.data['0']}</div>
    <span id='exchange_market_symbol'>${data.data["4"]}</span>
    <div id='company_name'>${data.data["1"]}</div>
    <div id='current_price'>${data.data["2"].toFixed(2)}</div>
    </div>
    `
  })
  //use regular expression in dom here, to select any divs have id starts with element_ 

  selectAll("div[id^='element_']").forEach(div => {
    div.addEventListener('click', function(e) {
      //remove the string and leave with number only
      const index = e.target.id.split('element_')[1]
      if (select('.active')) select('.active').classList.toggle('active')
      event.target.classList.add('active')
      setup(index)
    })
  })


}

function create_sections(data) {
  search_result_element.innerHTML = ""
  //array.some => run a test to all the elements and return true if at least one element passes the tests (not required for all the elements (it will be array.every)) 
  //data.slice(0,2) exclude the my watchList data 

  if (Array.isArray(data[2]) && !data.slice(0, 2).some(i => i.length > 0)) {
    search_result_element.innerHTML = `<h3>No result for "${input.value}" </h3>`
    search_result_element.style.textAlign = 'center'
    return
  }


  search_result_element.style.textAlign = 'left'

  Array.isArray(data[0]) ? search_or_recommand_section(data, true) : search_or_recommand_section(data, false)

}






function fill_label_array_5min() {

  const expectedDate = new Date(latest_date.getFullYear(), latest_date.getMonth(), latest_date.getDate(), 16, 0)
  const amountToAdd = (expectedDate - latest_date) / 1000 / 60 / 5
  label_array.push.apply(label_array, Array(Math.ceil(amountToAdd / range)).fill(expectedDate.getDate()))

}

function fill_label_array_1min() {
  const expectedDate = new Date(latest_date.getFullYear(), latest_date.getMonth(), latest_date.getDate(), 15, 59)


  const amountToAdd = (expectedDate - latest_date) / 1000 / 60;

  //Add null dataset to array with numbers of minutes left to the close market which is 4 p.m.
  //first fill the label_array to full hour (60 min)
  label_array.push.apply(label_array, Array(Math.floor((59 - latest_date.getMinutes()) / range)).fill(latest_date.getHours()))

  for (let i = latest_date.getHours() + 1; i < 16; i++) label_array.push.apply(label_array, Array(60 / range).fill(i))

  //at last 16:00
  label_array.push(16)

}


function find_closed_price() {
    for (let i = raw_data.length - 1; i >= 0; i--) {
      if (latest_date.getDate() !== raw_data[i].date.format_date().getDate()) {
        closed_price = raw_data[i].close
        return raw_data[i].close;
      }
    }

}





function filter_data(input_data, time_range) {
  if (window.innerWidth > 1100) window.range = 1
  else if (window.innerWidth > 800) window.range = 2
  else if (window.innerWidth > 600) window.range = (timestamp !== `30min` ? 3 : 4)
  else if (window.innerWidth > 400) window.range = (timestamp === `${5 || 30}min` ? 6 : 5)
  else {
    parent_of_canvas.style.color = 'white';
    parent_of_canvas.innerHTML = `
      <div style='font-size:1.5em;'>!Window size warning:!</div><br>
      <div>Your interior window size is 
      <span style='color:red'>${window.innerWidth}, ${window.innerHeight}</span>
       which is too small to load the graph </div>
      <div>Please switch to bigger interior </div>
      `

  }

  //filter data by range and sort data based on the date (newest date like 15:59 pm ) to the end 
  if (parseInt(timestamp) < 30 || range < 3) {
    return input_data.sort(({
        date: a
      }, {
        date: b
      }) => a < b ? -1 : (a > b ? 1 : 0))
      .filter(i =>
        i.date.format_date().getMinutes() % (range * time_range) === 0
      )
  }

  return input_data.sort(({
      date: a
    }, {
      date: b
    }) => a < b ? -1 : (a > b ? 1 : 0))
    .filter(i =>
      i.date.format_date().getHours() % (range * time_range / 60) === 0 && i.date.format_date().getMinutes() === 0
    )

}

function judge_color() {

  if (current_Index === static_Index) return hover_color;

  else if (current_Index > static_Index) return dataset[current_Index] >= dataset[static_Index] ? "lawngreen" : "red";

  else return dataset[static_Index] >= dataset[current_Index] ? "lawngreen" : "red"

}



function create_chart() {
  window.fire = false;
  window.first_index = null
  let [static_clientX, static_clientY] = new Array(2).fill(null)
  window.static_Index = null
  const annotation = {
    id: 'annotationline',

    afterDraw: function(chart) {
      if (!chart.tooltip._active.length || !isInsideChart) return;
     
      selectAll('#range > button').forEach(i => i.style.visibility = 'hidden')
      info_price.style.color = hover_color;

      
      let left_position = parseFloat(window.getComputedStyle(info_price).getPropertyValue('left'))

      let this_position_x = chart.tooltip._active[0].element.x;
      let this_position_y = chart.tooltip._active[0].element.y;

      if (current_Index === 0 && !first_index) first_index = this_position_y


      const pos_X = canvas.getBoundingClientRect().left + myChart.chartArea.left - info_price.offsetWidth / 2;

      const strokeColor = (!isMouseDown ? hover_color : judge_color())

      //Notice: do not remove following if statements for improving performance, the following if statement helps user reach the dataset[0] or dataset[dataset.length-1], without the line it will not be much too smooth and easy to reach it due to too many data points in the chart

      if (left_position === pos_X) {
        fire = true
        this_position_x = myChart.chartArea.left
        if (first_index) this_position_y = first_index
      } else fire = false
      

      /* 

      This is for drawing the current moving line

      It will move as the mouse move

      */

      context.beginPath();
      context.strokeStyle = strokeColor;
      context.globalCompositeOperation = 'source-over';

      context.setLineDash([]);

      context.moveTo(this_position_x, chart.chartArea.top);
      context.lineTo(this_position_x, chart.chartArea.bottom);
      context.lineWidth = context.lineWidth > 2.5 ? context.lineWidth : 2.5
      context.stroke();
      context.closePath();

      context.moveTo(this_position_x, chart.tooltip._active[0].element.y)

      context.beginPath();

      context.fillStyle = strokeColor;

      context.arc(this_position_x, this_position_y, window.innerWidth / 110 > 10 ? window.innerWidth / 110 : 10, 0, 2 * Math.PI);

      context.fill();

      context.strokeStyle = 'rgba(0,0,0,0.8)';

      context.stroke();

      context.closePath();

      context.restore();

      context.save();


      /*

      The state saved by context.save() could only be restored only once.

      Every time you call save, all the current default properties of the context are pushed in this stack.

      Every time you call restore, the last state is popped out of the stack, and all its saved properties are set to the context.

      So we need to use context.restore followed by a context.save() in order by keep the customized property for further used.

       */

      
      /*

      If user doesn't mousedown, then declare following variables as null

      If user mousedown, then draw the following line.

      */

      if(!isMouseDown){
        static_clientY = null;
        static_clientX = null;
        static_Index = null;
      }
      else{

        if (!static_clientX) {
          static_clientY = this_position_y;
          static_clientX = this_position_x;
          static_Index = current_Index;
          return;
        }
        
        /* 

        drawing the static line that formed at the position where user mousedown

        The position of it will not be changed unless user mouseup 

        */

        context.beginPath();

        context.moveTo(static_clientX, myChart.chartArea.top);
        context.lineTo(static_clientX, myChart.chartArea.bottom);

        context.strokeStyle = strokeColor;

        context.stroke();

        context.closePath();

        context.moveTo(static_clientX, static_clientY);

        context.beginPath();

        context.arc(static_clientX, static_clientY, window.innerWidth / 110 > 10 ? window.innerWidth / 110 : 10, 0, 2 * Math.PI);

        context.fillStyle = strokeColor;

        context.fill();

        context.strokeStyle = 'rgba(0,0,0,0.8)';

        context.stroke();

        context.closePath();


        context.restore();

        context.save();

        const starting_pos = Math.min(this_position_x, static_clientX);

        const ending_pos = Math.max(this_position_x, static_clientX);

        context.beginPath();

        /*

        This is for drawing the green/red gradient rectangle effect

        It will only cover the distance between the original mousedown position and current mouseover (hover) position

        */


        context.fillStyle = return_horizontal_gradient(strokeColor, myChart.chartArea.top, myChart.chartArea.bottom);

        context.fillRect(starting_pos, myChart.chartArea.top, ending_pos - starting_pos, myChart.chartArea.height);

        context.closePath();

        context.restore();

        context.save();


        info_price.style.color = strokeColor;

        info_price.style.left = (starting_pos + ending_pos)/2 - info_price.offsetWidth/2 + canvas.getBoundingClientRect().left+ 'px';
        console.log(starting_pos,ending_pos)

     }


      info_price.style.visibility = 'visible';

      info_date.style.visibility = 'visible';

      if (isMouseDown || current_Index === valid_data_number - 1) return;


      if (left_position >= pos_X + myChart.chartArea.width / label_array.length * valid_data_number) {
        info_price.style.left = pos_X + myChart.chartArea.width / label_array.length * valid_data_number + "px"
      }

      info_price.style.left = clientX - info_price.offsetWidth / 2 + "px";
      

     /*

     Although window.getComputedStyle return a live object CSSStyleDeclaration, but its value is not live, 

     we need to redeclare the left_position after left_position changed

     */


      left_position = parseFloat(window.getComputedStyle(info_price).getPropertyValue('left'))

      if (left_position <= pos_X) 

        info_price.style.left = pos_X + "px"

      else if (left_position >= pos_X + myChart.chartArea.width / label_array.length * valid_data_number) 

        info_price.style.left = pos_X + myChart.chartArea.width / label_array.length * valid_data_number + "px"

    
    }

  }


  horizontalLine = {
    id: 'horizontalLine',
    afterDraw: function(chartInstance) {
      //Immediately return if horizontalLine doesn't register to the chart

     if (!chartInstance.options.horizontalLine) return;
        /* 

        we could assign several horizontalLine and loop over it to draw all of them

        but we know we will only have one horizontalLine

        horizontalLine[0] does the job

        */
      
        const line = chartInstance.options.horizontalLine[0];
        if (find_closed_price() > max_value + 0.15) line.y = max_value - 0.1;

        yValue = chartInstance.scales["y"].getPixelForValue(line.y);

        context.beginPath();

        context.setLineDash([5, 3]);
        context.lineWidth = window.innerHeight / 250

        context.moveTo(myChart.chartArea.left, yValue);

        context.lineTo(myChart.chartArea.right, yValue);

        context.strokeStyle = 'white';

        context.stroke();

        context.fillStyle = 'white';

        /*

        size_calculation return the calulated width and height for specific text

        This make sure the text will not overflow or too far away from the border even in different resoluation 

        */

        const fontSize = window.innerWidth / 100 * 1.25
        const size_1 = "Previous Price:".size_calculation(fontSize);
        //console.log(line.text)
        const size_2 = (line.text.toString()).size_calculation(fontSize);

        context.font = `${fontSize}px sans-serif`;
        context.fillText("Previous Price:", myChart.chartArea.right - size_1.width - fontSize / 1.5, yValue + size_1.height);

        context.fillText(line.text, myChart.chartArea.right - size_2.width - fontSize / 1.5, yValue + size_1.height + size_2.height);
        context.setLineDash([])
        context.restore();
        context.save()
        context.closePath()


    }

  };

  if (timestamp === "1min") Chart.register(horizontalLine);
  /*

  if previous chart existed

  destory the chart, clear canvas and draw new chart

  you could only draw one graph on a canvas in chart.js


  */


  if (myChart) myChart.destroy();

  myChart = new Chart(context, {
    type: 'line',
    data: {

       xLabels: label_array,
       datasets: [{
        label_array: 'stock price',
        data: dataset,
        fill: true,
        backgroundColor: return_vertical_linear_garident(false),
        pointHoverRadius: 0,
        hoverBackgroundColor: return_vertical_linear_garident(true),
        hoverBorderColor: hover_color,
        borderColor: return_color()
      }]
    },

    options: {
      
      /*

      Chart.js has a feature that will automatically resize the canvas to a specific ratio 

      when window resize event firing 

      but by using following code, we will be able to prevent this from happing 

      responsive: true,

      maintainAspectRatio: false

      */

      responsive: true,
      maintainAspectRatio: false,

      "horizontalLine": [{
        "y": find_closed_price() > min_value - 0.15 ? find_closed_price() : min_value - 0.1,
        "text": find_closed_price()
      }],
      legend: {
        display: false
      },

      interaction: {
        mode: 'index',
        intersect: false,

      },
      elements: {
        point: {
          radius: 0,
          pointHoverRadius: 5
        },
        line: {
          borderWidth: 3.5
        }
      },
      hover: {
        mode: 'dataset',
        intersect: false,

      },
      scales: {
        y: {
          grid: {
            color: gridline_color,
            borderColor: "rgba(255,255,255,0.65)",
            borderWidth: 2.5

          },
          ticks: {
            maxTicksLimit: 6,
            max: max_value + 0.15,
            min: min_value - 0.15,
            stepValue: ((max_value - min_value) / 5).toFixed(1),
            color: 'rgba(255,255,255,0.75)',
            font: {
              size: window.innerWidth / 100 * 1.5
            }

          }

        },

        x: {
          grid: {
            color: grid_color_array,
            borderColor: "rgba(255,255,255,0.65)",
            borderWidth: 2.5
          },
          ticks: {

            maxTicksLimit: label_array.length,

            color: 'rgba(255,255,255,0.75)',
            font: {
              size: window.innerWidth / 100 * 1.5
            },
            callback: function(value, index, values) {
              
              /* 

              will not going to draw the gridline when returning 1 day data or the current index is the last element in the label array

              return "" represents not drawing the gridline

              */

              if (timestamp !== "1min" && index === label_array.length - 1) return "";

              return grid_color_array[index] !== "transparent" ? this.getLabelForValue(value) : ""

            }
          }
        }

      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          yAlign: "bottom",
          backgroundColor: 'transparent',
          titleColor: 'transparent',
          displayColors: false,
          bodyColor: 'transparent',
          footerColor: 'transparent',
          callbacks: {
            label: function(tooltipItem) {
              current_Index = tooltipItem.dataIndex
              if (fire && first_index) current_Index = 0


              if (isMouseDown) {
                const current_value = dataset[current_Index];
                const previous_value = dataset[static_Index]
                const sign = (judge_color() === 'lawngreen' ? "+" : "-");
                //Already use white-space: pre-wrap for info_price and info_date so the white space will be significent and "       " will not be parse as " "
                info_price.innerHTML = sign + Math.abs(current_value - previous_value).toFixed(2) + "          " + sign + (Math.abs(current_value / previous_value - 1) * 100).toFixed(2) + '%'

                info_date.innerHTML = 'From <b>' + detail_dataset[Math.min(current_Index, static_Index)].date + '</b>   to   <b>' + detail_dataset[Math.max(current_Index, static_Index)].date + '</b>'
              } else {
                info_price.textContent = dataset[current_Index]
                info_date.textContent = detail_dataset[current_Index].date
              }

              return tooltipItem;
            }
          },
        }
      }
    },
    plugins: [annotation]

  })
  loader.style.display = "none"
  canvas.style.display = 'revert'


}


function retore_all_values(expected_content = 'Latest Price') {
  canvas.style.display = 'none'
  detail_dataset.length = 0;
  dataset.length = 0
  label_array.length = 0;

  //use Chart.unregister to remove the horizonalLine which shows previous price if timestamp is not '1min'
  if (timestamp !== '1min' && horizontalLine) Chart.unregister(horizontalLine);


  const matched_element = select('#price_name');

  if (matched_element) matched_element.innerHTML = expected_content + " (AS OF <span style='font-size:0.8em;'>" + new Date(global_time).toString().substring(4, 21) + " EDT" + '</span>)'

  //const matched_element = document.evaluate(`//span[text()='${search_content}']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  loader.style.display = "revert"
}

function restore_and_fetch(time_range_name, expected_content) {
  retore_all_values(expected_content)
  if (!all_fetch_data[time_range_name]) {
    fetch_data(symbol, timestamp).then(function(result) {
      all_fetch_data[time_range_name] = result
      raw_data = filter_data(result, parseInt(timestamp))
      format_data(difference_time)
      create_chart()

    })
  } else {
    raw_data = filter_data(all_fetch_data[time_range_name], parseInt(timestamp));
    console.log(raw_data);
    format_data(difference_time)
    create_chart()

  }

}




//Assign web worker to fetch the data 
function assign_web_worker_one() {
  //By using Blob, we are able to run web worker in a single script without putting it in a separate file 
  //Note that we are unable to use web worker in file type website in chrome 
  const blob = new Blob([
    select('#web_worker_one').textContent
  ], {
    type: "text/javascript"
  })

  const worker = new Worker(window.URL.createObjectURL(blob));
  worker.onmessage = function(e) {
    all_fetch_data["all_data"] = JSON.parse(e.data)

    if (isWaiting_one && button_being_clicked) {

      setTimeout(() => button_being_clicked.click(), 100);
      loader.style.display = 'none'

    }
    isWaiting_one = false;

  }
  //web worker no access to variable in main script, so we need to transfer it 
  worker.postMessage(symbol);
}





/*

*/



function setup(index) {
  //Prevent all buttons to be clicked
  let existed = false;
  for (let i = 0; i < my_watched_list.length; i++) {
    if (my_watched_list[i].index === index) {
      existed = true;
      break;
    }
  }
  if (!existed) {
    my_watched_button.style.display = 'revert'
    my_watched_buttontextContent = '+Add to Watchlist'
    my_watched_button.classList.remove('has_clicked')

  } else my_watched_button.style.display = 'none'

  selectAll('button').forEach(i => i.style.pointerEvents = 'none')
  select('#starting').style.display = 'none'
  parent_of_canvas.style.display = 'revert'

  retore_all_values("At Close")
  symbol = symbol_full_list[index]["0"]

  assign_web_worker_one(symbol)
  variable_name = "one_day"
  timestamp = "1min"
  //specify the date difference being used in the format function, for 1 day, it is 0, 1 week is 7, 1 month is 30....
  difference_time = 0
 fetch_data(symbol, timestamp).then(function(values) {


    all_fetch_data[variable_name] = values;


    raw_data = filter_data(values, parseInt(timestamp))
    format_data(difference_time)

    const price_element = select('#price')
    price_element.querySelector('#dollar').innerHTML = raw_data[raw_data.length - 1].close.toFixed(2);
    const difference = raw_data[raw_data.length - 1].close - find_closed_price();
    const percentage = price_element.querySelector('#percent');

    percentage.textContent = (return_color().includes('green') ? "+" : "-") + Math.abs(difference / find_closed_price() * 100).toFixed(2) + "%";
    percentage.style.color = return_color();
    info_price.textContent = find_closed_price();

    if (!select('#price_name')) {
      const created_span = document.createElement('div')
      created_span.style.color = 'grey';
      created_span.id = 'price_name'
      const shortened_date = new Date(global_time).toString().substring(4, 21) + "EDT"
      created_span.innerHTML = `At Close <span style='font-size:0.8em'>(AS OF ${shortened_date}) </span>`
      price_element.appendChild(created_span)
    }

    select('#name > h2').textContent = symbol_full_list[index]["0"]
    select("#name > h4").textContent = symbol_full_list[index]["1"]

    create_chart()
    selectAll('button').forEach(i => i.style.pointerEvents = 'auto')
  })
}



window.addEventListener('resize', function() {
  if (select('.warning')) return;


})

select('#one_day').addEventListener('click', function() {
  timestamp = '1min'
  difference_time = 0;
  variable_name = "one_day"
  restore_and_fetch(variable_name, "At Close")
})

select('#one_week').addEventListener('click', function() {
  timestamp = '5min'
  difference_time = 7
  variable_name = 'one_week'
  restore_and_fetch(variable_name)
})

select('#one_month').addEventListener('click', function() {
  timestamp = '30min'
  difference_time = 30
  variable_name = 'one_month'
  restore_and_fetch(variable_name)
})

select('#two_month').addEventListener('click', function() {
  timestamp = '1hour'

  difference_time = 60
  variable_name = 'two_month'
  //pass by parameter without diretly access  global variable variable_name reduce the run time a little bit since it takes more performance time for JS run search for a global variable
  restore_and_fetch(variable_name)
})


function buttons_click_function(event, parameter_list) {
 
  retore_all_values()
  timestamp = false;
  variable_name = 'all_data'
  if (isWaiting_one) {
    loader.style.display = 'revert'
    button_being_clicked = event.target
    return
  }
  raw_data = all_fetch_data[variable_name];
  console.log(raw_data);
  format_data_two(...parameter_list)
  create_chart()
}


select('#three_month').addEventListener('click', function(event) {
  difference_time = 3;
  buttons_click_function(event,[difference_time, false, 0]);
})

select("#six_month").addEventListener('click', function(event) {
  difference_time = 6
  buttons_click_function(event,[difference_time, false, 0])
})

select('#one_year').addEventListener('click', function(event) {
  difference_time = 1
  buttons_click_function(event, [difference_time, true, 2, 2])

})

select('#two_year').addEventListener('click', function(event) {
  difference_time = 2
  buttons_click_function(event, [difference_time, true, 4, 3])
})

select('#five_year').addEventListener('click', function(event) {
  difference_time = 5
  buttons_click_function(event, [difference_time, true, 0, 10, true])
})

select("#ten_year").addEventListener("click", function(event) {
  difference_time = 10
  buttons_click_function(event, [difference_time, true, 2, 20, true])
})

select('#all_time').addEventListener('click', function() {
  difference_time = 0
  buttons_click_function(event,[difference_time, true, 4, 30, true])
})


select('#add_to_watchlist').addEventListener('click', function(event) {

  if (!event.target.classList.contains('has_clicked')) {
    event.target.classList.add('has_clicked')
    event.target.innerHTML = '&#10004;Added'

    //select item with id starts with element_ and with class name active
    const index_of_stock = select(" div[id^='element_'].active").id.split('element_')[1]
    my_watched_list.push({
      index: index_of_stock,
      search_result: symbol_full_list[index_of_stock],
      date_added: global_time.toString().substring(4, 24)
    })

  } else {
    event.target.classList.remove('has_clicked')
    event.target.textContent = '+Add to Watchlist'
    my_watched_list = my_watched_list.filter(i => i['index'] !== select(" div[id^='element_'].active").id.split('element_')[1])

  }

})









