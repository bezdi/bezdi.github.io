let canvasData = [];


const generateUniverse = (width, height, chance) => {
    let data = [];
    if (!chance) {
        chance = 0
    }
    ;

    for (let i = 0; i < height; i++) {
        data.push([])
    }
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < width; j++) {
            data[i].push(Math.round(Math.abs(Math.random() + chance - .5)))
        }
    }
    return data;
}

const drawVerticalLine = (universe) => {
    const col = Math.floor(universe[0].length * Math.random())
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe[i].length; j++) {
            if (col == j) {
                universe[i][j] = 1;
            }
        }
    }
    return universe;
}

const drawHorizontalLine = (universe) => {

    const row = Math.floor(universe.length * Math.random())

    for (let i = 0; i < universe[row].length; i++) {
        universe[row][i] = 1;
    }
    return universe;

}


const countNeighbours = (universe, cellX, cellY) => {
    let universeHeight = universe.length;
    let universeWidth = universe[0].length;
    let numOfNeighbours = 0;
    let neighbourRelCoordinates = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]


    for (let i = 0; i < neighbourRelCoordinates.length; i++) {
        let neighbourX = cellX + neighbourRelCoordinates[i][0];
        let neighbourY = cellY + neighbourRelCoordinates[i][1];

        if ((neighbourX >= 0 && neighbourX <= universeWidth - 1) && (neighbourY >= 0 && neighbourY <= universeHeight - 1)) {
            numOfNeighbours += universe[neighbourY][neighbourX]
        }
    }

    return numOfNeighbours;

}

const decidingTheFaithOfTheCell = (alive, numOfNeighbours) => {
// # Rules
// 1. Any live cell with two or three live neighbours survives.
// 2. Any dead cell with three live neighbours becomes a live cell.
// 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

    if (alive && (numOfNeighbours >= 2 && numOfNeighbours <= 3)) {
        return 1;
    }

    if (!alive && numOfNeighbours == 3) {
        return 1;
    }

    return 0;

}


const calculateNextGen = (universe) => {
    let newUniverse = generateUniverse(universe[0].length, universe.length, 0);


    for (let y = 0; y < universe.length; y++) {
        for (let x = 0; x < universe[y].length; x++) {
            newUniverse[y][x] = decidingTheFaithOfTheCell(universe[y][x], countNeighbours(universe, x, y));
        }
    }

    return newUniverse;
}


const drawUniverseToCanvas = (universe, canvas, ctx, resScale) => {
    for (let y = 0; y < universe.length; y++) {
        for (let x = 0; x < universe[y].length; x++) {
            universe[y][x] ? ctx.fillStyle = "#096A5F" : ctx.fillStyle = "#FFEACE";
            ctx.fillRect(x * resScale, y * resScale, 1 * resScale, 1 * resScale);
        }
    }
}


export {
    generateUniverse,
    countNeighbours,
    calculateNextGen,
    drawUniverseToCanvas,
    drawVerticalLine,
    drawHorizontalLine
};
