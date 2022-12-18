 function getProjection2(index) {
    const projections = [
        {
            date: 1,
            'stats.morele.GeForce RTX 3050': 1,
            'stats.morele.GeForce RTX 3060': 1,
            'stats.morele.Radeon RX 6700 XT': 1,
            'stats.morele.Radeon RX 6800 XT': 1,
            'stats.x-kom.GeForce RTX 3050': 1,
            'stats.x-kom.GeForce RTX 3060': 1,
            'stats.x-kom.Radeon RX 6700 XT': 1,
            'stats.x-kom.Radeon RX 6800 XT': 1
        },
        {
            date: 1,
            'stats.morele.GeForce RTX 3050': 1,
            'stats.morele.GeForce RTX 3060': 1,
            'stats.morele.Radeon RX 6700 XT': 1,
            'stats.x-kom.GeForce RTX 3050': 1,
            'stats.x-kom.GeForce RTX 3060': 1,
            'stats.x-kom.Radeon RX 6700 XT': 1,
        }
    ]
    return projections[index % projections.length]
}


