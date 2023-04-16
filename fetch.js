window.addEventListener('load', function () {
  const currDate = document.getElementById("currDate");
  const date = new Date();
  currDate.innerHTML = date.toLocaleDateString();
});

const getBtn = document.getElementById('get-attendance-btn');
const postBtn = document.getElementById('send-fingerprint-btn');

//const jsonToTable = require('json-to-table');

const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json' } : {}
  }).then(response => {
    if (response.status >= 400) {
      // !response.ok
      return response.json().then(errResData => {
        const error = new Error('Something went wrong!');
        error.data = errResData;
        throw error;
      });
    }
    return response.json();
  });
};
var myBooks;
const getData = () => {
  sendHttpRequest('GET', 'http://localhost:8081/attendance/list').then(responseData => {
    console.log(responseData);
    //myBooks = JSON.stringify(responseData, null, 2);
    myBooks = responseData.matchedStudents;
    console.log(myBooks);
  });
};

let tableFromJson = () => {
  // Extract value from table header. 
  let col = [];
  for (let i = 0; i < myBooks.length; i++) {
    for (let key in myBooks[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // Create table.
  const table = document.createElement("table");

  // Create table header row using the extracted headers above.
  let tr = table.insertRow(-1);                   // table row.

  for (let i = 0; i < col.length; i++) {
    let th = document.createElement("th");      // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // add json data to the table as rows.
  for (let i = 0; i < myBooks.length; i++) {

    tr = table.insertRow(-1);

    for (let j = 0; j < col.length; j++) {
      let tabCell = tr.insertCell(-1);
      tabCell.innerHTML = myBooks[i][col[j]];
    }
  }

  // Now, add the newly created table with json data, to a container.
  const divShowData = document.getElementById('showData');
  divShowData.innerHTML = "";
  divShowData.appendChild(table);
}

// Converting file to base64string to send to the server
// Get a reference to the file input
const fileInput = document.querySelector('input');
var base64String;
// Listen for the change event so we can capture the file
fileInput.addEventListener('change', (e) => {
    // Get a reference to the file
    const file = e.target.files[0];

    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
        // Use a regex to remove data url part
        base64String = reader.result
            .replace('data:', '')
            .replace(/^.+,/, '');

        console.log(base64String);
        console.log(typeof(base64String));
        // Logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(file);
});

const sendData = () => {
  sendHttpRequest('POST', 'http://localhost:8081/attendance/schedule', {
    encodedImage: base64String
  })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(err => {
      console.log(err, err.data);
    });
};

// Converting table into .csv file (excel)
function tableToCSV() {
 
  // Variable to store the final csv data
  var csv_data = [];

  // Get each row data
  var rows = document.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {

      // Get each column data
      var cols = rows[i].querySelectorAll('td,th');

      // Stores each csv row data
      var csvrow = [];
      for (var j = 0; j < cols.length; j++) {

          // Get the text data of each cell
          // of a row and push it to csvrow
          csvrow.push(cols[j].innerHTML);
      }

      // Combine each column value with comma
      csv_data.push(csvrow.join(","));
  }

  // Combine each row data with new line character
  csv_data = csv_data.join('\n');

  // Call this function to download csv file 
  downloadCSVFile(csv_data);

}

// download .csv file (excel)
function downloadCSVFile(csv_data) {

  // Create CSV file object and feed
  // our csv_data into it
  CSVFile = new Blob([csv_data], {
      type: "text/csv"
  });

  // Create to temporary link to initiate
  // download process
  var temp_link = document.createElement('a');

  //const date = new Date();

  //let day = date.getDate();
  //let month = date.getMonth() + 1;
  //let year = date.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  //let currentDate = `${day}-${month}-${year}`;

  // Download csv file
  temp_link.download = "attendance.csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}

getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);