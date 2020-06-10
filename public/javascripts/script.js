function printCharts(shortName) {
  const key = 'AKW7U8FI1GS9YXYK';
  const functionName = 'TIME_SERIES_DAILY';
  const symbolName = shortName;
  const apiUrl = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbolName}&apikey=${key}`;
  
  axios
    .get(apiUrl)
    .then(responseFromAPI => {
      printTheChart(responseFromAPI.data); // <== call the function here where you used to console.log() the response
    })
    .catch(err => console.log('Error while getting the data: ', err));
  
  function printTheChart(stockData) {
    const dailyData = stockData['Time Series (Daily)'];
  
    const stockDates = Object.keys(dailyData);
    const stockPrices = stockDates.map(date => dailyData[date]['4. close']);
  
    const ctx = document.getElementById(`my-chart-${symbolName}`).getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stockDates,
        datasets: [
          {
            label: 'Stock Chart',
            backgroundColor: 'rgb(0,123,255)',
            borderColor: 'rgb(0,123,255)',
            data: stockPrices
          }
        ]
      }
    }); // closes chart = new Chart()
  } // closes printTheChart()
}

const actions = document.querySelectorAll('#actionsCard')

for (let i=0; i<actions.length; i++) {
  const name = actions[i].getElementsByClassName('symbolName')[0].innerText
  printCharts(name)
}

// Handlebars.registerHelper("hacerAlgo", function() {
//   return new Handlebars.SafeString("HELLO")
//  })
