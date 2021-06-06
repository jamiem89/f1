// Select elements for functionality
const selectOne = document.querySelector('#driver-select-one');
const selectTwo = document.querySelector('#driver-select-two');

// Select elements for filling in information
const driverName = document.querySelectorAll('[data-type="driverName"]');
const driverImg = document.querySelectorAll('[data-type="driverImg"]');
const driverNumber = document.querySelectorAll('[data-type="driverNumber"]');
const driverCurrentPos = document.querySelectorAll('[data-type="currentPos"]');
const driverCurrentPnts = document.querySelectorAll('[data-type="currentPnts"]');
const driverQuali = document.querySelectorAll('[data-type="quali"]');
const driverFastestLap = document.querySelectorAll('[data-type="fastestLap"]');
const driverGained = document.querySelectorAll('[data-type="gained"]');
const driverAvgFinish = document.querySelectorAll('[data-type="avgFinish"]');
const driverAvgSpeed = document.querySelectorAll('[data-type="avgSpeed"]');
const driverWinner = document.querySelector('[data-type="winner"]');
const driverBattlePoints = document.querySelectorAll('[data-type="battlePoints"]');

// Empty drivers object
let driversObject = {
    drivers: []
 };

// Reusable fetch data function
function fetchData(url) {
    console.log(`fetching data`);
    return fetch(url)
        .then(res => res.json());
};

// GET ALL CURRENT DRIVERS

// Populate driver list
function driverList(data) {
    fetchData(data).then(data => generateDriverList(data));
}

function generateDriverList(data) {
    const driverList = data.MRData.DriverTable.Drivers;
    let driverOptions = '';

    for(let i = 0; i < driverList.length; i++) {
        let driver = driverList[i].familyName;
        let option = document.createElement('OPTION');
        let optionTwo = document.createElement('OPTION');
        option.value = driverList[i].driverId;
        optionTwo.value = driverList[i].driverId;
        option.innerText = driver;
        optionTwo.innerText = driver;
        selectOne.appendChild(option);
        selectTwo.appendChild(optionTwo);
    }
}

// Send the request
driverList('https://ergast.com/api/f1/2021/drivers.json');

// DRIVER DATA

// Reusable driver data function
function fetchDriverData(num, driver) {

    let requestA = false;
    let requestB = false;

    let objectA = fetchData(`https://ergast.com/api/f1/2021/drivers/${driver}/results.json`).then(data => {
        objectA = roundData(data);
    }).then(() => {
       return objectA;
    }).then(() => {
        requestA = true;
        combineData();
    });

    let objectB = fetchData(`http://ergast.com/api/f1/2021/drivers/${driver}/driverstandings.json`).then(data => {
        objectB = championshipData(data);
    }).then(() => {
        return objectB;
    }).then(() => {
        requestB = true;
        combineData();
    });

    function combineData() {
        if(requestA && requestB) {
            driversObject.drivers[num] = {...objectA, ...objectB};
        }
        if(driversObject.drivers.length == 2) {
            driverCompare();
        }
    }
}

function roundData(data) {
    data = data.MRData.RaceTable.Races;
    let qualiResults = [];
    let fastestLaps = [];
    let finishes = [];
    let averageSpeed = [];
    let object = [];

    // Loop through rounds
    for(let i = 0; i < data.length; i++) {
        qualiResults.push(parseInt(data[i].Results[0].grid));
        if(data[i].Results[0].FastestLap) {
            fastestLaps.push(parseInt(data[i].Results[0].FastestLap.rank));
            averageSpeed.push(parseInt(data[i].Results[0].FastestLap.AverageSpeed.speed));
        } else {
            fastestLaps.push(20);
            averageSpeed.push(0);
        }
        finishes.push(parseInt(data[i].Results[0].position));
    }

    object = {
        'qualiResults': qualiResults,
        'fastestLaps': fastestLaps,
        'finishes': finishes,
        'averageSpeed': averageSpeed,
    }

    return object;
};

function championshipData(data) {
    data = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    let name = data.Driver.familyName;
    let number = `#${data.Driver.permanentNumber}`;
    let currentPos = data.position;
    let currentPoints = data.points;
    let object = {
        'Name': name,
        'Number': number,
        'Position': currentPos,
        'Points': currentPoints,
    }
    return object;
};

// COMPARE STATS IN THE DRIVERS OBJECT

function driverCompare() {
    let driverOne = driversObject.drivers[0];
    let driverTwo = driversObject.drivers[1];
    console.log(driverOne);
    console.log(driverTwo);

    // Driver name
    driverName[0].textContent = driverOne.Name;
    driverName[1].textContent = driverTwo.Name;
    // Driver number
    driverNumber[0].textContent = driverOne.Number;
    driverNumber[1].textContent = driverTwo.Number;
    // Driver Position
    driverCurrentPos[0].textContent = driverOne.Position;
    driverCurrentPos[1].textContent = driverTwo.Position;
    // Driver Points
    driverCurrentPnts[0].textContent = driverOne.Points;
    driverCurrentPnts[1].textContent = driverTwo.Points;
    // Quali Battle
    driverOne.qualiBattle = 0;
    driverTwo.qualiBattle = 0;
    for(let i = 0; i < driverOne.qualiResults.length; i++) {
        if(parseInt(driverOne.qualiResults[i]) < parseInt(driverTwo.qualiResults[i])) {
            driverOne.qualiBattle++;
        } else {
            driverTwo.qualiBattle++;
        }
    }
    driverQuali[0].textContent = driverOne.qualiBattle;
    driverQuali[1].textContent = driverTwo.qualiBattle;
    // Fastest Lap Battle
    driverOne.fastestLapsBattle = 0;
    driverTwo.fastestLapsBattle = 0;
    for(let i = 0; i < driverOne.fastestLaps.length; i++) {
        if(driverOne.fastestLaps[i] < driverTwo.fastestLaps[i]) {
            driverOne.fastestLapsBattle++;
        } else {
            driverTwo.fastestLapsBattle++;
        }
    }
    driverFastestLap[0].textContent = driverOne.fastestLapsBattle;
    driverFastestLap[1].textContent = driverTwo.fastestLapsBattle;
    // Places Gained/Lost
    driverOne.gained = 0;
    driverTwo.gained = 0;
    for(let i = 0; i < driverOne.qualiResults.length; i++) {
        driverOne.gained = driverOne.gained + (driverOne.qualiResults[i] - driverOne.finishes[i]);
        driverTwo.gained = driverTwo.gained + (driverTwo.qualiResults[i] - driverTwo.finishes[i]);
    }
    driverGained[0].textContent = driverOne.gained;
    driverGained[1].textContent = driverTwo.gained;
    // Avg Finish
    driverOne.avgFinish = 0;
    driverTwo.avgFinish = 0;
    for(let i = 0; i < driverOne.finishes.length; i++) {
        driverOne.avgFinish = driverOne.avgFinish + driverOne.finishes[i];
        driverTwo.avgFinish = driverTwo.avgFinish + driverTwo.finishes[i];
    };
    driverOne.avgFinish = (driverOne.avgFinish / driverOne.finishes.length);
    driverTwo.avgFinish = (driverTwo.avgFinish / driverTwo.finishes.length);
    driverAvgFinish[0].textContent = averageFinish = Math.round(driverOne.avgFinish * 10) / 10;
    driverAvgFinish[1].textContent = averageFinish = Math.round(driverTwo.avgFinish * 10) / 10;


}

selectOne.addEventListener('change', () => {
    fetchDriverData(0, selectOne.value);
});

selectTwo.addEventListener('change', () => {
    fetchDriverData(1, selectTwo.value);
});

// table__cell--win