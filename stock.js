//Use , at the beginging before assigning variable, we are able to assign many const variable with one const keywords
const canvas = document.querySelector('#chart')
,windowWidth = window.innerHeight
,windowHeight = window.innerWidth
,ctx = document.querySelector('#chart').getContext('2d')
,canvasHeight = parseInt(window.getComputedStyle(document.querySelector('#parentdiv')).getPropertyValue('height'))
,canvasWidth = parseInt(window.getComputedStyle(document.querySelector('#parentdiv')).getPropertyValue('width'))
,value = []
,validvalue = []
,toolTipDiv = document.querySelector('#customToolTip')
,info = document.querySelector('#info')
,dateinfo = document.querySelector('#dateinfo')
,input = document.querySelector('input[type=text]')
deletebutton = document.querySelector('#deletebutton');
let lastIndex = 0
let maxvalue, minvalue, data, nowtime, clientX, newestDate;
let isInCanvas =false;
let times = 0;

//document.querySelector('canvas').style.height = `${windowHeight }px !important`
 
//window.stop()
let label = []
document.querySelector('#deletebutton').addEventListener('click',() =>{

  console.log('hi')
    input.blur();
    input.value = ""
})
document.querySelector('#searchicon').addEventListener('click',() =>{
document.activeElement === input ? input.blur() : input.focus()
console.log(document.activeElement)
})


function getSymbol(){
  /*return fetch("https://financialmodelingprep.com/api/v3/financial-statement-symbol-lists?apikey=c38b723e031c88753f0c9e66f505f557")
  .then(res => res.json())*/

}
function fetchData() {

  //
  return fetch("https://financialmodelingprep.com/api/v3/historical-chart/1min/AAPL?apikey=c38b723e031c88753f0c9e66f505f557")
    .then(res => res.json())

}
//only screenX works here, clientX doesn't work expected.
document.addEventListener('mousemove', e =>{


  if(isInCanvas) clientX = e.clientX 
        else{
        info.style.visibility ='hidden'
        dateinfo.style.visibility ='hidden'
    }

})

canvas.addEventListener('mousedown',function(){

})
canvas.addEventListener('mouseup',function(){
  
})
canvas.addEventListener('mouseenter',()=> isInCanvas = true )
canvas.addEventListener('mouseleave',()=> isInCanvas = false )


function date(dateobject){
  return new Date(dateobject.substring(0,4), dateobject.substring(5,7),dateobject.substring(8,10),dateobject.substring(11,13),dateobject.substring(14,16),"00")

}

function formatData() {
  let d = data[data.length - 1].date
  newestDate = date(data[data.length - 1].date)

  //new Date(data[data.length - 1].date)
  data.forEach((item, index) => {
      this.newdate = new Date(date(item.date));
      if (newestDate.getDate() === this.newdate.getDate()) {
        label.push(this.newdate.getHours())
        validvalue.push(item)
        value.push(item.close.toFixed(2))

      }
    })
     addNullValue()
      maxvalue = Math.max.apply(null, value)
  minvalue = Math.min.apply(null, value)
  label = label.map(i => {if (i) return (i < 12 ? `${i}am` : `${i}pm`)})

  }
 



function getCurrentTime() {
  return fetch("https://worldtimeapi.org/api/timezone/Europe/London")
    .then(res => res.json())
    .then(data => new Date(data.datetime))
}


