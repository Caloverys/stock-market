
(function(){
   load_all_buttons();


  create_small_animated_chart();

   if(symbol_full_list.length === 0 ) assign_web_worker_two();
    
    //fetch the time from new york timezone 

    if(!global_time){
   fetch("https://worldtimeapi.org/api/timezone/america/new_york")

    .then(res => res.json())

    .then(time =>{

    	global_time = new Date(time.datetime);
    	        market_status_element.textContent = global_time.return_market_status() ? "Market Open" : "Market Closed";
        time_element.textContent = (window.innerWidth > 1250 ? global_time.toString().substring(3).split(" GMT")[0] + ' EDT' : (global_time.toString().split(" GMT")[0] + ' EDT').substring(16)); 

        interval = setInterval(() => {
      global_time = new Date(global_time.getTime() + 1000);
      time_element.textContent = (window.innerWidth > 1250 ? global_time.toString().substring(3).split(" GMT")[0] + ' EDT' : (global_time.toString().split(" GMT")[0] + ' EDT').substring(16)); 
      market_status_element.textContent = global_time.return_market_status() ? "Market Open" : "Market Closed";
      }, 1000)
    load_main_page();

    })
}






   //set the default paremeter for context 

  context.strokeStyle = hover_color;
  context.fillStyle = hover_color;
  context.setLineDash([])
  context.strokeStyle = hover_color;
  context.lineWidth = window.innerWidth / 500 > 2.5 ? window.innerWidth / 500 : 2.5
  context.globalCompositeOperation = 'destination-over'
  context.save();

   /*

  The two symbol (search symbol and left arrow) is loaded from the web

  so only make them visible when the script of them successfully loaded

  */
  function load_all_buttons(){
  	const script = document.createElement('script');
  script.setAttribute('src',"https://kit.fontawesome.com/44f674442e.js")
  document.body.appendChild(script) 
  script.onload = () =>{

        back_button.style.visibility = 'visible';
        search_icon.style.visibility = 'visible'
    } 

  };


  function assign_web_worker_two() {

  const blob = new Blob([select('#web_worker_two').textContent], { type: "text/javascript"})

  const worker = new Worker(window.URL.createObjectURL(blob));

  worker.onmessage = function(e) {
  	console.log(search_result)
    /* 

    In order to improve efficency and optimize performance, the object keys have all been renamed, now the symbol_list looks  something like this:

    {
    "0":"CMCSA",
    "1":"Comcast Corporation",
     "2":43.8,
     "3":"NASDAQ Global Select",
     "4":"NASDAQ"
     }

    */

    /*

    Use following code to check the type of the return data to determine which list it should go to

    Note that typeof array is also an object 
    
    */
    const retrieved_data = JSON.parse(e.data)
    if (Array.isArray(retrieved_data[0])) symbol_symbol_list = retrieved_data;

    else if (isNaN(retrieved_data[0]) && retrieved_data[0].length > 0) symbol_full_name_list = retrieved_data;

    else if (!isNaN(retrieved_data[0])) symbol_price_list = retrieved_data;

    else if (typeof retrieved_data[0] === "object") symbol_full_list = retrieved_data;

    if (symbol_price_list.length > 0 && symbol_symbol_list.length > 0 && symbol_full_list.length > 0 && symbol_full_name_list.length > 0) {

      if (isWaiting_two)
        create_sections(symbol_full_name_list)

      else if (isWaiting_three)
        search_through(input.value.toUpperCase())
    }


  }
 
  worker.postMessage("Start");

};

 function load_main_page() {
  search_result.innerHTML = `
  <div id='starting_buttons'>
  <div id='stock_market_button'>

    <div>
      <h2>Stock Market</h2>
      <div class='status'>
        Status:
        <span style='color:${global_time.return_market_status() ? "green" : "red"}'>${global_time.return_market_status() ? "Market Open" : "Market Closed"}</span>
        </div>
      </div>
    </div>
    <div id='watch_list'>
      <h2 style='background-image:${return_color_gradient()}'>My Watch List</h2>
    </div>
    <div id='simulator'>
      <h2 style='background-image:${return_color_gradient()}'>Stock simulator</h2>
    </div>
  </div>
  `
  select('#stock_market_button').addEventListener('click', function() {
    if (symbol_full_name_list.length === 0) {
      search_result.innerHTML = `
       <div id='loader'></div>
       `
      isWaiting_two = true
    } else create_sections(symbol_full_name_list)

    
 

});
}

  function return_color_gradient() {
  const color_list = ['#58D68D', '#F1C40F', '#68C4EC', '#EC7063', "#F39C12", "#f05463", "#40B5AD", "#A52A2A", "#e833c7"];
  const color_one = color_list[Math.floor(Math.random() * color_list.length)]
  color_list.splice(color_one, 1)
  const color_two = color_list[Math.floor(Math.random() * color_list.length)]

  return `-webkit-linear-gradient(left,${color_one},${color_two})`
}




function create_small_animated_chart() {

  setTimeout(() => {
    const last_text_element = select('text:last-child')
    last_text_element.textContent = "Let's get start!"
    last_text_element.style.animation = "draw2 12s forwards, appearing 3s "
  }, 10000)
  const data_one = []
  const data_two = [];
  let previous_point_one = 50;
  let previous_point_two = 40
  for (let i = 0; i < 500; i++) {
    data_one.push({
      x: i,
      y: previous_point_one
    })
    previous_point_one += 5 - Math.random() * 10
    data_two.push({
      x: i,
      y: previous_point_two
    })
    previous_point_two += 5 - Math.random() * 10
  }
  //10 seconds animation
  const delay = 10000 / data_one.length;
  const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

  const animation = {
    x: {
      type: 'number',
      easing: 'linear',

      duration: delay,
      from: NaN,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) return 0;
        ctx.xStarted = true;
        return ctx.index * delay;
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: 10000 / data_one.length,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) return 0;
        ctx.yStarted = true;
        return ctx.index * delay;
      }
    }
  }
  starting_chart = new Chart(select('#animated_effect'), {
    type: 'line',
    data: {
      datasets: [{
          borderColor: "red",
          borderWidth: 1.5,
          radius: 0,
          pointHoverRadius: 0,
          data: data_one,
        },
        {
          borderColor: "lawngreen",
          borderWidth: 1,
          radius: 0,
          pointHoverRadius: 0,
          data: data_two,
        }
      ]
    },
    options: {
      animation,
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false
      },
      interaction: {
        intersect: false
      },
      plugins: {
        tooltip: {
          enabled: false
        },
        legend: false
      },
      scales: {
        x: {
          type: 'linear',
          ticks: {
            //only disable the x-axis label_array from showing 
            display: false
          },
          grid: {
            //display:false
            color: "rgba(256,256,256,0.25)"
          }
        },
        y: {
          ticks: {
            //only disable the y-axis label_array from showing 
            display: false
          },
          grid: {
            //display:false
            color: "rgba(256,256,256,0.25)"
          }

        }
      }
    }
  })

}


})();

















