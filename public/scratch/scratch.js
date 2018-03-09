'use strict';

const coinFlip = function(delay) {
  return new Promise((resolve, reject) => {

    const rand = Boolean(Math.round(Math.random()));

    setTimeout(() => {
      rand ? resolve('Heads!') : reject('Tails!');
    }, delay);

  });
};

const coin1 = coinFlip(100);
const coin2 = coinFlip(200);
const coin3 = coinFlip(300);

Promise.all( [coin1, coin2, coin3] )
  .then(arrayOfResults => {
    console.log(arrayOfResults);
  })
  .catch(err => {
    console.error(err);
  }); 

// coinFlip(500)
//   .then(res => {
//     console.log(1, res);
//     return coinFlip(500);
//   })
//   .then(res => {
//     console.log(2, res);
//     return coinFlip(500);
//   })
//   .then(res => {
//     console.log(3, res);
//     console.log('You win!');
//   })
//   .catch(err => {
//     console.error(err);
//   });
