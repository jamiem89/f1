const roundButton = document.querySelector('#rounds');
const selectOne = document.querySelector('#driver-select-one');
const selectTwo = document.querySelector('#driver-select-two');

let currentPos1 = document.querySelector('#currentPos1');
let currentPoints1 = document.querySelector('#currentPoints1');
let qualiBattle1 = document.querySelector('#qualiBattle1');
let fasestLapBattle1 = document.querySelector('#fastestLapBattle1');
let placesGained1 = document.querySelector('#placesGained1');
let avgFinish1 = document.querySelector('#avgFinish1');
let avgSpeed1 = document.querySelector('#avgSpeed1');


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
driverList('http://ergast.com/api/f1/2021/drivers.json');


// PREPARE DRIVER DATA
// Populate driver one
function driverData(data) {
    fetchData(data).then(data => generateDriverData(data));
}

function generateDriverData(data) {
    // Get overall standings data
    let roundData = data.MRData.RaceTable.Races;
    let driverID = data.MRData.RaceTable.driverId;
    let currentPos = 0;
    let currentPoints = 0;

    let driverOneData = {
        raceNumber: 0,
        familyName: '',
        currentPos: 0,
        currentPoints: 0,
        qualiBattle: [],
        fastestLapBattle: [],
        placesGained: 0,
        averageFinish: [],
        averageSpeed: [],
        battlePoints: 0
    };

    let averageSpeed = 0;
    let averageFinish = 0;

    for(let i = 0; i < roundData.length; i++) {
        let round = roundData[i].Results[0];
        let position = round.position;
        let qualified = round.grid;
        let fastestLapPos = 20;
        if(round.FastestLap) {
            let fastestLapPos = round.FastestLap.rank;
        };
        let avgSpeed = 0;
        if(round.FastestLap) {
            avgSpeed = round.FastestLap.AverageSpeed.speed;
        } else {
            avgSpeed = 0;
        }
        // Add all the round info to the relevant object arrays
        driverOneData.qualiBattle.push(qualified);
        driverOneData.fastestLapBattle.push(fastestLapPos);
        driverOneData.placesGained = driverOneData.placesGained + (qualified - position);
        driverOneData.averageFinish.push(position);
        driverOneData.averageSpeed.push(avgSpeed);
    }

    // Avg speed
    for(let i = 0; i < driverOneData.averageSpeed.length; i++) {
        averageSpeed = averageSpeed + parseInt(driverOneData.averageSpeed[i]);
        console
    };
    averageSpeed = averageSpeed / driverOneData.averageSpeed.length;
    // Convert to mph
    averageSpeed = averageSpeed / 1.609;
    averageSpeed = Math.round(averageSpeed * 100) / 100

    // Avg finish
    for(let i = 0; i < driverOneData.averageFinish.length; i++) {
        averageFinish = averageFinish + parseInt(driverOneData.averageFinish[i]);
    };
    averageFinish = averageFinish / driverOneData.averageSpeed.length;
    averageFinish = Math.round(averageFinish * 100) / 100

    // Update table with current drivers stats
    currentPos1.textContent = currentPos;
    currentPoints1.textContent = currentPoints;
    qualiBattle1.textContent = 0;
    fasestLapBattle1.textContent = 0;
    placesGained1.textContent = driverOneData.placesGained;
    avgFinish1.textContent = averageFinish;
    avgSpeed1.textContent = `${averageSpeed}mph`;

};

selectOne.addEventListener('change', () => {
    driverData(`http://ergast.com/api/f1/2021/drivers/${selectOne.value}/results.json`);
});