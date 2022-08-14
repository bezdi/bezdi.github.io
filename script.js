import {
    generateUniverse,
    calculateNextGen,
    drawUniverseToCanvas,
    drawVerticalLine,
    drawHorizontalLine,
    addRandomCells
} from './helper.js';


addEventListener('DOMContentLoaded', (event) => {

    // let cellSize = 2;
    // let width = 257;
    // // let height = 192;
    // let height = 145;
    // let resScale = 8;
    // let transition = true;
    // let play = false;
    // let interval;

    // Display Object
    let d = {
        canvas: document.getElementById('golCanvas'),
        cellSize: 2,
        width: 257,
        height: 145,
        resScale: 8,
        transition: true,
        play: true,
        interval: null,
        timeout: 160,
        timeoutMin: 10,
        timeoutMax: 1280,
        colors: {
            alive: "#096A5F",
            dead: "#FFEACE",
            aliveDim: "rgba(9,106,95,0.2)",
            deadDim: "rgba(255,234,206,0.2)",
        }
    }
    d.ctx = d.canvas.getContext("2d")

    // let canvas = document.getElementById('golCanvas');
    let counter = document.getElementById('counter');
    let timeoutDisplay = document.getElementById('timeout');

    let clearButton = document.getElementById('btn-clear');
    let playButton = document.getElementById('btn-play');
    let accButton = document.getElementById('btn-acc');
    let decButton = document.getElementById('btn-dec');
    let resolutionButton = document.getElementById('btn-zoom');
    let randomButton = document.getElementById('btn-random');
    let verticalButton = document.getElementById('btn-verti');
    let horizontalButton = document.getElementById('btn-hori');
    let modeButton = document.getElementById('btn-mode');


    // let ctx = canvas.getContext("2d");
    let myUniverse;

    let cellPalette = ["#096A5F", "#FFEACE"]
    let transparentCellPalette = ["#096A5F", "rgba(255,234,206,.2)"]
    let addPalette = ["#096A5F", "rgba(255,255,255,0)"]
    let removePalette = ["rgba(255,234,206,0)", "#FFEACE"]


    // ---------------------------------
    // ---------------------------------
    // Actions


    const stop = () => {
        clearInterval(d.interval)
        playButton.classList.remove('play')
        playButton.classList.add('pause')
        d.play = false;
    }
    const start = () => {
        playButton.classList.remove('pause')
        playButton.classList.add('play')
        d.interval = setInterval(execution, d.timeout)
        d.play = true;
    }
    const togglePlay = () => {
        if (d.play) {
            stop()
        } else {
            start()
        }
    }
    const reset = () => {
        stop();
        counter.innerHTML = 0;
        myUniverse = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, 0)
        drawUniverseToCanvas(myUniverse, d.canvas, d.ctx, d.resScale, [d.colors.alive,d.colors.dead]);
    }
    const clear = () => {
        myUniverse = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, 0)
        drawUniverseToCanvas(myUniverse, d.canvas, d.ctx, d.resScale, [d.colors.alive,d.colors.dead]);
    }
    const random = (remove) => {
        myUniverse = addRandomCells(myUniverse, d,0.033, remove);
    }
    const setSpeedButtonsState = () => {

        if (d.timeout <= d.timeoutMin) {
            accButton.classList.add('disabled')
            accButton.setAttribute('tabindex', '-1')
        } else {
            accButton.classList.remove('disabled')
            accButton.setAttribute('tabindex', '5')
        }

        if (d.timeout >= d.timeoutMax) {
            decButton.classList.add('disabled')
            decButton.setAttribute('tabindex', '-1')
        } else {
            decButton.classList.remove('disabled')
            decButton.setAttribute('tabindex', '5')
        }

    }
    const setTimeoutDisplay = () => {
        timeoutDisplay.innerHTML = d.timeout + " ms";
    }
    const accelerate = () => {
        d.timeout = Math.max(d.timeout * 0.5, 10);
        setTimeoutDisplay();
        clearInterval(d.interval)
        setSpeedButtonsState()
        if (d.play) {
            d.interval = setInterval(execution, d.timeout)
        }
    }
    const decelerate = () => {
        d.timeout = Math.min(d.timeout * 2, 1280);
        setTimeoutDisplay()
        clearInterval(d.interval)
        setSpeedButtonsState()
        if (d.play) {
            d.interval = setInterval(execution, d.timeout)
        }
    }
    const verticalLine = (center, remove) => {
        // universe, canvas, ctx, resScale, center, remove, palette
        myUniverse = drawVerticalLine(myUniverse, d, center, remove)
    }
    const horizontalLine = (center, remove) => {
        myUniverse = drawHorizontalLine(myUniverse, d, center, remove)
        // if (!d.play) {
        //     drawUniverseToCanvas(myUniverse, d.canvas, d.ctx, d.resScale, transition ? transparentCellPalette : cellPalette);
        // }
    }
    const setResolution = (cs) => {
        counter.innerHTML = 0;
        d.cellSize = cs;
        resolutionButton.querySelector('span').innerHTML = 'x' + cs;
        resolutionButton.className = "";
        resolutionButton.classList.add("res" + cs);
        d.canvas.setAttribute("width", d.width / d.cellSize * d.resScale)
        d.canvas.setAttribute("height", d.height / d.cellSize * d.resScale)
        myUniverse = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, 0)
        reset();
    }
    const toggleResolution = () => {
        d.cellSize === 1 ? setResolution(2) : setResolution(1);
    }
    const toggleRenderMode = () => {
        d.transition = !d.transition;
        modeButton.classList = "";
        modeButton.classList.add(d.transition ? "trans" : "sharp");
    }


    // ---------------------------------
    // ---------------------------------
    // Init

    // myUniverse = generateUniverse(width / zoom, height / zoom, Math.min(Math.max(.1, Math.random()), 0.7));
    setResolution(d.cellSize)
    stop();
    setTimeoutDisplay();
    modeButton.classList.add(d.transition ? "trans" : "sharp");
    d.canvas.setAttribute("width", d.width / d.cellSize * d.resScale)
    d.canvas.setAttribute("height", d.height / d.cellSize * d.resScale)
    myUniverse = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, .07)
    drawUniverseToCanvas(myUniverse, d.canvas, d.ctx, d.resScale, cellPalette);


    // ---------------------------------
    // ---------------------------------
    // Buttons

    document.addEventListener('keypress', (e) => {
        console.log(e.key)
        if (e.key === 'p') {
            togglePlay()
        }
        if (e.key === 'f') {
            accelerate()
        }
        if (e.key === 's') {
            decelerate()
        }
        if (e.key === 'r') {
            random()
        }
    })

    playButton.addEventListener('click', (e) => {
        // console.log(e)
        // togglePlay()
        e.shiftKey ? reset() : togglePlay();

    })
    playButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            togglePlay()
        }
    })

    randomButton.addEventListener('click', (e) => {
        random(e.shiftKey)
    })
    randomButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            random(e.shiftKey)
        }
    })
    randomButton.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        random(true)
    });

    accButton.addEventListener('click', (e) => {
        accelerate()
    })
    accButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            accelerate()
        }
    })

    decButton.addEventListener('click', (e) => {
        decelerate()
    })
    decButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            decelerate()
        }
    })

    modeButton.addEventListener('click', (e) => {
        toggleRenderMode()
    })
    modeButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleRenderMode()
        }
    })

    verticalButton.addEventListener('click', (e) => {

        e.stopPropagation()
        console.log(e)
        verticalLine(e.shiftKey, false)
    })
    verticalButton.addEventListener('keypress', (e) => {

        e.stopPropagation()
        if (e.key === 'Enter' || e.key === ' ') {
            verticalLine(e.shiftKey, false)
        }
    })
    verticalButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        verticalLine(e.shiftKey, true)
    });
    horizontalButton.addEventListener('click', (e) => {

        e.stopPropagation()
        horizontalLine(e.shiftKey, false)
    })
    horizontalButton.addEventListener('keypress', (e) => {

        e.stopPropagation()
        if (e.key === 'Enter' || e.key === ' ') {
            horizontalLine(e.shiftKey, false)
        }
    })
    horizontalButton.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        horizontalLine(e.shiftKey, true)
    });

    clearButton.addEventListener('click', (e) => {
        clear();
    })

    resolutionButton.addEventListener('click', (e) => {
        toggleResolution();

    })

    resolutionButton.querySelector('span').innerHTML = 'x' + d.cellSize;


    // ---------------------------------
    // ---------------------------------
    // DEBUG

    let debug = () => {
        console.log(myUniverse)
        let newUniverse = calculateNextGen(myUniverse)
        myUniverse = newUniverse.splice(0, myUniverse.length, ...newUniverse)
        console.log(myUniverse)
        drawUniverseToCanvas(myUniverse, canvas, ctx)
    }
    // debug();


    // ---------------------------------
    // ---------------------------------
    // EXECUTION

    const execution = () => {
        counter.innerHTML++
        let newUniverse = calculateNextGen(myUniverse);
        myUniverse = newUniverse.splice(0, myUniverse.length, ...newUniverse);
        drawUniverseToCanvas(myUniverse, d.canvas, d.ctx, d.resScale, d.transition ? [d.colors.alive,d.colors.deadDim] : [d.colors.alive,d.colors.dead]);
    }


});