import {generateUniverse, calculateNextGen, drawUniverseToCanvas} from './helper.js';

addEventListener('DOMContentLoaded', (event) => {

    let zoom = 2;
    let width = 256;
    let height = 192;
    let resScale = 4;


    let canvas = document.getElementById('golCanvas');
    let counter = document.getElementById('counter');
    let timeoutDisplay = document.getElementById('timeout');
    let resetButton =document.getElementById('reset');
    let accButton =document.getElementById('acc');
    let decButton =document.getElementById('dec');
    let zoomButton =document.getElementById('zoom');
    let timeout = 160;
    timeoutDisplay.innerHTML = timeout;
    canvas.setAttribute("width", width/zoom*resScale)
    canvas.setAttribute("height", height/zoom*resScale)
    let ctx = canvas.getContext("2d");
    let myUniverse = generateUniverse(width/zoom, height/zoom, Math.min(Math.max(.3, Math.random()), 0.7))

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

    resetButton.addEventListener('click',(e)=> {
        counter.innerHTML = 0;
        myUniverse = generateUniverse(width, height, Math.min(Math.max(.3, Math.random()), 0.7))
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
        myUniverse = generateUniverse(width/zoom, height/zoom, Math.min(Math.max(.3, Math.random()), 0.7))
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


    let interval = setInterval(execution, timeout)




});