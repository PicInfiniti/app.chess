// libraries +++++++++++++++++++++++++++++++++++++
console.log('setup')
// libraries -------------------------------------

import {
  Constants
} from "../constants"

import {
  update_board
} from './utils'


import Desk from "../lib/desk"

export const chess = new Desk(Constants)
document.chess = chess


var stockpile = {
  "帥": 1,
  "兵": 9,
  "忍": 2,
  "砲": 2,
  "砦": 2,
  "侍": 2,
  "謀": 1,
  "筒": 1,
  "馬": 2,
  "弓": 2,
  "大": 6,
  "中": 4,
  "小": 4
}

$.each(stockpile, function (key, value) {

  $(`#bc-${key}`).append("<sub>0</sub>")
  $(`#wc-${key}`).append("<sub>0</sub>")
});


for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {

    if ((i + j) % 2 == 0) {
      $('#fake').append("<label type='text' style='background-color: #ffba75'>0</label>")
      $('#board').append(`<label type='text' id='b-${i}-${j}' name='${i}-${j}' style='background-color: #ffba75'>${i}${j}</label>`)
    } else {
      $('#fake').append("<label type='text' style='background-color: #EB9E53'>0</label>")
      $('#board').append(`<label type='text' id='b-${i}-${j}' name='${i}-${j}' style='background-color: #EB9E53'>${i}${j}</label>`)
    }
  }
}
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
for (let i = 0; i < 8; i++) {
  $('arena .top').append(`<div><b>${alphabet[i]}</b></div>`)
  $('arena .bottom').append(`<div><b>${alphabet[i]}</b></div>`)
  $('arena .right').append(`<div><b>${8-i}</b></div>`)
  $('arena .left').append(`<div><b>${8-i}</b></div>`)
}
update_board()
// const content = document.querySelector('body');
// const contentWidth = content.offsetWidth;
// const contentHeight = content.offsetHeight;

// // Get the dimensions of the screen
// const screenWidth = window.innerWidth;
// const screenHeight = window.innerHeight;

// // Calculate the scaling factors for width and height
// const widthScale = screenWidth / contentWidth;
// const heightScale = screenHeight / contentHeight;

// // Choose the minimum of the two scaling factors to ensure that the content fits
// const zoomPercentage = Math.min(widthScale, heightScale) * 100;

// console.log(zoomPercentage, widthScale, heightScale, screenHeight, screenWidth, contentHeight, contentWidth)

// // Apply the zoom percentage to your content
// document.body.style.zoom = zoomPercentage / 77



// function rotateBodyIfLandscape() {
//   if (window.matchMedia("(orientation: landscape)").matches) {
//     // Add a class to the body to apply the rotation
//     document.body.classList.remove("landscape");
//     const content = document.querySelector('body');
//     const contentWidth = content.offsetWidth;
//     const contentHeight = content.offsetHeight;

//     // Get the dimensions of the screen
//     const screenWidth = window.innerWidth;
//     const screenHeight = window.innerHeight;

//     // Calculate the scaling factors for width and height
//     const widthScale = screenWidth / contentWidth;
//     const heightScale = screenHeight / contentHeight;

//     // Choose the minimum of the two scaling factors to ensure that the content fits
//     const zoomPercentage = Math.min(widthScale, heightScale) * 100;

//     console.log(zoomPercentage, widthScale, heightScale, screenHeight, screenWidth, contentHeight, contentWidth)

//     // Apply the zoom percentage to your content
//     document.body.style.zoom = zoomPercentage / 80

//   } else {
//     document.body.classList.add("landscape");
//     const content = document.querySelector('body');
//     const contentWidth = content.offsetWidth;
//     const contentHeight = content.offsetHeight;

//     // Get the dimensions of the screen
//     const screenWidth = window.innerWidth;
//     const screenHeight = window.innerHeight;

//     // Calculate the scaling factors for width and height
//     const widthScale = screenWidth / contentWidth;
//     const heightScale = screenHeight / contentHeight;

//     // Choose the minimum of the two scaling factors to ensure that the content fits
//     const zoomPercentage = Math.min(widthScale, heightScale) * 100;

//     console.log(zoomPercentage, widthScale, heightScale, screenHeight, screenWidth, contentHeight, contentWidth)

//     // Apply the zoom percentage to your content
//     document.body.style.zoom = zoomPercentage / 90

//   }
// }

// // Initial check and add a listener for changes in orientation
// rotateBodyIfLandscape();
// window.addEventListener("resize", rotateBodyIfLandscape);