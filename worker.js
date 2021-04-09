/*
    Activity: Image processing using Web Workers
    Name: worker.js
    Authors:
        Exercise: Rodrigo Mendez Gamboa
        Solution: Carlos Andres Escalona Contreras
    Date: 07/04/2021
    Details:
*/
"use strict";

let currentPixels = null;
let width = null;
let height = null;

onmessage= function(event){
    console.log("Pixels received");
    console.log(event.data);
    console.log("Applying filter...");
    currentPixels = event.data.pixels.slice();
    width = event.data.width;
    height = event.data.height;
    processImage(event.data.color);
};

function getIndex(x,y){
    return (x + y * width)* 4;
}

function clamp(value){
    return Math.max(0, Math.min(Math.floor(value),255));
}


function addColor(x,y, value=[0,0,0]){
    const index = getIndex(x,y);
    let currentValue = null;
    // R_OFFSET = 0
    // G_OFFSET = 1
    // B_OFFSET = 2
    for (let i = 0; i < 3; i++) {
        if(value[i]!== 0){
            currentValue = currentPixels[i];
            currentPixels[index+i] = clamp(currentValue + value[i]);
        }
    }
}

function processImage(color){
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
            addColor(w,h,color);
        }
    }
    postMessage(currentPixels);
}