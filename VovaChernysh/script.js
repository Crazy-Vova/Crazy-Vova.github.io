const navbar = document.querySelector('.nav__hidden');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible')
    }
});

const burger = document.querySelector('.burger');
const burgerNav = document.querySelector('.nav__bar');
const circle = document.querySelector('.circle');
const navUl = burgerNav.querySelector('ul')
burger.addEventListener('click', () => {
    if (burger.classList.contains('burger__active')){
        document.body.classList.remove('no-scroll');
        navUl.style.animation = "navClose .4s ease-out"
        burgerNav.style.animation = "navAnimation .4s ease-out"
        setTimeout (() => {
            burger.classList.remove('burger__active');
            burgerNav.style.display = "none";
            circle.style.opacity = "0";
            circle.style.animation = "none";
            navUl.classList.remove('nav__open')
        }, 300)
        
    } else {
        burgerNav.style.animation = "none"
        document.body.classList.add('no-scroll');
        burger.classList.add('burger__active');
        circle.style.opacity = "1";
        circle.style.animation = "circleAnimation 1s ease-in";
        setTimeout (() => {
            burgerNav.style.display = "block";
            navUl.style.animation = "navOpen .2s ease-out"
        }, 900);
    };
});

// contacts
const contactWindow = document.querySelector(".contact__window");
function contactFunc() {
    contactWindow.style.top = "calc(20%)";
}
const cross = document.querySelector(".cross");
cross.addEventListener('click', () => {
    contactWindow.style.top = "-420px";
})

function contactNav() {
    contactWindow.style.top = "calc(20%)";
}


