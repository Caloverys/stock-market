

Object.prototype.return_market_status = function() {

	/*

	    Javascript doesn't have date type, so below is a way to check if date is a date object

	*/
   let date = this;
    if(typeof this.getMonth !== 'month') date = new Date(this);
    
    /*

    Standard stock market opening time is from 9:30 to 16:00

    following if statement return true if market open and return false if market close

    Note that Sunday is 0 in date.getDay()



    */

    return date.getHours() < 16 && (date.getHours() > 9 || (date.getHours() === 9 && date.getMinutes() >= 30)) && date.getDay() !== 6 && date.getDay() !== 0;

	
};



String.prototype.return_color_in_rgba =  function(){
	let color = this;
	const div = document.createElement('div');
	div.style.color = color;
	document.body.appendChild(div);
	color = window.getComputedStyle(div).getPropertyValue('color');
	div.remove();

	/*
    convert rgb(0,0,0) to 0,0,0
	*/
	return color.substring(color.indexOf("(")+1, color.indexOf(")"));
}










function return_vertical_linear_garident(is_hover) {
    
  const canvasHeight = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('height'))
  const gradient = context.createLinearGradient(0, 0, 0, canvasHeight);
  if (is_hover) {
    gradient.addColorStop(0, `rgba(${hover_color.return_color_in_rgba()},0.8)`);
    gradient.addColorStop(0.3, `rgba(${hover_color.return_color_in_rgba()},0.3)`);
    gradient.addColorStop(0.3, `rgba(${hover_color.return_color_in_rgba()},0.3)`);

  } else{

  	if (return_color().includes('green')) {
  	    gradient.addColorStop(0, `rgba(${earn_money_color.return_color_in_rgba()},0.8)`);
        gradient.addColorStop(0.3, `rgba(${earn_money_color.return_color_in_rgba()},0.3)`);
        gradient.addColorStop(0.3, `rgba(${earn_money_color.return_color_in_rgba()},0.3)`);

    } else{
  	    gradient.addColorStop(0, `rgba(${lose_money_color.return_color_in_rgba()},0.8)`);
        gradient.addColorStop(0.3, `rgba(${lose_money_color.return_color_in_rgba()},0.3)`);
        gradient.addColorStop(0.3, `rgba(${lose_money_color.return_color_in_rgba()},0.3)`);
    }
  } 
  gradient.addColorStop(1, 'transparent')
  return gradient

}


function return_horizontal_gradient(color, pos_start, pos_end) {
  const horizontal_Gradient = context.createLinearGradient(0, pos_start, 0, pos_end)

  if (color.includes('green')) {

  	 horizontal_Gradient.addColorStop(0, `rgba(${earn_money_color.return_color_in_rgba()},0.3)`);
        horizontal_Gradient.addColorStop(0.3, `rgba(${earn_money_color.return_color_in_rgba()},0.1)`);
       horizontal_Gradient.addColorStop(0.3, `rgba(${earn_money_color.return_color_in_rgba()},0.15)`);

  } else {

   horizontal_Gradient.addColorStop(0, `rgba(${lose_money_color.return_color_in_rgba()},0.3)`);
        horizontal_Gradient.addColorStop(0.3, `rgba(${lose_money_color.return_color_in_rgba()},0.1)`);
        horizontal_Gradient.addColorStop(0.3, `rgba(${lose_money_color.return_color_in_rgba()},0.15)`);


  }
   horizontal_Gradient.addColorStop(1, 'transparent')
  return horizontal_Gradient
}

String.prototype.size_calculation = function(fontSize){
  const div = document.body.appendChild(document.createElement('div'));
  div.textContent = this;
  div.style.cssText = `
  font-size:${fontSize}px;
  width:auto;
  position:absolute;
  visibility:hidden;
  `;
  //object destrusturing: const {} = object; ES6 feature 
  const {width,height} = window.getComputedStyle(div);

  div.remove();
  return ({
    width: parseFloat(width),
    height: parseFloat(height)
  })
}


Object.prototype.format_date = function(){
  /*

  Some broswers don't recognize a speicific date format 

  Example: 2022-06-10 10:45:00 

  This will return Invalid Date in safari 

  The always best way is to reformat to ISO string 



  */

  return new Date(this.substring(0, 4),this.substring(5, 7) - 1, this.substring(8, 10), this.substring(11, 13), this.substring(14, 16), "00")
}


function create_warning(){
	const warning = document.createElement('div');
  warning.innerHTML = `
  <div style='position:absolute;left:1vw;">
  <span style='font-weight:900;font-size:1.3em'>⚠</span>
  Warning: 
  </div>
  <span style='font-weight:500; color:rgba(0,0,0,0.8); font-size:0.9em'>Window get resized</span>  
  <a style='text-decoration:underline; font-style:italic; font-weight:500;font-size:0.5em;color:darkblue; margin-left:5px;margin-top:5px;'>Learn more</a>
  <button class='resize_button' style='position:fixed; right:10%;'>Resize</button>
  <button class='remove_button' style='position:fixed; right:3%;'></button>
  `
  warning.className = 'warning'
  const timeout = setTimeout(() => warning.remove(), 5000)

  const remove_button = warning.querySelector('.remove_button')
  remove_button.addEventListener('click', () => {
    window.clearTimeout(timeout)
    warning.classList.add('remove_class')
    setTimeout(() => warning.remove(), 500)
  })

  /*
  warning.querySelector('.resize_button').addEventListener('click', function() {

    retore_all_values()
    if (timestamp) {
      raw_data = filter_data(all_fetch_data[variable_name], parseInt(timestamp))
      format_data(difference_time)
    } else button_being_clicked.click()

    create_chart()
    warning.remove()
  })
  */
  document.body.appendChild(warning)
};


/*

Detect if the mouse is in the chart (not the whole canvas)

return a boolean value to indicate that

*/

function isInCanvas(posX, posY) {

  //immediately return false if myChart has not be created
  if (!myChart) return false;

  const canvas_pos = canvas.getBoundingClientRect();

  return myChart.chartArea.left + canvas_pos.left <= posX && posX <= myChart.chartArea.right + canvas_pos.left && myChart.chartArea.top <= posY - canvas_pos.top && posY - canvas_pos.top <= myChart.chartArea.bottom;

}

function fetch_data(symbol, range) {
  /*

  apikey=c38b723e031c88753f0c9e66f505f557
   demo used only : apikey=136fb4fa07e6ac6ae9a246d24029dfbc
  apikey=ee684c5f9b04a3e914f9e39630f0f929

  */

  return fetch(`https://financialmodelingprep.com/api/v3/historical-chart/${range}/${symbol.toUpperCase()}?apikey=ee684c5f9b04a3e914f9e39630f0f929`)
    .then(res => res.json())

}



window.addEventListener('beforeunload', function(e) {
  localStorage.setItem('my_watched_list', JSON.stringify(my_watched_list));
});


my_watched_button.addEventListener("click", function(){
  document.querySelectorAll('script').forEach(script=>{
    if(script.src.includes("starting_page.js")){

      const head = document.querySelector('head');
      const script_tag = document.createElement('script');
      script_tag.src = script.src;
      script.remove();
      document.querySelector('head').appendChild(script_tag);
      if(starting_chart) starting_chart.destroy();
      else if(myChart) myChart.destroy();

    }

  })
    

})






my_watched_button.addEventListener('click', function(event) {

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



function button_add_active(id){
    if(document.querySelector('.range_button_active')) document.querySelector('.range_button_active').classList.remove('range_button_active');
    
    document.querySelector(`#${id}`).classList.add("range_button_active");
}









