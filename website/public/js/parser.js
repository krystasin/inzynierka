import { a } from "./a.js"


export function parseStats(resp) {
    const statsArray = []
    const queryResultArray = resp.query_result
    const dates = queryResultArray.map(l => l.date)
    if (isEmpty(dates)) return []

    const domeny = resp.selected.domains
    const modele = resp.selected.models

    domeny.forEach(d => {
        modele.forEach(m => {
            statsArray.push({
                'domena': d,
                'model': m,
                'model_stats': queryResultArray.map(l => l.stats[d][m])
            })
        })

    })

    return {
        dates: dates,
        stats: statsArray
    }
}







function isEmpty(array) {
    if (array.length == 0) {
        console.warn('array is empty !', array)
        return true
    }
    return false
}





function getTitle_static(index) {
    const titles = [
        "Minimalne ceny kart graficznych",
        "Średnie ceny w sklepach"
    ]
}

function getUniqueModels_static(index) {
    var models_is_charts = [
        [
            'GeForce RTX 3050',
            'GeForce RTX 3060',
            'Radeon RX 6700 XT',
            'Radeon RX 6800 XT'
        ],
        [
            'GeForce RTX 3050',
            'GeForce RTX 3060',
            'Radeon RX 6700 XT'
        ]
    ]
    return models_is_charts[index % models_is_charts.length]
}


// ? low performance
// function getUniqueKeysFromArray(list) {
//     console.log('getUniqueKeysFromArray: ');
//     var sD = []
//     var sM = []
//     list.forEach(doc => {
//         const domeny = Object.keys(doc.stats)
//         domeny.forEach(el => sD.push(el))
//         domeny.forEach(d => {
//             const m1 = Object.keys(doc.stats[d])
//             m1.forEach(el => sM.push(el))
//         })
//     })
//     const s = new Set(sD)
//     const m = new Set(sM)
//     console.log(s);
//     console.log(m);

// }