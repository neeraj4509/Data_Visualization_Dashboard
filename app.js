document.addEventListener('DOMContentLoaded', function () {

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    $('#datePicker').daterangepicker({
      opens: 'left', 
      startDate: moment().subtract(7, 'days'),
      endDate: moment(),
      locale: {
        format: 'DD/MM/YYYY'
      },
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')]
      }
    });


    const savedFilters = getCookie('savedFilters');
    const savedDateRange = getCookie('savedDateRange');
    const savedGender = getCookie('savedGender');

    if(savedFilters){
      $('#ageFilter').val(savedFilters);
    }

    if(savedGender){
      $('#genderFilter').val(savedGender)
    }

    if(savedDateRange){
      $('#datePicker').val(savedDateRange);
    }
    
    $('#ageFilter').on('change', function () {
      getSelectedRange();
    });

    $('#genderFilter').on('change', function () {
      getSelectedRange();
    });


  // Function to handle date range selection
    window.getSelectedRange = function() {
      const selectedRange = $('#datePicker').val();
      const selectedAge = $('#ageFilter').val();
      const selectedGender = $('#genderFilter').val();

      setCookie('savedFilters', selectedAge, 365);
      setCookie('savedDateRange', selectedRange, 365);
      setCookie('savedGender', selectedGender, 365);

      if (selectedRange && selectedAge && selectedGender) {
        alert('Selected Date Range: ' + selectedRange + ', Age: ' + selectedAge + ', Gender: ' + selectedGender);
        // Reload the chart with the new selections
        drawChart(selectedRange, selectedAge, selectedGender);
      // drawLineChart(selectedRange, selectedAge, selectedGender,3);

        document.getElementById('shareChartButton').style.display = 'inline-block';
      } else {
        alert('Please select valid options for Date Range, Age, and Gender.');
      }
    }

    window.resetPreferences = function () {
      setCookie('savedFilters', '', -1);
      setCookie('savedDateRange', '', -1);
      setCookie('savedGender', '', -1);
  
      // Reset form values
      $('#ageFilter').val('all');
      $('#datePicker').val('');
      $('#genderFilter').val('all');
    }


    function drawChart(selectedRange, selectedAge, selectedGender) {
      
      const spreadsheetId = '1e2zcl82vkXlsK3hmWcXOozYFuWuHupsTgHtyKqwNf_8';
      const query = new google.visualization.Query(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=Sheet1`);

      query.send(function(response) {
        handleQueryResponse(response, selectedRange, selectedAge, selectedGender);
      });

    }

    function handleQueryResponse(response, selectedRange, selectedAge, selectedGender) {
      if (response.isError()) {
        console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
      }

      const data = response.getDataTable();

      const startDate = moment(selectedRange.split(' - ')[0], 'DD/MM/YYYY').startOf('day');
      const endDate = moment(selectedRange.split(' - ')[1], 'DD/MM/YYYY').endOf('day');

      const rowsInDateRange = [];

      for (let row = 0; row < data.getNumberOfRows(); row++) {
        const rowDate = moment(data.getValue(row, 0), 'DD/MM/YYYY').startOf('day');
        const rowAge = data.getValue(row, 1); 
        const rowGender = data.getValue(row, 2);

        console.log('Row:', row, 'Row Date:', rowDate, 'Row Age:', rowAge, 'Row Gender:', rowGender);

        const isDateInRange = rowDate.isSameOrAfter(startDate) && rowDate.isSameOrBefore(endDate);
        const isAgeValid = selectedAge === 'all' || (selectedAge === '15-25' && rowAge.includes('15-25')) || (selectedAge === '>25' && rowAge.includes('>25'));
        const isGenderValid = selectedGender === 'all' || (selectedGender.toLowerCase() === 'male' && rowGender.toLowerCase() === 'male') || (selectedGender.toLowerCase() === 'female' && rowGender.toLowerCase() === 'female');

        console.log('isDateInRange:', isDateInRange, 'isAgeValid:', isAgeValid, 'isGenderValid:', isGenderValid);

        if (isDateInRange && isAgeValid && isGenderValid) {
          rowsInDateRange.push(row);
        }

        
      }

      console.log('Rows in Date Range:', rowsInDateRange);

      const categories = ['A', 'B', 'C', 'D', 'E', 'F'];
      const seriesData = Array(categories.length).fill(0);

      // Sum time spent for each category over the selected date range
      for (let i = 0; i < categories.length; i++) {
        for (const row of rowsInDateRange) {
          seriesData[i] += parseFloat(data.getValue(row, i + 3));
        }
      }

      console.log('Categories:', categories);
      console.log('Series Data:', seriesData);

      const options = {
        series: [{
          data: seriesData
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false,
          },
          events:{
            dataPointSelection: function (event, chartContext, config) {
              // Extract the index of the clicked bar
              const selectedCategoryIndex = config.dataPointIndex + 3;
              
              drawLineChart(selectedRange, selectedAge, selectedGender, selectedCategoryIndex);
            }

          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        
        dataLabels: {
          enabled: true,
          formatter: function (value) {
            return value;
          }
        },
        xaxis: {
          categories: categories,
          title: {
            text: 'Time Spent',
            offsetX: 15,
            offsetY: 0,
          },
        },
        yaxis: {
          title: {
            text: 'Features',
          },
        },
        title: {
          text: 'Data Visualization',
          align: 'center',
        },
        
       
      };

      const chart = new ApexCharts(document.querySelector("#chart"), options);
      const canvas = document.getElementById('chart');

      chart.render();
    
      }

      function drawLineChart(selectedRange, selectedAge, selectedGender,selectedCategoryIndex) {

      const spreadsheetId = '1e2zcl82vkXlsK3hmWcXOozYFuWuHupsTgHtyKqwNf_8';
    
      const startDate = moment(selectedRange.split(' - ')[0], 'DD/MM/YYYY');
      const endDate = moment(selectedRange.split(' - ')[1], 'DD/MM/YYYY');
    
      // Fetch data from the Google Sheet
      const query = new google.visualization.Query(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=Sheet1`);
      query.send(function (response) {
        handleLineChartQueryResponse(response, startDate, endDate, selectedAge, selectedGender);
      });
      
      function handleLineChartQueryResponse(response, startDate, endDate, selectedAge, selectedGender) {
        if (response.isError()) {
          console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
          return;
        }
    
        const data = response.getDataTable();
        const dateLabels = [];
        const currentDate = startDate.clone();
    
        
        while (currentDate.isSameOrBefore(endDate, 'day')) {
          dateLabels.push(currentDate.format('D MMM'));
          currentDate.add(1, 'day');
        }
    
        const lineChartData = [];
    
        for (const date of dateLabels) {
          const rowsInDateRange = [];
          for (let row = 0; row < data.getNumberOfRows(); row++) {
            const rowDate = moment(data.getValue(row, 0), 'DD/MM/YYYY').format('D MMM');
            const rowAge = data.getValue(row, 1);
            const rowGender = data.getValue(row, 2);
    
            if (rowDate === date &&
                (selectedAge === 'all' || rowAge === selectedAge) &&
                (selectedGender === 'all' || rowGender.toLowerCase() === selectedGender.toLowerCase())) {
              rowsInDateRange.push(row);
            }
          }
    
          // Calculate the total time spent for the current date, age, and gender
          let totalTimeSpent = 0;
          
          for (const row of rowsInDateRange) {
            totalTimeSpent += parseFloat(data.getValue(row, selectedCategoryIndex)); // Assuming value is in the 4th column
          }
    
          lineChartData.push(totalTimeSpent);
        }

        const selectedCategory = data.getColumnLabel(selectedCategoryIndex);
        const lineChartOptions = {
          chart: {
            type: 'line',
            height: 350,
            toolbar: {
              show: false,
            },
            
          },
          series: [{
            name: 'Category + ',
            data: lineChartData,
          }],
          xaxis: {
            categories: dateLabels,
            title: {
              text: `Category ${selectedCategory}`,
              offsetX: 15,
              offsetY: 0,
            },
          },
          yaxis:{
            title:{
              text: 'Time Spent'
            }
          },
          title: {
            text: `Time Line of of Category ${selectedCategory}` ,
            align: 'center',
          },
          plotOptions:{
            line:{
              markers:{
                size :30,
              }
            }
          }
        };
    
        const lineChart = new ApexCharts(document.querySelector("#lineChart"), lineChartOptions);
        lineChart.render();
      }
    }
  }  
);

