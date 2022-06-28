/*

use Function.prototype.bind() to write alias for document.querySelector and document.querySelectorAll to shorten the code

*/


const select = document.querySelector.bind(document);

const selectAll = document.querySelectorAll.bind(document);
const canvas = select('#chart');

const context = canvas.getContext('2d')

, dataset = []

, detail_dataset = []

, info_price = select('#info_price')

, info_date = select('#info_date')

, parent_of_canvas = select('#parent_of_canvas')

, input = select('input[type=text]')

,loader = select('.loader')

,my_watched_button = select('#add_to_watchlist')

, delete_button = select('#deletebutton')


,search_icon = select('#search_icon')

,back_button = select('#back_button')

,market_status_element = select('#market_status')

,time_element = select("#current_time")

,search_result_element = select('#search_result');

let hover_color = '#52c4fa';

let lose_money_color = 'red';

let earn_money_color = 'lawngreen';

let gridline_color = "rgba(256,256,256,0.4)";

let [symbol_full_list, symbol_price_list, symbol_symbol_list, symbol_full_name_list] = new Array(4).fill([]);

let global_time,myChart,starting_chart;

let [label_array, grid_color_array] = new Array(2).fill([]);

let my_watched_list = JSON.parse(localStorage.getItem('my_watched_list'));

//Try to get my_watch_list from localStorage, if there is no data, declared as [];

if (!my_watched_list) my_watched_list = []











