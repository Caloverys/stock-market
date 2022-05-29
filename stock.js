//Use , at the beginging before assigning variable, we are able to assign many const variable with one const keywords
const canvas = document.querySelector('canvas')
,context = canvas.getContext('2d')
, dataset = []
, detail_dataset = []
, info_price = document.querySelector('#info_price')
, info_date = document.querySelector('#info_date')
//, parent_of_canvas = document.querySelector('#parent_of_canvas'),
, input = document.querySelector('input[type=text]')
let lastIndex = 0
let max_value, min_value, raw_data, global_time, clientX, date_latest, closed_price, myChart, isInsideCanvas, valid_data_number;
let isVisible = true;
let [label, grid_color] = [[],[]]



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

  return fetch(`https://financialmodelingprep.com/api/v3/historical-chart/${range}min/${symbol.toUpperCase()}?apikey=c38b723e031c88753f0c9e66f505f557`)
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

function isInCanvas(posX, posY) {
  if (!myChart) return true;
  const canvas_pos = canvas.getBoundingClientRect();
  return myChart.chartArea.left <= posX && posX <= myChart.chartArea.right + canvas_pos.left && myChart.chartArea.top <= posY - canvas_pos.top && posY - canvas_pos.top <= myChart.chartArea.bottom;



}
/*canvas.addEventListener('mousedown',function(){

})
canvas.addEventListener('mouseup',function(){
  
})
canvas.addEventListener('mouseenter',()=> isInCanvas = true )
canvas.addEventListener('mouseleave',()=> isInCanvas = false )*/


function format_date(dateobject) {
  return new Date(dateobject.substring(0, 4), dateobject.substring(5, 7), dateobject.substring(8, 10), dateobject.substring(11, 13), dateobject.substring(14, 16), "00")
}


function format_data() {
  date_latest = format_date(raw_data[raw_data.length - 1].date)
  raw_data.forEach((item, index) => {
    this.newdate = format_date(item.date);
    if (date_latest.getDate() === this.newdate.getDate()) {
      label.push(this.newdate.getHours())
      detail_dataset.push(item)
      dataset.push(item.close.toFixed(2))
    }
  })
  valid_data_number = label.length
  fill_label_array()
  label = label.map(i => i < 12 ? `${i}am` : `${i}pm`)
  max_value = Math.max.apply(null, dataset)
  min_value = Math.min.apply(null, dataset)
  grid_color = Array(label.length).fill("transparent")
   for (let i = 30/range; i < label.length; i += 60/range) grid_color[i] = "rgba(255,255,255,0.4)"

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

  return fetch("http://worldtimeapi.org/api/timezone/america/new_york")
    .then(res => res.json())
    .then(raw_data => new Date(raw_data.datetime))
}


function fill_label_array() {
  const expectedDate = new Date(date_latest.getFullYear(), date_latest.getMonth(), date_latest.getDate(), 15, 59)

  if(!return_market_status()) return

  const amountToAdd = (expectedDate - date_latest) / 1000 / 60;

  //Add null dataset to array with numbers of minutes left to the close market which is 4 p.m.
  //first fill the label_array to full hour (60 min)
  label.push.apply(label, Array(Math.floor((59- date_latest.getMinutes())/range)).fill(date_latest.getHours()))

  for (let i = date_latest.getHours(); i < 16; i++) label.push.apply(label, Array(60/range).fill(i))

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
  return (raw_data[raw_data.length - 1].close >= find_closed_price() ? "lawngreen" : "red")
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

function return_market_status() {
  //390 => 60 * 6 (from 9:30 to 16:00) + 30
  //return true if market open and return false if market close
  return (global_time.getHours() <= 16 && valid_data_number !== 390/range+1 && global_time.getDate() !== (5 || 6) ? true : false)


}

function filter_data(input_data){
   if(window.innerWidth > 1000) window.range = 1
    else if(window.innerWidth > 800) window.range = 2
    else if(window.innerWidth > 600) window.range = 3
    else if(window.innerWidth > 400) window.range = 5

    //filter data by range and sort data based on the date (newest date like 15:59 pm ) to the end 
  return input_data.filter(i=> 
    format_date(i.date).getMinutes() % range === 0
  ).sort(({
      date: a
    }, {
      date: b
    }) => a < b ? -1 : (a > b ? 1 : 0))
}
function create_chart() {
  let [first_index, final_index] = new Array(2).fill(null)
  const annotation = {
    id: 'annotationline',
    afterDraw: function(chart) {
      if (!chart.tooltip._active.length || !isInsideCanvas) {
        info_price.style.visibility = 'hidden'
        info_date.style.visibility = 'hidden'
        isVisible = false;
        return;
      } else isVisible = true;
      
      let left_position = parseFloat(window.getComputedStyle(info_price, null)["left"])
      let this_position_x = chart.tooltip._active[0].element.x
      if (lastIndex === detail_dataset.length - 1 && !final_index)
        final_index = this_position_x
      else if (lastIndex === 0 && !first_index) first_index = this_position_x

      if (final_index && left_position.toFixed(2) === (myChart.chartArea.right - info_price.offsetWidth / 2).toFixed(2))
        this_position_x = final_index

      context.beginPath()
      context.strokeStyle = '#52c4fa';
      context.globalCompositeOperation = 'source-over'
    
      context.setLineDash([])

      context.moveTo(this_position_x, chart.chartArea.top);
      context.lineTo(this_position_x, chart.chartArea.bottom);
      context.lineWidth = context.lineWidth > 2.5 ? context.lineWidth : 2.5
      context.stroke();
      context.closePath();
      context.moveTo(this_position_x, chart.tooltip._active[0].element.y)

      context.beginPath()
      context.fillStyle = "#52c4fa";
      context.arc(this_position_x, chart.tooltip._active[0].element.y, window.innerWidth / 100 > 11 ? window.innerWidth / 100 : 11, 0, 2 * Math.PI);
      context.closePath();
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

      info_price.style.visibility = 'visible'
      info_date.style.visibility = 'visible'
      if (lastIndex === valid_data_number - 1) return;
      let info_width;
      return_market_status() ? info_width = info_price.offsetWidth / 2 : info_width = 0;
      info_price.style.left = clientX - info_price.offsetWidth / 2 + "px"
      left_position = parseFloat(window.getComputedStyle(info_price, null)["left"])
      if (left_position < myChart.chartArea.left + window.innerWidth / 100 * 1.5){
        info_price.style.left = myChart.chartArea.left + window.innerWidth / 100 * 1.5 + "px"

      }

      else if (left_position > myChart.chartArea.left + myChart.chartArea.width / (390/range +1) * valid_data_number) 
        info_price.style.left = myChart.chartArea.left + myChart.chartArea.width / (390/range +1) * valid_data_number + info_width + "px"
      




    }


  }
  let horizonalLinePlugin = {
    id: 'horizontalLine',
    has_called: false,
    afterDraw: function(chartInstance) {
      //the plugins will always be called every time user hover over it. Use this.has_called to prevent calling after first call to save performance. Use this to access has_called in the object horizonalLinePlugin 
     if(this.has_called) return;
      const canvasWidth = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('width'))

      for (let index = 0; index < chartInstance.options.horizontalLine.length; index++) {
        this.has_called = true;
        const line = chartInstance.options.horizontalLine[index];
        if (find_closed_price() > max_value + 0.15) line.y = max_value - 0.1
        line.y ? yValue = chartInstance.scales["y"].getPixelForValue(line.y) : yValue = 20;
        context.beginPath()
        context.setLineDash([5, 3])
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
        context.save()
        context.setLineDash([])
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
        borderColor: return_color()
      }]
    },
    options: {

      animation: {
        onComplete: function() {

        }
      },
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
              info_date.textContent = detail_dataset[tooltipItem.dataIndex].date
              lastIndex = tooltipItem.dataIndex;
              return tooltipItem;
            }
          },
        }
      }
    },
    plugins: [annotation]

  });

}

