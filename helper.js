const generateUniverse = (width, height, chance) => {
    let universe = [];
    if (!chance) {
        chance = 0
    }

    for (let i = 0; i < height; i++) {
        universe.push([])
    }
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < width; j++) {
            universe[i].push(Math.round(Math.abs(Math.random() + chance - .5)))
        }
    }
    return universe;
}

const addRandomCells = (universe, d, chance, remove) => {
    let universeHeight = universe.length;
    let universeWidth = universe[0].length;

    for (let y = 0; y < universeHeight; y++) {
        for (let x = 0; x < universeWidth; x++) {
            if (Math.round(Math.abs(Math.random() + chance - .5))) {
                let value = remove ? 0 : 1;
                universe[y][x] = value;
                drawCellToCanvas(x, y, d, remove ? d.colors.dead : d.colors.alive);
            }
        }
    }

    return universe;
}

const drawVerticalLine = (universe, d, center, remove) => {
    let cell = remove ? 0 : 1;
    let width = universe[0].length;
    const x = center ? Math.floor(width / 2) : Math.floor(width * Math.random())
    for (let y = 0; y < universe.length; y++) {
        universe[y][x] = cell;
        drawCellToCanvas(x, y, d, remove ? d.colors.dead : d.colors.alive);
    }
    return universe;
}

const drawHorizontalLine = (universe, d, center, remove) => {
    let cell = remove ? 0 : 1;
    let height = universe.length;
    const y = center ? Math.floor(height / 2) : Math.floor(height * Math.random())

    for (let x = 0; x < universe[y].length; x++) {
        universe[y][x] = cell;
        drawCellToCanvas(x, y, d, remove ? d.colors.dead : d.colors.alive);
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

const decidingTheFaithOfACell = (alive, numOfNeighbours) => {
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
            newUniverse[y][x] = decidingTheFaithOfACell(universe[y][x], countNeighbours(universe, x, y));
        }
    }

    return newUniverse;
}


const drawUniverseToCanvas = (universe, canvas, ctx, resScale, palette) => {
    for (let y = 0; y < universe.length; y++) {
        for (let x = 0; x < universe[y].length; x++) {
            // universe[y][x] ? ctx.fillStyle = "#096A5F" : ctx.fillStyle = "#FFEACE";
            universe[y][x] ? ctx.fillStyle = palette[0] : ctx.fillStyle = palette[1];
            ctx.fillRect(x * resScale, y * resScale, 1 * resScale, 1 * resScale);
        }
    }
}

const drawCellToCanvas = (x, y, d, color) => {
    d.ctx.fillStyle = color;
    d.ctx.fillRect(x * d.resScale, y * d.resScale, 1 * d.resScale, 1 * d.resScale);
}


export {
    generateUniverse,
    countNeighbours,
    calculateNextGen,
    drawUniverseToCanvas,
    drawVerticalLine,
    drawHorizontalLine,
    addRandomCells
};
