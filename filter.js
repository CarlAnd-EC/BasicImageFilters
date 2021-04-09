/*
    Activity: Image processing using Web Workers
    Name: filter.js
    Authors:
        Exercise: Rodrigo Mendez Gamboa
        Solution: Carlos Andres Escalona Contreras
    Date: 07/04/2021
    Details:
*/
"use strict";

const filterWorker = new Worker("./worker.js");

function spin(){
    const spinner = document.getElementById("spinner");
    let angle = 0;
    setInterval(() => {
        angle++;
    spinner.style.transform = `rotate(${angle}deg)`;
    }, 1);
}

spin();

const fileInput = document.getElementById("imgInput");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const srcImage = new Image();

let imgData = null;

fileInput.onchange = function(event){
    if(event.target.files && event.target.files.item(0)){
        srcImage.src = URL.createObjectURL(event.target.files[0]);
    }
};

srcImage.onload = function (){
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
    context.drawImage(srcImage,0,0,srcImage.width, srcImage.height);
    imgData = context.getImageData(0,0,srcImage.width,srcImage.height);
    console.log(typeof imgData);
    console.log(imgData);
}

filterWorker.onmessage = function (event){
    document.getElementById("spinner").style.visibility = "hidden";
    // console.log(event.data);
    for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = event.data[i];
    }
    context.putImageData(imgData,0,0,0,0,srcImage.width,srcImage.height);
}

function applyFilter(){
    console.log("Calling worker...");
    document.getElementById("spinner").style.visibility = "visible";
    const filterData = {
        color: [100,0,0],
        pixels: imgData.data.slice(),
        height: imgData.height,
        width: imgData.width
    };
    filterWorker.postMessage(filterData);
}
document.getElementById("process").onclick = () => {applyFilter()};