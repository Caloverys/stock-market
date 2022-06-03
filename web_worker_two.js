self.onmessage = function(e) {
  fetching_symbol().then(function(result) {
    self.postMessage(JSON.stringify(result))
    const all_data = result;
    const symbolname_list = all_data.map(i => {
      return i["0"]
    })
    self.postMessage(JSON.stringify(symbolname_list))
    const price_list = all_data.map(i => {
      return i["2"]
    })
    self.postMessage(JSON.stringify(price_list))

  });
};

function fetching_symbol() {
  return fetch("https://financialmodelingprep.com/api/v3/stock/list?apikey=c38b723e031c88753f0c9e66f505f557")
    .then(res => res.json())
    .then(data => {
      let symbol_list = data;
      symbol_list = symbol_list.filter(i => {
        return i["type"] === 'stock'
      })
      for (let i = 0; i < symbol_list.length; i++) {
        //rename all the object.keys to integer to minimize the size of JSON string and improve peformance

        //Duplictate the values with keys 'symbol' and name as 0
        Object.defineProperty(symbol_list[i], "0",
          Object.getOwnPropertyDescriptor(symbol_list[i], "symbol"));
        Object.defineProperty(symbol_list[i], "1",
          Object.getOwnPropertyDescriptor(symbol_list[i], "name"));
        Object.defineProperty(symbol_list[i], "2",
          Object.getOwnPropertyDescriptor(symbol_list[i], "price"));
        Object.defineProperty(symbol_list[i], "3",
          Object.getOwnPropertyDescriptor(symbol_list[i], "exchange"));
        Object.defineProperty(symbol_list[i], "4",
          Object.getOwnPropertyDescriptor(symbol_list[i], "exchangeShortName"));

        //Now delete now previous item
        delete symbol_list[i]['symbol']
        delete symbol_list[i]['name']
        delete symbol_list[i]['price']
        delete symbol_list[i]['exchange']
        delete symbol_list[i]['exchangeShortName']
        delete symbol_list[i]['type']
      }

      /*
      Now the symbol_list will look something like this:
      {
      "0":"CMCSA",
      "1":"Comcast Corporation",
      "2":43.8,
      "3":"NASDAQ Global Select",
      "4":"NASDAQ"
      }
      */
      return symbol_list
    })

}


