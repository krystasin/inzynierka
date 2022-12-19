import { parseStats } from "./parser.js"
import { printMessage } from "./message.js"
const defaultStatName = 'min'
const defaultStatType = 'models'
var myNewChart = null;
var globalStats = []
var globalXLabels = []
var globalStatName = defaultStatName
var globalStatsType = defaultStatType
var globalSelectedModels = getCeckedChildren('modeleFormId')
var globalSelectedDomains = getCeckedChildren('domenyFormId')


function getSelectedRadioButton(radioButtonName) {
    var radioButtons = document.getElementsByName(radioButtonName);

    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            return radioButtons[i].value;
        }
    }
    return null;
}

window.addEventListener('load', () => {
    var radioButtons = document.getElementsByName("statName-n");
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener("change", function () {
            globalStatName = getSelectedRadioButton("statName-n")
            refreshChart()
        });
    }

    var radioButtons = document.getElementsByName("stats-type-n");
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener("change", function () {
            globalStatsType = getSelectedRadioButton("stats-type-n")
            refreshChart()
        });
    }

    document.getElementById('reloadStatsBtn').addEventListener('click', () => {
        console.log('loading new data.');
        drawChart()
    })

    drawChart()
})

function drawChart() {
    const selectedDomains = getCeckedChildren('domenyFormId')
    const selectedModels = getCeckedChildren('modeleFormId')
    if (selectedDomains.length == 0 || selectedModels.length == 0) return printMessage('nie wubrano żadnej domeny lub modelu', 3000);
    console.log('Creating request for: \n==>> ' + selectedDomains + '\n==>> ' + selectedModels);
    globalSelectedDomains = selectedDomains
    globalSelectedModels = selectedModels

    fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            domains: selectedDomains,
            models: selectedModels
        })
    })
        .then((response) => response.json())
        .then(data => parseStats(data))
        .then((parsedData) => {
            globalStats = parsedData.stats
            globalXLabels = parsedData.dates
            globalStatName = getSelectedRadioButton('statName-n')

            if (myNewChart != null) myNewChart.destroy()
            myNewChart = new Chart(
                document.getElementById('acquisitions'),
                getConfig()
            );
        });
}



function getCeckedChildren(parentId) {
    const checkBoxes = document.querySelectorAll(`#${parentId} .checkBoxCls`);
    return [...checkBoxes].filter(el => el.checked).map(el => el.name);
}


function refreshChart() {
    myNewChart.data.datasets = prepareDatasets()
    myNewChart.data.labels = prepareXlabels()
    myNewChart.update()
}




function getSelectedStatistic(gpuObj, statName) {
    return gpuObj.model_stats.map((e) => { return !e ? null : e[statName] });
}

function prepareDatasets() {
    return (globalStatsType == 'models') ? getDatasetsForModelsStats() : getDatasetsForDomainsStats()

}
function getDatasetsForDomainsStats() {

    var domeny = getCeckedChildren('domenyFormId')
    return domeny.map(domena => {
        return {
            label: domena,
            data: getAveragePricesInDomain(domena, globalStatName)
        }
    });
}
function getDatasetsForModelsStats() {
    return globalStats.map(gpuObj => ({
        label: `${gpuObj.domena} ${gpuObj.model}`,
        data: getSelectedStatistic(gpuObj, globalStatName),
    }));
}


function getAveragePricesInDomain(domain, statName) {
    const modeleStats = globalStats.filter(e => e.domena === domain)
    const arrays = modeleStats.map(gpuObj => getSelectedStatistic(gpuObj, statName))
    return avgArrays(arrays)
    return sumArrays(arrays)
}

function avgArrays(arrays) {
    const maxLength = Math.max(...arrays.map(array => array.length));
    const result = new Array(maxLength).fill(0);

    for (let i = 0; i < maxLength; i++) {
        let sum = 0;
        let count = 0;
        for (let j = 0; j < arrays.length; j++) {
            if (arrays[j][i] !== undefined) {
                sum += arrays[j][i];
                count++;
            }
        }
        result[i] = sum / count;
    }

    return result;
}




function getConfig() {
    const myDatasets = prepareDatasets()
    const myLabels = prepareXlabels()

    const config = {
        type: 'line',
        data: {
            labels: myLabels,
            datasets: myDatasets
        },
        options: getOptions(myLabels),


    }
    return config
}
function prepareXlabels() {
    return globalXLabels.map(e => new Date(e).setHours(0, 0, 0, 0))
}


function getActions() {
    return [
        {
            name: 'Remove Dataset',
            handler(chart) {
                chart.data.datasets.pop();
                chart.update();
            }
        }
    ]
}





function getOptions(myLabels) {
    return {
        spanGaps: true,
        responsive: true,
        plugins: {
            legend: {
                position: 'left',
            },
            title: {
                display: true,
                text: globalStatName
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            x: {
                type: 'timeseries',
                time: {
                    unit: 'day',
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                },

                min: myLabels.at(0),
                max: myLabels.at(-1)
            },
            y: {
                type: 'linear',
            }
        },
        actions: getActions()
    }
}
















// ? nieużywana jak narazie
function sumArrays(arrays) {
    const maxLength = Math.max(...arrays.map(array => array.length));
    const result = new Array(maxLength).fill(0);

    for (let i = 0; i < maxLength; i++) {
        for (let j = 0; j < arrays.length; j++) {
            result[i] += arrays[j][i] || 0;
        }
    }

    return result;
}