function shareChart() {
  const selectedRange = $('#datePicker').val();
  const selectedAge = $('#ageFilter').val();
  const selectedGender = $('#genderFilter').val();

  const uniqueChartIdentifier = generateUniqueIdentifier();
  const shareableURL = `${window.location.origin}/view-chart.html?chart_id=${uniqueChartIdentifier}&age=${encodeURIComponent(selectedAge)}&gender=${encodeURIComponent(selectedGender)}&dateRange=${encodeURIComponent(selectedRange)}`;

  navigator.clipboard.writeText(shareableURL).then(function() {
    alert('Shareable URL copied to clipboard!');
  }).catch(function(err) {
    console.error('Unable to copy to clipboard', err);
    alert('Failed to copy shareable URL. Please copy it manually.');
  });
}

function generateUniqueIdentifier() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${randomString}`;
}

function logout() {
  window.location.href = 'login.html';
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value || ''};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const keyValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return keyValue ? keyValue[2] : null;
}

// function shareChart() {

//     const selectedRange = $('#datePicker').val();
//     const selectedAge = $('#ageFilter').val();
//     const selectedGender = $('#genderFilter').val();
//   // After drawing the chart, generate and share URL
//     const uniqueChartIdentifier = generateUniqueIdentifier(); // Implement this function
//     const shareableURL = `${window.location.origin}/view-chart.html?chart_id=${uniqueChartIdentifier}`;


    

//   // Copy URL to clipboard
//     navigator.clipboard.writeText(shareableURL).then(function() {
//       alert('Shareable URL copied to clipboard!');
//     }).catch(function(err) {
//       console.error('Unable to copy to clipboard', err);
//       alert('Failed to copy shareable URL. Please copy it manually.');
//   });
// }
