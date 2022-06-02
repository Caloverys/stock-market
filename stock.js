//Use , at the beginging before assigning variable, we are able to assign many const variable with one const keywords
const canvas = document.querySelector('#chart')
const context = canvas.getContext('2d')
, dataset = []
, detail_dataset = []
, info_price = document.querySelector('#info_price')
, info_date = document.querySelector('#info_date')
, parent_of_canvas = document.querySelector('#parent_of_canvas')
, input = document.querySelector('input[type=text]')
,loader = document.querySelector('.loader')
let current_Index = 0
let max_value, min_value, raw_data,  global_time, clientX, date_latest, myChart, isInsideCanvas, valid_data_number,timestamp,closed_price,isMouseDown,difference_time,variable_name;
let isVisible = true;
let [label, grid_color] = [[],[]]
let chartArea;

let all_fetch_data ={
  "one_day":null,
  "one_week":null,
  "one_month":null,
  "two_month":null,
  "three_month":null

}

document.querySelector('#deletebutton').addEventListener('click', () => {
  input.blur();
  input.value = ""
})
document.querySelector('#searchicon').addEventListener('click', () => {
  document.activeElement === input ? input.blur() : input.focus()
})


function getSymbol() {
  //return fetch("https://financialmodelingprep.com/api/v3/stock/list?apikey=c38b723e031c88753f0c9e66f505f557")
  // .then(res => res.json())

}

function fetchData(symbol, range) {

  return fetch(`https://financialmodelingprep.com/api/v3/historical-chart/${range}/${symbol.toUpperCase()}?apikey=c38b723e031c88753f0c9e66f505f557`)
    .then(res => res.json())

}
//only screenX works here, clientX doesn't work expected.
canvas.addEventListener('mousemove', e => {
  isInsideCanvas = isInCanvas(e.clientX, e.clientY)
  if (isInsideCanvas && isVisible) {
     clientX = e.clientX;
    info_price.style.visibility = 'visible'
    info_date.style.visibility = 'visible'

  } else {
    info_price.style.visibility = 'hidden'
    info_date.style.visibility = 'hidden'
  }

})

//Detect if the mouse is in the chart (not the whole canvas)
function isInCanvas(posX, posY) {

  if (!myChart) return false;
  const canvas_pos = canvas.getBoundingClientRect();
  return myChart.chartArea.left <= posX && posX <= myChart.chartArea.right + canvas_pos.left && myChart.chartArea.top  <= posY - canvas_pos.top && posY - canvas_pos.top <= myChart.chartArea.bottom;



}
canvas.addEventListener('mousedown',function(e){
   if(!isInsideCanvas) return;
   isMouseDown = true;


 
})
canvas.addEventListener('mouseup',function(){
   isMouseDown = false;
})
/*canvas.addEventListener('mousedown',function(){
})
canvas.addEventListener('mouseup',function(){
  
})
canvas.addEventListener('mouseenter',()=> isInCanvas = true )
canvas.addEventListener('mouseleave',()=> isInCanvas = false )*/


function format_date(dateobject) {
  return new Date(dateobject.substring(0, 4), dateobject.substring(5, 7)-1, dateobject.substring(8, 10), dateobject.substring(11, 13), dateobject.substring(14, 16), "00")
}


