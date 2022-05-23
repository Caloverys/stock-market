//Use , at the beginging before assigning variable, we are able to assign many const variable with one const keywords
const canvas = document.querySelector('#chart')
,context = canvas.getContext('2d')
,dataset = []
,detail_dataset = []
,info_price = document.querySelector('#info_price')
,info_date= document.querySelector('#info_date')
,parent_of_canvas = document.querySelector('#parent_of_canvas')
,input = document.querySelector('input[type=text]')
let lastIndex = 0
let max_value, min_value, raw_data, time_current, clientX, date_latest,closed_price,myChart;
let isappearing =false;

let [label,grid_color] = [[],[]]
document.querySelector('#deletebutton').addEventListener('click',() =>{
    input.blur();
    input.value = ""
})
document.querySelector('#searchicon').addEventListener('click',() =>{
document.activeElement === input ? input.blur() : input.focus()
})


function getSymbol(){
  /*return fetch("https://financialmodelingprep.com/api/v3/financial-statement-symbol-lists?apikey=c38b723e031c88753f0c9e66f505f557")
  .then(res => res.json())*/

}
function fetchData(symbol,range) {
  console.log(symbol)

  return fetch(`https://financialmodelingprep.com/api/v3/historical-chart/${range}min/${symbol.toUpperCase()}?apikey=c38b723e031c88753f0c9e66f505f557`)
    .then(res => res.json())

}
//only screenX works here, clientX doesn't work expected.
document.addEventListener('mousemove', e =>{
  //console.log(1)
  //console.log(isInCanvas(e.clientX,e.clientY))

  if(isInCanvas(e.clientX,e.clientY)){
    clientX = e.clientX;
    info_price.style.visibility = 'visible'
     info_date.style.visibility ='visible'

  }
        else{
          console.log( myChart.chartArea,e.clientX,e.clientY,window.getComputedStyle(parent_of_canvas)['top'])
        info_price.style.visibility ='hidden'
        info_date.style.visibility ='hidden'
    }

})

   function isInCanvas(posX,posY){

    const canvas_x = canvas.getBoundingClientRect().top
    if(myChart)
    return myChart.chartArea.left<= posX && posX <= myChart.chartArea.right  && myChart.chartArea.top <= posY + canvas_x && posY <= myChart.chartArea.bottom + canvas_x; 
  return true
   }
/*canvas.addEventListener('mousedown',function(){

})
canvas.addEventListener('mouseup',function(){
  
})
canvas.addEventListener('mouseenter',()=> isInCanvas = true )
canvas.addEventListener('mouseleave',()=> isInCanvas = false )*/


function format_date(dateobject){
  return new Date(dateobject.substring(0,4), dateobject.substring(5,7),dateobject.substring(8,10),dateobject.substring(11,13),dateobject.substring(14,16),"00")
}

function format_data() {
  date_latest = format_date(raw_data[raw_data.length - 1].date)
  console.log(date_latest.getDate())
  raw_data.forEach((item, index) => {
      this.newdate = format_date(item.date);
      if (date_latest.getDate() === this.newdate.getDate()) {
        label.push(this.newdate.getHours()+(this.newdate.getHours() < 12 ? 'am' : 'pm'))
        detail_dataset.push(item)
        dataset.push(item.close.toFixed(2))
      }
    })
     fill_label_array()
      max_value = Math.max.apply(null, dataset)
  min_value = Math.min.apply(null, dataset)
  grid_color = Array(label.length).fill("transparent")
  for(let i =30;i<label.length;i+=60) grid_color[i] = "rgba(255,255,255,0.4)"

  }
 

function size_calculation(word,fontSize) {
  const div = document.body.appendChild(document.createElement('div'));
  div.textContent = word;
  div.style.cssText = `
  font-size:${fontSize}px;
  width:auto;
  position:absolute;
  visibility:hidden;
  `

  const width = parseFloat(window.getComputedStyle(div).getPropertyValue('width'))
  const height = parseFloat(window.getComputedStyle(div).getPropertyValue('height'))

  div.remove();
  return ({
   width:width,
   height:height
  })
}


function get_global_time() {
  return fetch("https://worldtimeapi.org/api/timezone/Europe/London")
    .then(res => res.json())
    .then(raw_data => new Date(raw_data.datetime))
}


