# stock.html

[Full Demo](https://codepen.io/caloverys/full/XWVzBVN)


<img width="2032" alt="Screenshot 2023-03-27 at 11 27 50 PM" src="https://user-images.githubusercontent.com/79812606/228120244-4e67f8e3-9c36-4fae-8f9b-bc50160709a7.png">

It is created with the help of vanilla JS, chart.js and two stock third-party API. 

Tested broswer: safari and chrome

Works for resolution biggger than 900px width. 

It is orginially designed to create a web version of apple stock and imply some more features. 

Problems:
I uses two stock API to get stock data for free, but unforunately, one api has no longer providing service for three, so any stock data greater than 3M is unavailable now. Work of finding a new API and write new function of how to process data to draw graph based on the data from API is needed. 

The stock simulator feature and my watchlist feature has not be implemented fully. The watchlist feature is available and search result in watchlist will be shown, but I haven't have a time to redesign a new UI for the watchlist. For the stock simulator feature, it requires the interaction between back-end and front-end. Some decent amout of study is needed which is something I need to do. 

Some times the stock data from API might miss some data which will break the graph. A more algorithms are needed. 

More importantly, the code is very messy with hard-understanding variable, long block of code in one file an almost no comment as I haven't study how to write clean and organized code when I am making this project. Same with the fact not using display:flex and not many uses of css class which makes the process of styling and makes the website works in every resolution much harder.

In the future, I might consider to rebuild and redesign the whole structure of the website as the structure and organization of this project seems silly and messy now after doing much more study of writing organized and efficient after 8 months.



