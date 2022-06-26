
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
  const color = color.return_color_in_rgba();
  if (is_hover) {
    gradient.addColorStop(0, `rgba(${hover_color},0.8)`);
    gradient.addColorStop(0.3, `rgba(${hover_color},0.3)`);
    gradient.addColorStop(0.3, `rgba(${hover_color},0.3)`);

  } else{

  	if (return_color()) {
  	    gradient.addColorStop(0, `rgba(${earn_money_color},0.8)`);
        gradient.addColorStop(0.3, `rgba(${earn_money_color},0.3)`);
        gradient.addColorStop(0.3, `rgba(${earn_money_color},0.3)`);

    } else{
  	    gradient.addColorStop(0, `rgba(${lose_money_color},0.8)`);
        gradient.addColorStop(0.3, `rgba(${lose_money_color},0.3)`);
        gradient.addColorStop(0.3, `rgba(${lose_money_color},0.3)`);
    }
  } 
  gradient.addColorStop(1, 'transparent')
  return gradient

}


function return_horizontal_gradient(is_earning, pos_start, pos_end) {
  const horizontal_Gradient = context.createLinearGradient(0, pos_start, 0, pos_end)

  if (is_earning) {

  	 horizontal_Gradient.addColorStop(0, `rgba(${earn_money_color},0.3)`);
        horizontal_Gradient.addColorStop(0.3, `rgba(${earn_money_color},0.1)`);
       horizontal_Gradient.addColorStop(0.3, `rgba(${earn_money_color},0.15)`);

  } else {

   horizontal_Gradient.addColorStop(0, `rgba(${lose_money_color},0.3)`);
        horizontal_Gradient.addColorStop(0.3, `rgba(${lose_money_color},0.1)`);
        horizontal_Gradient.addColorStop(0.3, `rgba(${lose_money_color},0.15)`);


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

  return new Date(dateobject.substring(0, 4), dateobject.substring(5, 7) - 1, dateobject.substring(8, 10), dateobject.substring(11, 13), dateobject.substring(14, 16), "00")
}