function format_data(difference) {
  date_latest = format_date(raw_data[raw_data.length - 1].date)
  const expected_end_date =  timestamp === '1min' ? new Date(date_latest.getFullYear(),date_latest.getMonth(),date_latest.getDate(),9,30) : new Date(global_time.getFullYear(),global_time.getMonth(),global_time.getDate()-difference,9,30) 
  raw_data.forEach((item, index) => {
  
    this.newdate = format_date(item.date);
   
    if (this.newdate >= expected_end_date) {

      label.push(this.newdate)
      detail_dataset.push(item)
      dataset.push(item.close.toFixed(2))
    }
  })



  valid_data_number = label.length 
  max_value = Math.max.apply(null, dataset)
  min_value = Math.min.apply(null, dataset)

 
  if(timestamp === '1min'){
    label =label.map(i=>new Date(i).getHours())
    if(return_market_status() ) fill_label_array_1min()
    
    label = label.map(i =>i + (i < 12 ? 'am' : 'pm'))
    grid_color = Array(label.length).fill("transparent")
    for (let i = 30/range; i < label.length; i += 60/range) grid_color[i] = "rgba(255,255,255,0.4)"

  }

  else if(timestamp === "5min"){
    label = label.map(i=>new Date(i).getDate())
    fill_label_array_5min()

    grid_color = Array(label.length).fill("transparent")
    
    for(let i= 0;i<label.length;i+=Math.ceil(79/range)) grid_color[i] = "rgba(255,255,255,0.4)"
          grid_color[grid_color.length -1] = "rgba(255,255,255,0.4)"
    
  }else if(timestamp === "30min"){
    let startingDate = new Date(label[0]).getDate()
    label = label.map(i=>{
      const label_date = new Date(i).getDate()
      if(label_date >= startingDate+7) startingDate = label_date
      return startingDate
    })
     grid_color = Array(label.length).fill("transparent");
    for(let i = 0;i<label.length;i+=70/range) grid_color[i] = "rgba(255,255,255,0.4)"
       grid_color[grid_color.length -1] = "rgba(255,255,255,0.4)"
    

  }else if(timestamp === '1hour'){
    //Use internationalization API to convert number of month to full name (e.g. 0=> January)
    let currentMonth = new Date(label[0]).toLocaleString("default", {month: 'long'});
    const passed_months = [];
    label = label.map((i,index)=>{
      const label_month = new Date(i).toLocaleString("default", {month: 'long'});
      if(label_month !== currentMonth){ 
        currentMonth = label_month
        passed_months.push(index)
      };
      return label_month

    })
      grid_color = Array(label.length).fill("transparent");
      //Sometimes there will not be enough (three) labels, so we could push the start month as well.
      if(passed_months.length < 3) passed_months.unshift(0)

       for(let i = 0;i<label.length;i++){
        if(passed_months.includes(i) ) 
          grid_color[i] = "rgba(255,255,255,0.4)"
       } 
       grid_color[grid_color.length -1] = "rgba(255,255,255,0.4)"



  }
    
   

}


function size_calculation(word, fontSize) {
  const div = document.body.appendChild(document.createElement('div'));
  div.textContent = word;
  div.style.cssText = `
  font-size:${fontSize}px;
  width:auto;
  position:absolute;
  visibility:hidden;
  `
  //object destrusturing: const {} = object; ES6 feature 
  const {width,height} =  window.getComputedStyle(div)

  div.remove();
  return ({
    width: parseFloat(width),
    height: parseFloat(height)
  })
}


function get_global_time() {
  //fetch the time from new york timezone 

  return fetch("https://worldtimeapi.org/api/timezone/america/new_york")
    .then(res => res.json())
    .then(raw_data => new Date(raw_data.datetime))
}


function fill_label_array_5min(){

  const expectedDate = new Date(date_latest.getFullYear(), date_latest.getMonth(), date_latest.getDate(), 16,0)

  const amountToAdd = (expectedDate - date_latest) / 1000 / 60 /5
  label.push.apply(label,Array(Math.ceil(amountToAdd/range)).fill(expectedDate.getDate()))

}
function fill_label_array_1min() {
  const expectedDate = new Date(date_latest.getFullYear(), date_latest.getMonth(), date_latest.getDate(), 15, 59)

  const amountToAdd = (expectedDate - date_latest) / 1000 / 60;

  //Add null dataset to array with numbers of minutes left to the close market which is 4 p.m.
  //first fill the label_array to full hour (60 min)
  label.push.apply(label, Array(Math.floor((59- date_latest.getMinutes())/range)).fill(date_latest.getHours()))
  for (let i = date_latest.getHours(); i < 16; i++) label.push.apply(label, Array(60/range).fill(i))
    //at last 16:00
    label.push(16)

}


function find_closed_price() {
   if (!closed_price) {
    for (let i = raw_data.length - 1; i >= 0; i--) {
      if (date_latest.getDate() !== format_date(raw_data[i].date).getDate())
        return raw_data[i].close;
    }
  }
  return closed_price

}

