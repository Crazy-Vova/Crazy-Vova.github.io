// time
let date = new Date('Aug 22 2023 22:26:20');

function counts() {
    let now = new Date();
    gap = now - date;
    let days = Math.floor(gap / 1000 / 60 / 60 / 24);
    let hours = Math.floor(gap / 1000 / 60 / 60) % 24;
    let minutes = Math.floor(gap / 1000 / 60) % 60;
    let seconds = Math.floor(gap / 1000) % 60;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}
counts();
setInterval(counts, 1000);

//images
const numbers = []
let queue = 0
const getRandomNumber = (min, max) => {
    const number = Math.floor(min + Math.random() * (max - min))
    if (numbers.includes(number)) return getRandomNumber(min, max)
    else {
        let name = 'pictures/photo' + number + '.jpg'
        let results = document.createElement('img')
        results.setAttribute('src', name)
        let body = document.querySelector('body')
        body.appendChild(results)
        numbers.push(number)
        return number
    }
}
//console.log(numbers[queue])
//queue = queue + 1
//console.log(queue)
console.log(getRandomNumber(1, 4))
console.log(getRandomNumber(1, 8))
console.log(getRandomNumber(1, 8))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))
console.log(getRandomNumber(1, 16))





