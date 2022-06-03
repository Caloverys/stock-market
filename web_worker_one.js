self.onmessage = function(e) {
  start_fetching_data(e.data).then(function(result){
    const full_data = result
      self.postMessage(JSON.stringify(result))

  });
    self.postMessage('msg from worker');
  };


function start_fetching_data(symbol){
  return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol.toUpperCase()}&outputsize=full&apikey=FXLQF9OPEP8ROBMD`)
  .then(res=> res.json())
  .then(data =>{
   const all_data =data["Time Series (Daily)"]    
    
    const organized_data = []
    //ES2020 adds the feature of Intl.NumberFormat() constructor, we could use Intl.NumberFormat() constructor here to format the large number properly (e.g. 1000 => 1k)
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
 Object.keys(all_data).forEach((info,index)=>{
      organized_data.push({
        "date":info,
        "price":parseInt(all_data[info]["4. close"]),
         "volume":formatter.format(all_data[info]["5. volume"])
      })
       
     })
     
      return organized_data.sort(({
      date: a
    }, {
      date: b
    }) => a < b ? -1 : (a > b ? 1 : 0));
  

    })
  
}