function fill_label_array() {
  const expectedDate = new Date(date_latest.getFullYear(), date_latest.getMonth(), date_latest.getDate(), 15,59)

 //Note that for expectedDate, the time we set is 15:59, but the date_latest is 16:00, so we need add 1 minute (60000) here for comparision
  if (date_latest.valueOf() === new Date(expectedDate.getTime()+60000).valueOf()) return;

  const amountToAdd = (expectedDate - date_latest) / 1000 / 60;

//Add null dataset to array with numbers of minutes left to the close market which is 4 p.m.
 if (amountToAdd > 0) raw_data.push.apply(raw_data, Array(amountToAdd).fill(null)) 
  label.push.apply(label, Array(59 - date_latest.getMinutes()).fill(date_latest.getHours()))
  for (let i = date_latest.getHours(); i < 16; i++) label.push.apply(label, Array(60).fill(i))

   

}

function find_closed_price() {
  if(!closed_price){
  for (let i = raw_data.length - 1; i >= 0; i--) {
     if (date_latest.getDate() != format_date(raw_data[i].date).getDate())
      return raw_data[i].close;
 }
}
return closed_price


}

function return_color() {
  //raw_data[0].close give us latest/current stock price
  return (detail_dataset[0].close >= find_closed_price() ? "lawngreen" : "red")
}


