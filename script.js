import {
    generateUniverse,
    calculateNextGen,
    drawUniverseToCanvas,
    drawVerticalLine,
    drawHorizontalLine,
    addRandomCells,
    drawCellToCanvas
} from './helper.js';


addEventListener('DOMContentLoaded', (event) => {

    // Display Object
    let d = {
        canvas: document.getElementById('golCanvas'),
        cellSize: parseInt(localStorage.getItem('cellSize')) || 2,
        width: 256,
        height: 128,
        resScale: 8,
        transition: JSON.parse(localStorage.getItem('transition')) || false,
        play: true,
        interval: null,
        timeout: parseInt(localStorage.getItem('timeout')) || 160,
        timeoutMin: 10,
        timeoutMax: 1280,
        colors: {
            alive: "#d35281",
            dead: "#001F53",
            aliveDim: "#FFB359",
            deadDim: "rgba(0,31,83,0.2)",
        },
    }
    d.ctx = d.canvas.getContext("2d")

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

    let  universe = [];


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
        universe = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, 0)
        drawUniverseToCanvas(universe, d.canvas, d.ctx, d.resScale, [d.colors.alive, d.colors.dead]);
    }
    const clear = () => {
        universe = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, 0)
        drawUniverseToCanvas(universe, d.canvas, d.ctx, d.resScale, [d.colors.alive, d.colors.dead]);
    }
    const random = (remove) => {
        universe = addRandomCells(universe, d, 0.033, remove);
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
        localStorage.setItem('timeout', d.timeout)
        setTimeoutDisplay();
        clearInterval(d.interval)
        setSpeedButtonsState()
        if (d.play) {
            d.interval = setInterval(execution, d.timeout)
        }
    }
    const decelerate = () => {
        d.timeout = Math.min(d.timeout * 2, 1280);
        localStorage.setItem('timeout', d.timeout)
        setTimeoutDisplay()
        clearInterval(d.interval)
        setSpeedButtonsState()
        if (d.play) {
            d.interval = setInterval(execution, d.timeout)
        }
    }
    const verticalLine = (center, remove) => {
        // universe, canvas, ctx, resScale, center, remove, palette
        universe = drawVerticalLine(universe, d, center, remove)
    }
    const horizontalLine = (center, remove) => {
        universe = drawHorizontalLine(universe, d, center, remove)
        // if (!d.play) {
        //     drawUniverseToCanvas(universe, d.canvas, d.ctx, d.resScale, transition ? transparentCellPalette : cellPalette);
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
        universe = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, 0)
        reset();

    }
    const toggleResolution = () => {
        d.cellSize === 1 ? setResolution(2) : setResolution(1);
        localStorage.setItem('cellSize', d.cellSize)
    }
    const toggleRenderMode = () => {
        d.transition = !d.transition;
        modeButton.classList = "";
        modeButton.classList.add(d.transition ? "trans" : "sharp");
        localStorage.setItem('transition', JSON.stringify(d.transition))
    }


    // ---------------------------------
    // ---------------------------------
    // Init

    // universe = generateUniverse(width / zoom, height / zoom, Math.min(Math.max(.1, Math.random()), 0.7));
    setResolution(d.cellSize)
    stop();
    setTimeoutDisplay();
    modeButton.classList.add(d.transition ? "trans" : "sharp");
    d.canvas.setAttribute("width", d.width / d.cellSize * d.resScale)
    d.canvas.setAttribute("height", d.height / d.cellSize * d.resScale)
    universe = generateUniverse(d.width / d.cellSize, d.height / d.cellSize, .07)
    drawUniverseToCanvas(universe, d.canvas, d.ctx, d.resScale, [d.colors.alive, d.colors.dead]);


    // ---------------------------------
    // ---------------------------------
    // Controls

    document.addEventListener('keypress', (e) => {
        console.log(e.key)
        if (e.key === 'p' || e.key === ' ') {
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
        if (e.key === 'R') {
            random(true)
        }
        if (e.key === 'h') {
            horizontalLine()
        }
        if (e.key === 'H') {
            horizontalLine(true)
        }
        if (e.key === 'v') {
            verticalLine()
        }
        if (e.key === 'V') {
            verticalLine(true)
        }
        if (e.key === 'm') {
            toggleRenderMode();
        }
        if (e.key === '0') {
            clear()
        }

    })

    playButton.addEventListener('click', (e) => {
        // console.log(e)
        // togglePlay()
        e.shiftKey ? reset() : togglePlay();

    })
    playButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            togglePlay()
        }
    })

    randomButton.addEventListener('click', (e) => {
        random(e.shiftKey)
    })
    randomButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
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
            e.stopPropagation()
            accelerate()
        }
    })

    decButton.addEventListener('click', (e) => {
        decelerate()
    })
    decButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            decelerate()
        }
    })

    modeButton.addEventListener('click', (e) => {
        toggleRenderMode()
    })
    modeButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            toggleRenderMode()
        }
    })

    verticalButton.addEventListener('click', (e) => {

        console.log(e)
        verticalLine(e.shiftKey, false)
    })
    verticalButton.addEventListener('keypress', (e) => {

        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            verticalLine(e.shiftKey, false)
        }
    })
    verticalButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        verticalLine(e.shiftKey, true)
    });
    horizontalButton.addEventListener('click', (e) => {

        horizontalLine(e.shiftKey, false)
    })
    horizontalButton.addEventListener('keypress', (e) => {

        // e.stopPropagation()
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            horizontalLine(e.shiftKey, e.ctrlKey)
        }
    })
    horizontalButton.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        horizontalLine(e.shiftKey, true)
    });

    clearButton.addEventListener('click', (e) => {
        clear();
    })
    clearButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            clear();
        }
    })

    resolutionButton.addEventListener('click', (e) => {
        toggleResolution();
    })
    resolutionButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            toggleResolution();
        }
    })

    resolutionButton.querySelector('span').innerHTML = 'x' + d.cellSize;


    // ---------------------------------
    // ---------------------------------
    // Draw on Canvas

    d.canvas.addEventListener('click', (e) => {
        let rect = e.target.getBoundingClientRect();
        const clickXRatio = (e.clientX - rect.left) / rect.width;
        const clickYRatio = (e.clientY - rect.top) / rect.height;
        const uniX = Math.floor(universe[0].length*clickXRatio);
        const uniY = Math.floor(universe.length*clickYRatio);
        // console.log("Left: " + x + " ; Top: " + y + ".");
        console.log(`Left:${uniX} ratio Right:${uniY} ratio`);


        universe[uniY][uniX] ? universe[uniY][uniX] = 0 : universe[uniY][uniX] = 1;
        drawCellToCanvas(uniX,uniY,d,universe[uniY][uniX] ? d.colors.alive : d.colors.dead)

    })


    // ---------------------------------
    // ---------------------------------
    // DEBUG

    let debug = () => {
        console.log(universe)
    }
    // debug();


    // ---------------------------------
    // ---------------------------------
    // EXECUTION

    const execution = () => {
        counter.innerHTML++
        let newUniverse = calculateNextGen(universe);
        universe = newUniverse.splice(0, universe.length, ...newUniverse);
        drawUniverseToCanvas(universe, d.canvas, d.ctx, d.resScale, d.transition ? [d.colors.alive, d.colors.deadDim] : [d.colors.alive, d.colors.dead]);
    }


});