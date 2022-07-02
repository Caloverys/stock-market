
let interval,is_substring;;


window.addEventListener('resize',function(){
const innerHeight = window.innerHeight;
const innerWidth = window.innerWidth;
(function(){
 if(innerWidth > 1250) is_substring = false
      else is_substring = true;
   console.log(is_substring)
if(interval) window.clearInterval(interval);
time_element.textContent = (is_substring ?  (global_time.toString().split(" GMT")[0] + ' EDT').substring(16) :  global_time.toString().substring(3).split(" GMT")[0] + ' EDT');
   interval = setInterval(() => {

      global_time = new Date(global_time.getTime() + 1000);
      market_status_element.textContent = global_time.return_market_status() ? "Market Open" : "Market Closed";
      time_element.textContent = (is_substring ?  (global_time.toString().split(" GMT")[0] + ' EDT').substring(16) :  global_time.toString().substring(3).split(" GMT")[0] + ' EDT');
      }, 1000)
 
})()
})