function addNullValue() {
  const expectedDate = new Date(newestDate.getFullYear(), newestDate.getMonth(), newestDate.getDate(), 15,59)
 //Note that for expectedDate, the time we set is 15:59, but the newestDate is 16:00, so we need add 1 minute (60000) here for comparision
  if (newestDate.valueOf() === new Date(expectedDate.getTime()+60000).valueOf()) return 
    console.log(newestDate === new Date(expectedDate.getTime()+60000))
  const amountToAdd = (expectedDate - newestDate) / 1000 / 60;
//Add null value to array with numbers of minutes left to the close market which is 4 p.m.
 if (amountToAdd > 0) data.push.apply(data, Array(amountToAdd).fill(null)) 
  console.log(59 - newestDate.getMinutes())
   console.log(Array(59 - newestDate.getMinutes()))
  console.log(label, Array(59 - newestDate.getMinutes()).fill(newestDate.getHours()))
  label.push.apply(label, Array(59 - newestDate.getMinutes()).fill(newestDate.getHours()))
  for (let i = newestDate.getHours(); i < 16; i++) label.push.apply(label, Array(60).fill(i))
   

}

function finddata() {
  const filtereddata = data.filter(i=> i !== null)
  console.log(filtereddata)
  for (let i = filtereddata.length - 1; i >= 0; i--) {
     if (new Date(filtereddata[filtereddata.length - 1].date).getDate() != new Date(filtereddata[i].date).getDate()){
      console.log(new Date(filtereddata[filtereddata.length - 1].date), new Date(filtereddata[i].date))
      console.log(filtereddata[i].close)
      return filtereddata[i].close;
     } 
 }


}

function returnColor() {
  //data[0].close give us latest/current stock price
  console.log(finddata(),data[0].close)
  console.log(validvalue)
  console.log(validvalue.length)
  console.log(data[0].close >= finddata() ? "lawngreen" : "red")
  return (validvalue[0].close >= finddata() ? "lawngreen" : "red")
}