window.onload = function() {
  Promise.all([get_global_time(), fetchData("FB", 1), getSymbol()]).then(function(values) {


    global_time = new Date(values[0])

   
    const price_element = document.querySelector('#price')
    price_element.querySelector('#dollar').innerHTML = raw_data[raw_data.length - 1].close.toFixed(2)


    format_data()
   
    const difference = raw_data[raw_data.length - 1].close - find_closed_price();
    const percentage = price_element.querySelector('#percent');
   percentage.textContent = (return_color().includes('green') ? "+" : "-") + Math.abs(difference / find_closed_price() * 100).toFixed(2) + "%";
    percentage.style.color = return_color();
    info_price.textContent = find_closed_price();
    if(!return_market_status()){
    const created_span = document.createElement('span')
    created_span.style.color ='grey';
    created_span.textContent ='At Close'
    price_element.appendChild(created_span)
  }
    
    create_chart()

      //Note that we should only change the default value for canvas after the chart is successfully created, otherwise, the default value I set will be overwritten by chart.js when it creating the graph.
      context.strokeStyle = '#52c4fa';
          context.fillStyle = "#52c4fa";
          context.setLineDash([])
          context.strokeStyle = '#52c4fa'
          context.lineWidth = window.innerWidth / 500 > 2.5 ? window.innerWidth /500 : 2.5
          context.globalCompositeOperation = 'destination-over'
          context.save()

    //Due to the isInsideCanvas and isInCanvas will always be true, the info_price will be visible when graph is created, so we need to set "visibility:hidden" here to hide it
    info_price.style.visibility = 'hidden'
      document.querySelector('.loader').remove()

  })




}
window.addEventListener('resize', function() {
  if(document.querySelector('.warning')) return
  const warning = document.createElement('div');
   const button_style = `
  color:rgba(0,0,200,0.8);
border:none; 
background:none;
text-decoration:underline;
font-size:0.8em`
  warning.innerHTML = `
  <span style='font-weight:900;margin-left:5px;font-size:1.3em'>⚠</span>
  Warning: 
  <span style='font-weight:500; color:rgba(0,0,0,0.8); font-size:0.9em'>Window get resized</span>  
  <a style='text-decoration:underline; font-style:italic; font-weight:500;font-size:0.5em;color:darkblue; margin-left:5px;margin-top:5px;'>Learn more</a>
  <button class='resize_button' style='${button_style};position:fixed; right:10%;'>Resize</button>
  <button class='remove_button' style='position:fixed; right:3%;'></button>

  `
  warning.className='warning'
  
  const remove_button =  warning.querySelector('.remove_button')
 remove_button.addEventListener('click',()=>warning.classList.add('remove_class'))
 remove_button.addEventListener('transitionend',()=>warning.remove())
 warning.querySelector('.resize_button').addEventListener('click',function(){
   ra
  create_chart()
 })
document.body.appendChild(warning)




})
