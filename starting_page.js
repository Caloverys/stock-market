(function(){
   load_all_buttons();

   create_small_animated_chart();

   assign_web_worker_two();
    
    //fetch the time from new york timezone 
   fetch("https://worldtimeapi.org/api/timezone/america/new_york")

    .then(res => res.json())

    .then(time =>{
    	window.global_time = new Date(time)
        market_status_element.textContent = return_market_status() ? "Market Open" : "Market Closed";
    const time_element = select("#current_time")
    let time = global_time
    time_element.textContent = time.toString().split(" GMT")[0] + ' EDT';
    setInterval(() => {
      time = new Date(time.getTime() + 1000)
      time_element.textContent = time.toString().split(" GMT")[0] + ' EDT';
    }, 1000)
    load_main_page()
    })

    .then()



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

}

})();


 

  

  get_global_time().then(function(result) {
    global_time = new Date(result)
    select('#market_status').textContent = return_market_status() ? "Market Open" : "Market Closed";
    const time_element = select("#current_time")
    let time = global_time
    time_element.textContent = time.toString().split(" GMT")[0] + ' EDT';
    setInterval(() => {
      time = new Date(time.getTime() + 1000)
      time_element.textContent = time.toString().split(" GMT")[0] + ' EDT';
    }, 1000)
    load_main_page()

  })






