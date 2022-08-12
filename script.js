import {
    generateUniverse,
    calculateNextGen,
    drawUniverseToCanvas,
    drawVerticalLine,
    drawHorizontalLine
} from './helper.js';

addEventListener('DOMContentLoaded', (event) => {

    let zoom = 2;
    let width = 256;
    let height = 192;
    let resScale = 4;
    let play = false;
    let interval;

    let canvas = document.getElementById('golCanvas');
    let counter = document.getElementById('counter');
    let timeoutDisplay = document.getElementById('timeout');
    let clearButton =document.getElementById('btn-clear');
    let playButton =document.getElementById('btn-play');
    let accButton =document.getElementById('btn-acc');
    let decButton =document.getElementById('btn-dec');
    let zoomButton =document.getElementById('btn-zoom');
    let randomButton =document.getElementById('btn-random');
    let verticalButton =document.getElementById('btn-verti');
    let horizontalButton =document.getElementById('btn-hori');
    let timeout = 160;
    timeoutDisplay.innerHTML = timeout;
    canvas.setAttribute("width", width/zoom*resScale)
    canvas.setAttribute("height", height/zoom*resScale)
    let ctx = canvas.getContext("2d");
    let myUniverse;
    
    let generateRandomUniverse =()=> {
        return generateUniverse(width/zoom, height/zoom, Math.min(Math.max(.1, Math.random()), 0.7))
    }
    myUniverse = generateRandomUniverse();
    drawUniverseToCanvas(myUniverse, canvas, ctx, resScale);

    let stop =()=> {
        clearInterval(interval)
        playButton.querySelector("i").innerHTML = "▶️"
        play = false;
    }
    let start =()=> {
        playButton.querySelector("i").innerHTML = "⏸"
        interval = setInterval(execution, timeout)
        play = true;
    }
    let reset =()=> {
        stop();
        counter.innerHTML = 0;
        myUniverse = generateUniverse(width/zoom, height/zoom, 0)
        drawUniverseToCanvas(myUniverse, canvas, ctx, resScale);

    }

    playButton.addEventListener('click',(e)=>{

        if (play) {
            stop()
        } else {
            start()
        }

        console.log(`play: ${play}`)
    })

    randomButton.addEventListener('click',(e)=>{
       myUniverse = generateRandomUniverse()
        drawUniverseToCanvas(myUniverse, canvas, ctx, resScale);
    })

    accButton.addEventListener('click',(e)=>{
        timeout = Math.max(timeout*0.5,10);
        timeoutDisplay.innerHTML = timeout;
        clearInterval(interval)
        interval = setInterval(execution, timeout)

    })

    decButton.addEventListener('click',(e)=>{
        timeout = Math.min(timeout*2,1280);
        timeoutDisplay.innerHTML = timeout;
        clearInterval(interval)
        interval = setInterval(execution, timeout)
    })

    verticalButton.addEventListener('click',(e)=>{

        // drawVerticalLine(myUniverse);
        myUniverse = drawVerticalLine(myUniverse)
        if (!play) {
            drawUniverseToCanvas(myUniverse, canvas, ctx, resScale);
        }
    })
    horizontalButton.addEventListener('click',(e)=>{

        // drawVerticalLine(myUniverse);
        myUniverse = drawHorizontalLine(myUniverse)
        if (!play) {
            drawUniverseToCanvas(myUniverse, canvas, ctx, resScale);
        }
    })

    clearButton.addEventListener('click',(e)=> {
        reset()
    })

    zoomButton.addEventListener('click',(e)=> {

        counter.innerHTML = 0;
        // zoom === 1 ? zoom = 2 : zoom = 1;
        if (zoom === 1) {
            zoom = 2;
            zoomButton.querySelector('span').innerHTML = '✕2'
        } else {
            zoom = 1
            zoomButton.querySelector('span').innerHTML = '✕1'
        }
        canvas.setAttribute("width", width/zoom*resScale)
        canvas.setAttribute("height", height/zoom*resScale)
        myUniverse = generateUniverse(width/zoom, height/zoom, 0)
        play = false;
        playButton.querySelector("i").innerHTML = "▶️"
        counter.innerHTML = 0;
        clearInterval(interval)
    })

    zoomButton.querySelector('span').innerHTML = '✕'+zoom;





    // DEBUG
    let debug = () => {
        console.log(myUniverse)
        let newUniverse = calculateNextGen(myUniverse)
        myUniverse = newUniverse.splice(0, myUniverse.length, ...newUniverse)
        console.log(myUniverse)
        drawUniverseToCanvas(myUniverse, canvas, ctx)
    }
    // debug();

    const execution = () => {
        counter.innerHTML++
        let newUniverse = calculateNextGen(myUniverse);
        myUniverse = newUniverse.splice(0, myUniverse.length, ...newUniverse);
        drawUniverseToCanvas(myUniverse, canvas, ctx, resScale);
    }






});