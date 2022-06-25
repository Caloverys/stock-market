
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
















