// Select all necessary page elements
const upcomingElement = document.querySelector(`#upcoming`);
const driverStandingsElement = document.querySelector(`#driverStandings`);

// Send the request - upcoming race
var upcomingRequest = new XMLHttpRequest();
upcomingRequest.open('GET', 'http://ergast.com/api/f1/2021/next.json', true);

// Send the request - driver standings
var driverRequest = new XMLHttpRequest();
driverRequest.open('GET', 'http://ergast.com/api/f1/current/driverStandings.json', true);

// // Send the request - constructor standings
// var UpcomingRequest = new XMLHttpRequest();
// request.open('GET', 'http://ergast.com/api/f1/2021/next.json', true);


// Upcoming race data
upcomingRequest.onload = function() {
  if (this.status >= 200 && this.status < 400) {

    //Grab all the data we need
    var data = JSON.parse(this.response);
    var upcomingRound = data.MRData.RaceTable.Races[0].round;
    var upcomingName = data.MRData.RaceTable.Races[0].raceName;
    var upcomingDate = data.MRData.RaceTable.Races[0].date;
    var upcomingTime = data.MRData.RaceTable.Races[0].time;
    var upcomingId = data.MRData.RaceTable.Races[0].Circuit.circuitId;

    // Output upcoming data for testing purposes
    console.log(`Upcoming round: ${upcomingRound}, Name: ${upcomingName}, Date: ${upcomingDate}, Time: ${upcomingTime}, ID: ${upcomingId}`);

    // Add data to page
    upcomingElement.textContent = upcomingName;
  } else {
    console.log('no results');

  }
};

// Driver standings data
driverRequest.onload = function() {
    if (this.status >= 200 && this.status < 400) {

        //Grab all the data we need
        var driverData = JSON.parse(this.response);
        var driverArray = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        // Loop through drivers
        driverArray.forEach(function(driver) {
            // Grab driver data
            driverConstructorId = driver.Constructors[0].constructorId;
            driverPosition = driver.position;
            driverNationality = driver.Driver.nationality;
            driverName = driver.Driver.givenName;
            driverSurname = driver.Driver.familyName;
            driverConstructor = driver.Constructors[0].name;
            driverPoints = driver.points;

            // Create HTML elements
            var driverStandingsItem = document.createElement(`li`);
            var driverStandingsNationality = document.createElement(`span`);
            var driverStandingsName = document.createElement(`span`);
            var driverStandingsPosition = document.createElement(`span`);
            var driverStandingsConstructor = document.createElement(`span`);
            var driverStandingsPoints = document.createElement(`span`);


            // Populate HTML elements
            driverStandingsItem.classList.add(driverConstructorId);
            driverStandingsPosition.textContent = driverPosition;
            driverStandingsNationality.classList.add(driverNationality.toLowerCase());
            driverStandingsName.textContent = `${driverName} ${driverSurname}`;
            driverStandingsConstructor.textContent = driverConstructor;
            driverStandingsPoints.textContent = driverPoints;

            // Output HTML elements
            driverStandingsElement.appendChild(driverStandingsItem);
            driverStandingsItem.appendChild(driverStandingsPosition);
            driverStandingsItem.appendChild(driverStandingsNationality);
            driverStandingsItem.appendChild(driverStandingsName);
            driverStandingsItem.appendChild(driverStandingsConstructor);
            driverStandingsItem.appendChild(driverStandingsPoints);
        })
    } else {
      console.log('no results');

    }
  };

// Send the request(s)
upcomingRequest.send();
driverRequest.send();

