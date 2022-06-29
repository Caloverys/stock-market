const innerHeight = window.innerHeight;
const innerWidth = window.innerWidth;
let interval,is_substring;;
 if(innerWidth > 1200) is_substring = false
      else is_substring = true

if(!global_time) fecth_global_time().then(function(){
	assign_interval()
});
else assign_interval();


 
 function fecth_global_time(){
 return fetch("https://worldtimeapi.org/api/timezone/america/new_york")

    .then(res => res.json())

    .then(time =>{
    	console.log(time)

    	global_time = new Date(time.datetime);
    	        market_status_element.textContent = global_time.return_market_status() ? "Market Open" : "Market Closed";
        time_element.textContent = (is_substring ?  (global_time.toString().split(" GMT")[0] + ' EDT').substring(16) :  global_time.toString().split(" GMT")[0] + ' EDT');
})
 }

 function assign_interval(){
if(interval) window.clearInterval(interval);

   interval = setInterval(() => {

      global_time = new Date(global_time.getTime() + 1000);
      market_status_element.textContent = global_time.return_market_status() ? "Market Open" : "Market Closed";
      time_element.textContent = (is_substring ?  (global_time.toString().split(" GMT")[0] + ' EDT').substring(16) :  global_time.toString().split(" GMT")[0] + ' EDT');
      }, 1000)
 }