function return_color() {
  //raw_data[0].close give us latest/current stock price
  if(timestamp === '1min')
    return (raw_data[raw_data.length - 1].close >= find_closed_price() ? "lawngreen" : "red")
  else
    return dataset[0] <= dataset[dataset.length-1] ? "lawngreen" : "red"
}


function return_linearGarident(color) {
  const canvasHeight = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('height'))

  const gradient = context.createLinearGradient(0, 0, 0, canvasHeight)
  if (color) {
    gradient.addColorStop(0, "#52c4fa");
    gradient.addColorStop(0.3, "rgba(82,196,250,0.3)");
    gradient.addColorStop(0.3, "rgba(82,196,250,0.3)");
    gradient.addColorStop(1, 'transparent')

  } else if (return_color().includes("red")) {
    gradient.addColorStop(0, "rgba(255,0,0,0.8)");
    gradient.addColorStop(0.3, "rgba(255,0,0,0.3)");
    gradient.addColorStop(0.3, "rgba(255,0,0,0.3)");
     gradient.addColorStop(1, 'transparent')

    gradient.addColorStop(1, 'transparent')
  } else if (return_color().includes("green")) {
    gradient.addColorStop(0, "rgba(124,252,0,0.8)");
     gradient.addColorStop(0.3, "rgba(124,252,0,0.3)");
    gradient.addColorStop(0.3, "rgba(124,252,0,0.3)");
    gradient.addColorStop(1, 'transparent')
  }
  return gradient

}

function return_horizontal_gradient(color,pos_start,pos_end){
    const horizontal_Gradient = context.createLinearGradient(0,pos_start,0,pos_end)
    if(color === 'blue'){
      horizontal_Gradient.addColorStop(0, "rgba(82,196,250,0.3)");
   
    horizontal_Gradient.addColorStop(0.3, "rgba(82,196,250,0.1)");
    horizontal_Gradient.addColorStop(0.3, "rgba(82,196,250,0.15)");
    horizontal_Gradient.addColorStop(1, 'transparent')
  }
    else if(color === "red"){
    
   horizontal_Gradient.addColorStop(0, "rgba(255,0,0,0.3)");
    horizontal_Gradient.addColorStop(0.3, "rgba(255,0,0,0.1)");
   horizontal_Gradient.addColorStop(0.3, "rgba(255,0,0,0.15)");
     horizontal_Gradient.addColorStop(1, 'transparent')

  }else if(color === 'lawngreen'){
     horizontal_Gradient.addColorStop(0, "rgba(124,252,0,0.3)");
     horizontal_Gradient.addColorStop(0.3, "rgba(124,252,0,0.1)");
    horizontal_Gradient.addColorStop(0.3, "rgba(124,252,0,0.15)");
    horizontal_Gradient.addColorStop(1, 'transparent')

  }
    return horizontal_Gradient
}
 
function return_market_status() {
  //390 => 60 * 6 (from 9:30 to 16:00) + 30
  //return true if market open and return false if market close
  return (global_time.getHours() <= 16 && valid_data_number !== 390/range+1 && global_time.getDate() !== (5 || 6) ? true : false)


}

function filter_data(input_data,time_range){
   if(window.innerWidth > 1000) window.range = 1
    else if(window.innerWidth > 800) window.range = 2
    else if(window.innerWidth > 600) window.range = (timestamp !== `30min` ? 3 : 4)
    else if(window.innerWidth > 400) window.range = (timestamp === `${5 || 30}min` ? 6 : 5)
    else{
      parent_of_canvas.style.color ='white';
      parent_of_canvas.innerHTML =`
      <div style='font-size:1.5em;'>!Window size warning:!</div><br>
      <div>Your interior window size is 
      <span style='color:red'>${window.innerWidth}, ${window.innerHeight}</span>
       which is too small to load the graph </div>
      <div>Please switch to bigger interior </div>
      `

    }

    //filter data by range and sort data based on the date (newest date like 15:59 pm ) to the end 
    console.log(input_data)
    if(parseInt(timestamp) < 30 || range < 3){
  return input_data.sort(({
      date: a
    }, {
      date: b
    }) => a < b ? -1 : (a > b ? 1 : 0))
  .filter(i=> 
    format_date(i.date).getMinutes() % (range*time_range)  === 0
  )
}

 return input_data.sort(({
      date: a
    }, {
      date: b
    }) => a < b ? -1 : (a > b ? 1 : 0))
  .filter(i=> 
    format_date(i.date).getHours() % (range * time_range/60)  === 0 && format_date(i.date).getMinutes() === 0
  )

}
function judge_color(){

  if(current_Index ===static_Index) return "#52c4fa"
  else if(current_Index > static_Index) return dataset[current_Index] >= dataset[static_Index] ? "lawngreen" : "red"
    else return dataset[static_Index] >= dataset[current_Index] ? "lawngreen" : "red"
  
}

  



