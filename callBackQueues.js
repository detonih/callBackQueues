const fs = require('fs');

const Timer = [];
const Microtask = [];
const IO = []; 
const Check = [];

/* fs.writeFile takes 2ms at the background before Node.js adds
 the callback function to the IO queue. */
const data = "Adding to the file"
fs.writeFile('./new-file.json', data, function() {

  IO.push('WriteFile Add to IO queue')
  console.log('WriteFile');

});

/* fs.readFile takes 10ms at the background before Node.js adds
 the callback function to the IO queue. */
fs.readFile('./file.json', function(err, data) {

  IO.push('ReadFile add to IO queue')
  console.log(IO);
  console.log("ReadFile");

});

/* setTimeout takes 1ms at the background before Node.js adds
 the callback function to the timer queue. */
setTimeout(function() {

  Timer.push("Adding to timer queue")
  console.log(Timer);
  console.log("SetTimeOut");

}, 1000);

/* Now, the while operation (which is synchronous) takes 3ms.
 During this time, the thread is blocked (remember that JavaScript is single-threaded). */
let i = 0;
 while(i < 3) {
   i++
  console.log("while " + i);
}

/* setImmediate adds the callback function to the Check queue: */
setImmediate(function() {

  Check.push("Adding to check queue")
  console.log(Check);
  console.log("setImmediate");

});


/* All synchronous activities are done, so the event loop starts checking the queues.
 It starts from the timer queue since the microtask queue is empty: 
 While the event loop continues executing the callback functions in the queue,
  the promise operation finishes and is added to the microtask queue:*/
let promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
      Microtask.push("Add on microtask queue")
      return resolve("promise");
  }, 4000);
});

promise.then(function(response) {
  console.log(Microtask);
  console.log(response)
})

console.log(IO);
console.log(Timer);
console.log(Check);
console.log(Microtask); // All these arrays are empty

console.log("last line");