
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










function return_vertical_linear_garident(color) {
    
  const canvasHeight = parseInt(window.getComputedStyle(parent_of_canvas).getPropertyValue('height'))
  const gradient = context.createLinearGradient(0, 0, 0, canvasHeight);
  const color = color.return_color_in_rgba();
  if (color) {
    gradient.addColorStop(0, hover_color);
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


function return_horizontal_gradient(color, pos_start, pos_end) {
  const horizontal_Gradient = context.createLinearGradient(0, pos_start, 0, pos_end)

  if (color === "red") {
    horizontal_Gradient.addColorStop(0, "rgba(255,0,0,0.3)");
    horizontal_Gradient.addColorStop(0.3, "rgba(255,0,0,0.1)");
    horizontal_Gradient.addColorStop(0.3, "rgba(255,0,0,0.15)");
    horizontal_Gradient.addColorStop(1, 'transparent')

  } else if (color === 'lawngreen') {
    horizontal_Gradient.addColorStop(0, "rgba(124,252,0,0.3)");
    horizontal_Gradient.addColorStop(0.3, "rgba(124,252,0,0.1)");
    horizontal_Gradient.addColorStop(0.3, "rgba(124,252,0,0.15)");
    horizontal_Gradient.addColorStop(1, 'transparent')

  }
  return horizontal_Gradient
}


