function create_chart() {

  let [first_index,final_index,static_clientX,static_clientY] = new Array(3).fill(null)
  window.static_Index = null
  const annotation = {
    id: 'annotationline',
    afterDraw: function(chart) {      
      if (!chart.tooltip._active.length || !isInsideCanvas) {
        info_price.style.visibility = 'hidden'
        info_date.style.visibility = 'hidden'
        isVisible = false;
        return;
      } else isVisible = true;
      info_price.style.color = "#52c4fa"


      let left_position = parseFloat(window.getComputedStyle(info_price, null)["left"])
      let this_position_x = chart.tooltip._active[0].element.x
      if (current_Index === detail_dataset.length - 1 && !final_index)
        final_index = this_position_x
      else if (current_Index === 0 && !first_index) first_index = this_position_x
       
       //Notice: do not remove following if statements for improving performance, the following if statement helps user reach the dataset[0] or dataset[dataset.length-1], without the line it will not be much too smooth and easy to reach it due to too many data points in the chart
        if(first_index && current_Index === 0 && left_position.toFixed(2) === (myChart.chartArea.left+window.innerWidth /100 * 1.5).toFixed(2)){
          this_position_x = first_index

        }

       else if (final_index && current_Index === dataset.length-1 && left_position.toFixed(2) === (myChart.chartArea.right - info_price.offsetWidth / 2).toFixed(2))
    
        this_position_x = final_index
    

      context.beginPath()
      context.strokeStyle = (!isMouseDown ?'#52c4fa' : judge_color());
      context.globalCompositeOperation = 'source-over'
    
      context.setLineDash([])

      context.moveTo(this_position_x, chart.chartArea.top);
      context.lineTo(this_position_x, chart.chartArea.bottom);
      context.lineWidth = context.lineWidth > 2.5 ? context.lineWidth : 2.5
      context.stroke();
      context.closePath();


      context.moveTo(this_position_x, chart.tooltip._active[0].element.y)

      context.beginPath()
      context.fillStyle = (!isMouseDown ?'#52c4fa' : judge_color());
      context.arc(this_position_x, chart.tooltip._active[0].element.y, window.innerWidth / 100 > 11 ? window.innerWidth / 100 : 11, 0, 2 * Math.PI);
      context.fill();
      context.strokeStyle = 'rgba(0,0,0,0.8)';
      context.stroke();
      context.closePath();
      /*
      The state saved by context.save() could only be restored only once.
      Every time you call save, all the current default properties of the context are pushed in this stack.
      Every time you call restore, the last state is popped out of the stack, and all its saved properties are set to the context.
      So we need to use context.restore followed by a context.save() in order by keep the customized property for further used.
      */

      context.restore()
      context.save()



      if(isMouseDown && static_clientX !== current_Index){

        if(!static_clientX){
        static_clientY =chart.tooltip._active[0].element.y;
        static_clientX = this_position_x
        static_Index = current_Index
      }
    

    context.beginPath();
 context.globalCompositeOperation ='source-over'

  context.moveTo(static_clientX,myChart.chartArea.top)
  context.lineTo(static_clientX,myChart.chartArea.bottom)
  context.strokeStyle = judge_color()
  context.stroke()
  context.closePath();
   context.moveTo(static_clientX, static_clientY)
  context.beginPath();
  context.arc(static_clientX, static_clientY, window.innerWidth / 100 > 11 ? window.innerWidth / 100 : 11, 0, 2 * Math.PI);
  context.fillStyle = judge_color()
   context.fill();
      context.strokeStyle = 'rgba(0,0,0,0.8)';
      context.stroke();
      context.closePath()
      context.restore();
      context.save()
      
      const bigger_Index = (current_Index > static_Index ? current_Index : static_Index)
      const smaller_Index = (current_Index > static_Index ? static_Index : current_Index)
      const starting_pos  = myChart.chartArea.width / label.length * smaller_Index + myChart.chartArea.left
      const ending_pos = myChart.chartArea.width / label.length * bigger_Index + myChart.chartArea.left
      context.beginPath()
      context.globalCompositeOperation = 'source-over'
      context.fillStyle = return_horizontal_gradient('blue',myChart.chartArea.top,myChart.chartArea.bottom)
      context.fillRect(myChart.chartArea.left,myChart.chartArea.top,starting_pos -myChart.chartArea.left,myChart.chartArea.height)
      context.fillStyle = return_horizontal_gradient(judge_color(),myChart.chartArea.top,myChart.chartArea.bottom)
      context.fillRect(starting_pos ,myChart.chartArea.top,ending_pos-starting_pos ,myChart.chartArea.height)
       context.fillStyle = return_horizontal_gradient('blue',myChart.chartArea.top,myChart.chartArea.bottom)
         context.fillRect(ending_pos,myChart.chartArea.top,myChart.chartArea.right-ending_pos,myChart.chartArea.bottom)
          context.closePath()
      context.restore();
      context.save()
        context.closePath()
        info_price.style.color=judge_color()
        info_price.style.left =(starting_pos+ending_pos)/2-info_price.offsetWidth/4+'px'



  }
    else{
      static_clientY = null;
      static_clientX = null;
      static_Index = null;
    } 

  
      
        info_price.style.visibility = 'visible'
      info_date.style.visibility = 'visible'
      
      if(isMouseDown) return;
      if (current_Index === valid_data_number - 1) return;
      info_price.style.left = clientX - info_price.offsetWidth / 2 + "px"
      left_position = parseFloat(window.getComputedStyle(info_price, null)["left"])
     
      if (left_position < myChart.chartArea.left + window.innerWidth / 100 * 1.5){
        info_price.style.left = myChart.chartArea.left + window.innerWidth / 100 * 1.5 + "px"

      } else if (left_position >= myChart.chartArea.left + myChart.chartArea.width / label.length * valid_data_number) {
        if(timestamp === '1min')
        info_price.style.left = myChart.chartArea.left + myChart.chartArea.width / label.length * valid_data_number + "px"

      } 
    

    }



  }


  window.horizonalLinePlugin = {
    id: 'horizontalLine',
    afterDraw: function(chartInstance) {


      //the plugins will always be called every time user hover over it. Use this.has_called to prevent calling after first call to save performance. Use this to access has_called in the object horizonalLinePlug
      const canvasWidth = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('width'))

      for (let index = 0; index < chartInstance.options.horizontalLine.length; index++) {
        const line = chartInstance.options.horizontalLine[index];
        if (find_closed_price() > max_value + 0.15) line.y = max_value - 0.1
         yValue = chartInstance.scales["y"].getPixelForValue(line.y) 
        context.beginPath()
        context.setLineDash([5, 3])
        context.lineWidth = window.innerHeight/250
        context.globalCompositeOperation = "source-over"
        context.moveTo(myChart.chartArea.left, yValue);
        context.lineTo(myChart.chartArea.right, yValue);
        context.strokeStyle = 'white';
        context.stroke();
        context.fillStyle = 'white';
        const fontSize = window.innerWidth / 100 * 1.25
        const size_1 = size_calculation("Previous Price:", fontSize);
        const size_2 = size_calculation(line.text, fontSize);
        context.font = `${fontSize}px sans-serif`;
        context.fillText("Previous Price:", myChart.chartArea.right - size_1.width - fontSize / 1.5, yValue + size_1.height);
        context.fillText(line.text, myChart.chartArea.right - size_2.width - fontSize / 1.5, yValue + size_1.height + size_2.height);
        context.restore();
        context.setLineDash([])
        context.save()
        context.closePath()

}
      

    }

  };
  if(timestamp === "1min") Chart.register(horizonalLinePlugin);
  //if previous chart existed, clear it and redraw new chart
  if(myChart) myChart.destroy();;
  myChart = new Chart(context, {
    type: 'line',
    data: {
      xLabels: label,
      datasets: [{
      label: 'stock price',
        data: dataset,
        fill: true,
        backgroundColor: return_linearGarident(),
        pointHoverRadius: 0,
        hoverBackgroundColor:return_linearGarident('color'),
        hoverBorderColor:"rgba(82,196,250,0.8)",     
        borderColor: return_color()
        }]
    },
    options: {

      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false
      },

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
            color: 'rgba(255,255,255,0.4)',
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
            color: grid_color,
            borderColor: "rgba(255,255,255,0.65)",
            borderWidth: 2.5
          },
          ticks: {
            //get number of unqiue item in y label
            maxTicksLimit: label.length,
            color: 'rgba(255,255,255,0.75)',
            font: {
              size: window.innerWidth / 100 * 1.5
            },
            callback: function(value, index, values) {  
            if(timestamp !== "1min" && index ===label.length-1)  return ""  
              return grid_color[index] !== "transparent" ? this.getLabelForValue(value) : ""

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

              if(isMouseDown){
                 const current_value =dataset[current_Index];
              const previous_value = dataset[static_Index]
              const sign = (judge_color() ==='lawngreen' ? "+" : "-")
              //Already use white-space: pre-wrap for info_price and info_date so the white space will be significent and "       " will not be parse as " "
                info_price.innerHTML = sign+ Math.abs(current_value - previous_value).toFixed(2) +"          " +sign+(Math.abs(current_value/previous_value -1)*100).toFixed(2)+'%'

                info_date.textContent ='From ' + detail_dataset[Math.min(current_Index,static_Index)].date +'   to   '+detail_dataset[Math.max(current_Index,static_Index)].date 
              } 
              else {
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
  loader.style.display ="none"
  chartArea=myChart.chartArea;
   canvas.style.display = 'revert'

}


function restore_and_fetch(time_range_name,restore_only,search_content = 'At Close',expected_content = 'Latest Price'){
  canvas.style.display = 'none'
  detail_dataset.length = 0;
  dataset.length = 0
  label.length = 0;

  //use Chart.unregister to remove the horizonalLine which shows previous price if timestamp is not '1min'
   if(timestamp !== '1min') Chart.unregister(horizonalLinePlugin);
     
    //use XML here to search for html tag by content
  const matched_element = document.evaluate(`//span[text()='${search_content}']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if(matched_element) matched_element.textContent = expected_content
  
    loader.style.display ="revert"
  if(restore_only=== true)  return;
  


    if(!all_fetch_data[time_range_name]){
    fetchData(symbol,timestamp).then(function(result){
    all_fetch_data[time_range_name] = result
    raw_data = filter_data(result,parseInt(timestamp))
    format_data(difference_time)
    create_chart()

  })
  }else{
    
    raw_data = filter_data(all_fetch_data[time_range_name],parseInt(timestamp))
    format_data(difference_time)
    create_chart()

  }

}
let worker;
function startWorker(){
 if(!worker) worker = new Worker('fetch_data_worker.js')
  worker.onmessage = function(event){
    console.log(event.data)
  }
  worker.postMessage('hola')
}



window.onload = function() {
  window.symbol = "FB"
  timestamp = "1min"
  difference_time = 0
  Promise.all([get_global_time(), fetchData(symbol, timestamp), getSymbol()]).then(function(values) {
      //specify the date difference being used in the format function, for 1 day, it is 0, 1 week is 7, 1 month is 30....


    global_time = new Date(values[0])
    variable_name = "one_day"
    all_fetch_data[variable_name] = values[1]
   raw_data = filter_data( values[1],parseInt(timestamp))
    format_data(difference_time)
     const price_element = document.querySelector('#price')
    price_element.querySelector('#dollar').innerHTML = raw_data[raw_data.length - 1].close.toFixed(2);
     const difference = raw_data[raw_data.length - 1].close - find_closed_price();
    const percentage = price_element.querySelector('#percent');
   percentage.textContent = (return_color().includes('green') ? "+" : "-") + Math.abs(difference / find_closed_price() * 100).toFixed(2) + "%";
    percentage.style.color = return_color();
    info_price.textContent = find_closed_price();
    const created_span = document.createElement('span')
    created_span.style.color ='grey';
    created_span.textContent ='At Close'
    price_element.appendChild(created_span)
   
  
    
    create_chart()
    var blob = new Blob([
    document.querySelector('#worker1').textContent
  ], { type: "text/javascript" })

  // Note: window.webkitURL.createObjectURL() in Chrome 10+.
  var worker = new Worker(window.URL.createObjectURL(blob));
  worker.onmessage = function(e) {
    console.log("Received: " + e.data);
  }
  worker.postMessage("hello"); // Start the worker.()


      //Note that we should only change the default value for canvas after the chart is successfully created, otherwise, the default value I set will be overwritten by chart.js when it creating the graph.
      context.strokeStyle = '#52c4fa';
          context.fillStyle = "#52c4fa";
          context.setLineDash([])
          context.strokeStyle = '#52c4fa'
          context.lineWidth = window.innerWidth / 500 > 2.5 ? window.innerWidth /500 : 2.5
          context.globalCompositeOperation = 'destination-over'
          context.save()

   

  })




}
window.addEventListener('resize', function() {
  if(document.querySelector('.warning')) return;

  const warning = document.createElement('div');
   const button_style = `
  color:rgba(0,0,200,0.8);
border:none; 
background:none;
text-decoration:underline;
font-size:0.8em`
  warning.innerHTML = `
  <div style='position:absolute;left:1vw;">
  <span style='font-weight:900;font-size:1.3em'>⚠</span>
  Warning: 
  </div>
  <span style='font-weight:500; color:rgba(0,0,0,0.8); font-size:0.9em'>Window get resized</span>  
  <a style='text-decoration:underline; font-style:italic; font-weight:500;font-size:0.5em;color:darkblue; margin-left:5px;margin-top:5px;'>Learn more</a>
  <button class='resize_button' style='${button_style};position:fixed; right:10%;'>Resize</button>
  <button class='remove_button' style='position:fixed; right:3%;'></button>
  `
  warning.className='warning'
  
  const remove_button =  warning.querySelector('.remove_button')
 remove_button.addEventListener('click',()=>{
  warning.classList.add('remove_class')
  setTimeout(()=> warning.remove(),1500)
})


 warning.querySelector('.resize_button').addEventListener('click',function(){
 restore_and_fetch("")
 all_fetch_data
   raw_data =filter_data(all_fetch_data[variable_name],parseInt(timestamp))
    format_data(difference_time)
  create_chart()
  warning.remove()
 })
document.body.appendChild(warning)




})

document.querySelector('#one_day').addEventListener('click',function(){
  timestamp = '1min'
   difference_time = 0;
   variable_name ="one_day"

    restore_and_fetch(variable_name,"Latest value","At Close")
})

document.querySelector('#one_week').addEventListener('click',function(){
  timestamp = '5min'
  difference_time = 7
  variable_name = 'one_week'

  restore_and_fetch(variable_name)
})

document.querySelector('#one_month').addEventListener('click',function(){
  timestamp = '30min'
  difference_time = 30
  variable_name = 'one_month'
  restore_and_fetch(variable_name)
  
})

document.querySelector('#two_month').addEventListener('click',function(){
  timestamp = '1hour'

  difference_time = 60
  variable_name = 'two_month'
  //pass by parameter without diretly access  global variable variable_name reduce the run time a little bit since it takes more performance time for JS run search for a global variable
  restore_and_fetch(variable_name)
})

document.querySelector('#three_month').addEventListener('click',function(){

})
document.querySelector("#six_month").addEventListener('click',function(){
  timestamp = ''

})















