const createCoordinates = (numberOfPoints) => {
    const coordinates = []
    let pointsCreated = 0
    while(pointsCreated < numberOfPoints){
        let x = randomIntFromInterval(0, 50)
        let y = randomIntFromInterval(0, 50)
        while(coordinates.some((coordinate)=> coordinate.x === x && coordinate.y === y)){
            x = randomIntFromInterval(0, 50)
            y = randomIntFromInterval(0, 50)
        }
        pointsCreated++
        coordinates.push({x,y})
    }
    return coordinates
}

const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export {createCoordinates}