function linearGarident(color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  if (color) {
    gradient.addColorStop(0, "#52c4fa");
    gradient.addColorStop(0.5, "rgba(82,196,250,0.3)");
    gradient.addColorStop(1, 'transparent')

  } else if (returnColor().includes("red")) {
    gradient.addColorStop(0, "rgba(255,0,0,0.8)");
    gradient.addColorStop(0.5, "rgba(255,0,0,0.3)");
    gradient.addColorStop(1, 'transparent')
  } else if (returnColor().includes("green")) {
    gradient.addColorStop(0, "rgba(0,255,0,0.8)");
    gradient.addColorStop(0.5, "rgba(0,255,0,0.3)");
    gradient.addColorStop(1, 'transparent')
  }
  return gradient

}
function createChart() {
  let importantvalue ={
    first_index:null,
    final_index:null
  }
  let firstvalue = null;
  const annotation = {
    id: 'annotationline',
    afterDraw: function(chart) {
    //let clientX =event.target.value;
      if (!chart.tooltip._active || !chart.tooltip._active.length) return;
        if(lastIndex === validvalue.length -1 && !importantvalue.final_index)
          importantvalue.final_index = chart.tooltip._active[0].element.x
        else if(lastIndex === 0  && !importantvalue.first_index) importantvalue.first_index = chart.tooltip._active[0].element.x

        ctx.beginPath()
        ctx.setLineDash([])
        ctx.moveTo(chart.tooltip._active[0].element.x, chart.chartArea.top);
        ctx.lineTo(chart.tooltip._active[0].element.x, chart.chartArea.bottom);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#52c4fa';
        ctx.stroke();
        ctx.restore()
        ctx.moveTo(chart.tooltip._active[0].element.x, chart.tooltip._active[0].element.y)
        ctx.globalCompositeOperation = 'destination-over';
        ctx.arc(chart.tooltip._active[0].element.x, chart.tooltip._active[0].element.y, 12.5, 0, 2 * Math.PI)
        ctx.fillStyle = '#52c4fa';
        ctx.fill()
        ctx.closePath()
        info.style.visibility = 'visible'
        dateinfo.style.visibility = 'visible'  
      if(importantvalue.final_index  && chart.tooltip._active[0].element.x >= importantvalue.final_index ){
       
        clientX = importantvalue.final_index -parseFloat(window.getComputedStyle(canvas,null).getPropertyValue('padding-right'))+info.offsetWidth/2
         info.style.left = clientX - info.offsetWidth/2+ "px"
      
      }
      else if(importantvalue.first_index  && chart.tooltip._active[0].element.x <= importantvalue.first_index ){
        clientX = importantvalue.first_index + parseFloat(window.getComputedStyle(canvas,null).getPropertyValue('padding-right'))+info.offsetWidth/2
         info.style.left = clientX - info.offsetWidth/2+ "px"
      }
      else{
         info.style.left = clientX - info.offsetWidth/2+ "px"
      }
         
    
        if(parseFloat(window.getComputedStyle(info,null)["left"]) < importantvalue.first_index )
           info.style.left = importantvalue.first_index +"px"


       
      
    }
  }
  let horizonalLinePlugin = {

    id: 'horizontalLine',
   afterDraw: function(chartInstance) {
      const yScale = chartInstance.scales["y"];

      if (chartInstance.options.horizontalLine) {
        for (let index = 0; index < chartInstance.options.horizontalLine.length; index++) {
          const line = chartInstance.options.horizontalLine[index];
          const style = 'white'
          if(finddata() > maxvalue + 0.15) line.y = maxvalue -0.1
          line.y ? yValue = yScale.getPixelForValue(line.y) : yValue = 20;
          ctx.lineWidth = 3;
          ctx.beginPath()
            ctx.setLineDash([5, 3])
            ctx.moveTo(45, yValue);
            ctx.lineTo(document.querySelector('#chart').width, yValue);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fillText("Previous Price:", canvasWidth-100, yValue + ctx.lineWidth + 10);

            ctx.fillText(line.text, canvasWidth-100, yValue + ctx.lineWidth + 22);
            ctx.closePath()
        }
        return;
      }
    }
  };
  Chart.register(horizonalLinePlugin);
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      xLabels: label,
      datasets: [{
        label: 'stock price',
        data: value,
        fill: true,
        backgroundColor: linearGarident(),
        pointHoverRadius: 0,
        hoverBackgroundColor: linearGarident('color'),
        hoverBorderColor: "rgba(82,196,250,0.8)",
        borderColor: returnColor(),   
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
        "y":finddata() > minvalue - 0.15 ? finddata() : minvalue - 0.1, 
        "text": finddata()
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
            color: 'rgba(255,255,255,0.4)'
          },
          ticks: {
            maxTicksLimit: 6,
            max: maxvalue + 0.15,
            min:minvalue - 0.15,
            stepValue: ((maxvalue - minvalue) / 5).toFixed(1),
            color:'rgba(255,255,255,0.75)',
            font:{
              size:14
            }

          }

        },

        x: {
          grid: {
            color: "rgba(255,255,255,0.4)"
          },
          ticks: {
            //get number of unqiue item in y label
            maxTicksLimit: [...new Set(label)].length,
            color:'rgba(255,255,255,0.75)',
            font:{
              size:14
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
              info.textContent = tooltipItem.raw 
              dateinfo.textContent =  validvalue[tooltipItem.dataIndex].date
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
  Promise.all([getCurrentTime(), fetchData(),getSymbol()]).then(function(values) {

    nowtime = new Date(values[0])
    //Convert data to array and sort data based on the date (newest date like 15:59 pm ) to the end 
  data = values[1].sort(({date: a}, {date: b}) => a < b ? -1 : a > b ? 1 : 0)
  
  



  //console.log(values[1],sortByDate(values[1]))
    formatData()

    createChart()
      document.querySelector('#dollar').textContent = data[data.length-1].close
      const difference = data[data.length-1].close - finddata()
  document.querySelector('#percent').textContent =(returnColor().includes('green') ? "+" : "-") + Math.abs(difference/finddata()*100).toFixed(2)+ "%";

  document.querySelector('#percent').style.color = returnColor()
    console.log(returnColor().includes('green') ? "+" : "-")
  })
}