function return_linearGarident(color) {
  const canvasHeight = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('height'))
  const gradient = context.createLinearGradient(0, 0, 0, canvasHeight)
  if (color) {
    gradient.addColorStop(0, "#52c4fa");
    gradient.addColorStop(0.5, "rgba(82,196,250,0.3)");
    gradient.addColorStop(1, 'transparent')

  } else if (return_color().includes("red")) {
    gradient.addColorStop(0, "rgba(255,0,0,0.8)");
    gradient.addColorStop(0.5, "rgba(255,0,0,0.3)");
    gradient.addColorStop(1, 'transparent')
  } else if (return_color().includes("green")) {
    gradient.addColorStop(0, "rgba(0,255,0,0.8)");
    gradient.addColorStop(0.5, "rgba(0,255,0,0.3)");
    gradient.addColorStop(1, 'transparent')
  }
  return gradient

}
function create_chart() {
    let [first_index,final_index] = new Array(2).fill(null)
  const annotation = {
    id: 'annotationline',
    afterDraw: function(chart) {
            console.log(2)
      if (!chart.tooltip._active || !chart.tooltip._active.length || window.getComputedStyle(info_price)["visibility"] === "hidden") {
        isappearing = false
        return;
      };


      let left_position  = parseFloat(window.getComputedStyle(info_price,null)["left"])
       let this_position_x = chart.tooltip._active[0].element.x
      isappearing = true;
        if(lastIndex === detail_dataset.length -1 && !final_index)
          final_index= this_position_x
        else if(lastIndex === 0  && !first_index) first_index = this_position_x
        
        if(!isInCanvas(chart.tooltip._active[0].element.x,chart.tooltip._active[0].element.y))
          this_position_x = -999
        else if(first_index && left_position.toFixed(2) === (myChart.chartArea.left+window.innerWidth /100 * 1.5).toFixed(2))
          this_position_x = first_index

        else if(final_index && left_position.toFixed(2) === (myChart.chartArea.right-info_price.offsetWidth/2).toFixed(2))
          this_position_x = final_index
        
        context.beginPath()
        context.setLineDash([])
        context.moveTo(this_position_x, chart.chartArea.top);
        context.lineTo(this_position_x, chart.chartArea.bottom);
        context.lineWidth = 2.5;
        context.strokeStyle = '#52c4fa';
        context.stroke();
        context.restore();
        context.moveTo(this_position_x, chart.tooltip._active[0].element.y)
        context.globalCompositeOperation = 'destination-over';
        context.arc(this_position_x, chart.tooltip._active[0].element.y, 12.5, 0, 2 * Math.PI)
        context.fillStyle = '#52c4fa';
        context.fill()
        context.closePath()

        info_price.style.visibility = 'visible'
        info_date.style.visibility = 'visible' 


         info_price.style.left = clientX - info_price.offsetWidth/2+ "px"
        left_position = parseFloat(window.getComputedStyle(info_price,null)["left"])
        if(left_position <  myChart.chartArea.left+window.innerWidth /100 * 1.5)
         info_price.style.left = myChart.chartArea.left+window.innerWidth /100 * 1.5 +"px" 
  
         else if(left_position +info_price.offsetWidth/2 > myChart.chartArea.right) 
          info_price.style.left = myChart.chartArea.right-info_price.offsetWidth/2 +"px"
          
       }
      
    
  }
  let horizonalLinePlugin = {
    id: 'horizontalLine',
   afterDraw: function(chartInstance){
      const yScale = chartInstance.scales["y"];
      const canvasWidth = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('width'))
      if (chartInstance.options.horizontalLine) return;
        for (let index = 0; index < chartInstance.options.horizontalLine.length; index++) {
          const line = chartInstance.options.horizontalLine[index];
          const style = 'white'
          if(find_closed_price() > max_value + 0.15) line.y = max_value -0.1
          line.y ? yValue = yScale.getPixelForValue(line.y) : yValue = 20;
          context.lineWidth = 3;
          context.beginPath()
            context.setLineDash([5, 3])
            context.globalCompositeOperation="source-over"
            context.moveTo(myChart.chartArea.left+window.innerWidth / 100 * 1.5-info_price.offsetWidth/2, yValue);
            context.lineTo(myChart.chartArea.right, yValue);
            context.strokeStyle = 'white';
            context.stroke();
            context.fillStyle = 'white';
            const fontSize = window.innerWidth/100 * 1.25
            const size_1 = size_calculation("Previous Price:",fontSize);
            const size_2 = size_calculation(line.text,fontSize);
            context.font = `${fontSize}px sans-serif`;
            context.fillText("Previous Price:", myChart.chartArea.right-size_1.width-fontSize/1.5, yValue +size_1.height);

            context.fillText(line.text, myChart.chartArea.right-size_2.width-fontSize/1.5, yValue +size_1.height + size_2.height);
            context.setLineDash([])
            context.globalCompositeOperation="destination-over"
            context.closePath()


      }
    }
  };
  Chart.register(horizonalLinePlugin);
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
        hoverBackgroundColor: return_linearGarident('color'),
        hoverBorderColor: "rgba(82,196,250,0.8)",
        borderColor: return_color(),   
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false
      },
      hover: {
        mode: null
      },
      "horizontalLine": [{
        "y":find_closed_price() > min_value - 0.15 ? find_closed_price() : min_value - 0.1, 
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
            borderColor:"rgba(255,255,255,0.65)",
            borderWidth:2.5

          },
          ticks: {
            maxTicksLimit: 6,
            max: max_value + 0.15,
            min:min_value - 0.15,
            stepValue: ((max_value - min_value) / 5).toFixed(1),
            color:'rgba(255,255,255,0.75)',
            font:{
              size:window.innerWidth /100 * 1.5
            }

          }

        },

        x: {
          grid: {
            color: grid_color,
           borderColor:"rgba(255,255,255,0.65)",
           borderWidth:2.5
          },
          ticks: {
            //get number of unqiue item in y label
           maxTicksLimit: label.length,
            color:'rgba(255,255,255,0.75)',
            font:{
              size:14
            },
            callback: function(value, index, values) {
              const label = this.getLabelForValue(value);
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
              info_price.textContent = tooltipItem.raw 
              info_date.textContent =  detail_dataset[tooltipItem.dataIndex].date
              lastIndex = tooltipItem.dataIndex;
              return tooltipItem;
            }
          },
        }
      }
    },
    plugins: [annotation]

  });
document.querySelector("#test").style.left = myChart.chartArea.right+'px'
}

window.onload = function() {

  Promise.all([get_global_time(), fetchData("AAPL",1),getSymbol()]).then(function(values) {
    console.log(performance.now())

    time_current = new Date(values[0])
    //Convert data to array and sort data based on the date (newest date like 15:59 pm ) to the end 
  raw_data = values[1].sort(({date: a}, {date: b}) => a < b ? -1 : (a > b ? 1 : 0))
   document.querySelector('#dollar').textContent = raw_data[raw_data.length-1].close.toFixed(2)

    format_data()
      const difference = raw_data[raw_data.length-1].close - find_closed_price();
    const percentage = document.querySelector('#percent');
  percentage.textContent =(return_color().includes('green') ? "+" : "-") + Math.abs(difference / find_closed_price()*100).toFixed(2)+ "%";
  percentage.style.color = return_color();
  info_price.textContent =  find_closed_price();
    create_chart()
  })
}
