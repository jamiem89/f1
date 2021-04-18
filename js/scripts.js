//Previous round setup
var currentRequest = new XMLHttpRequest();
currentRequest.open('GET', 'http://ergast.com/api/f1/current/last/results.json', true);

currentRequest.onload = function() {
    if (this.status >= 200 && this.status < 400) {

        // Previous round data
        const data = JSON.parse(this.response);

        //previous round setup
        const currentCircuit = data.MRData.RaceTable.Races[0].Circuit.circuitId;
        const currentResults = [
            {
                driver: data.MRData.RaceTable.Races[0].Results[0].Driver.familyName,
                time: data.MRData.RaceTable.Races[0].Results[0].Time.time,
            },
            {
                driver: data.MRData.RaceTable.Races[0].Results[1].Driver.familyName,
                time: data.MRData.RaceTable.Races[0].Results[1].Time.time,
            },
            {
                driver: data.MRData.RaceTable.Races[0].Results[2].Driver.familyName,
                time: data.MRData.RaceTable.Races[0].Results[2].Time.time,
            }
        ];

        const currentResultsHTML = document.querySelector(`#currentResults`);
        let currentResultsInnerHTML = '<ol>';

        for (let i = 0; i < currentResults.length; i++) {
            currentResultsInnerHTML += `<li class="h3">${currentResults[i].driver}<span class="text-sml text-highlight">${currentResults[i].time}</span></li>`
        }

        currentResultsInnerHTML += `</ol>`;
        currentResultsHTML.innerHTML = currentResultsInnerHTML;

        const currentCircuitHTML = document.querySelector(`#currentCircuit`);

        currentCircuitHTML.innerHTML = `<img src="./img/circuit__${currentCircuit}.png" alt="">`;




    } else {
      console.log(`no results`);
    }
}

currentRequest.send();