function steam() {
  window.location.href = "https://store.steampowered.com/app/619080/SOS/";
}

// nav

const navbar = document.querySelector('.nav__hidden');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible')
    }
});

// translate

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'en', autoDisplay: false },
    'google_translate_element'
  );
}

function toggleLang() {
  const list = document.getElementById("langList");
  list.classList.toggle("open");
}

function setLang(lang, label) {

  const list = document.getElementById("langList");

  document.getElementById("currentLang").innerText = label;
  list.classList.remove("open");

  localStorage.setItem("siteLang", lang);

  if (lang === "en") {
    document.cookie = "googtrans=/en/en;path=/";
    location.reload();
    return;
  }

  translatePage(lang);
}

function translatePage(lang) {

  const interval = setInterval(() => {

    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      clearInterval(interval);
    }

  }, 300);

}

// language list

document.addEventListener("click", function(e){

  const box = document.querySelector(".lang-box");
  const list = document.getElementById("langList");

  if(!box.contains(e.target)){
    list.classList.remove("open");
  }

});

window.addEventListener("load", () => {

  const savedLang = localStorage.getItem("siteLang");

  if (!savedLang || savedLang === "en") return;

  const labelMap = {
    en:"ENG",
    ru:"RUS",
    de:"DEU"
  };

  document.getElementById("currentLang").innerText = labelMap[savedLang];

  translatePage(savedLang);

});

/*
const burger = document.querySelector('.burger');
const menu = document.querySelector('.burger__nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
});
*/
/*
const burgers = document.querySelectorAll('.burger');
const menu = document.querySelector('.burger__nav');

burgers.forEach((burger, index) => {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
    });
});



const navLinks = document.querySelectorAll('.burger__nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burgers.forEach((burger, index) => {
          burger.classList.remove('active');
        });
        menu.classList.remove('active');
        
    });
});
*/

// burger menu

const burgers = document.querySelectorAll('.burger');
const menu = document.querySelector('.burger__nav');
const navLinks = document.querySelectorAll('.burger__nav a');

function toggleScroll() {
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}

burgers.forEach((burger) => {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        toggleScroll(); 
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burgers.forEach(burger => burger.classList.remove('active'));
        menu.classList.remove('active');
        toggleScroll(); 
    });
});

// slider

const cards = document.querySelectorAll('.card');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.querySelector('.slider__next');
let currentIndex = 0;

function updateSlider(index) {
    cards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i].classList.remove('active');
    });

    cards[index].classList.add('active');
    dots[index].classList.add('active');
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider(currentIndex);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider(currentIndex);
    });
});

// features list

const list = document.querySelector('.features__list');

document.querySelectorAll('.features__item').forEach(item => {
    const trigger = item.querySelector('h4');
    const dotFeatures = item.querySelector('.dot-features');

    const toggleAccordion = () => {
        document.querySelectorAll('.features__item').forEach(el => {
            if (el !== item) el.classList.remove('active');
        });
        item.classList.toggle('active');
        /*
        if (item.classList.contains("featuresFirst") && !item.classList.contains("active")) {
          list.style.setProperty('--line-height', '0px');
          list.style.setProperty('--line-top', '0px');
        } else if (item.classList.contains("featuresFirst") && item.classList.contains("active")) {
          list.style.setProperty('--line-height', '140px');
          list.style.setProperty('--line-top', '10px');
        }
        if (item.classList.contains("featuresSecond") && !item.classList.contains("active")) {
          list.style.setProperty('--line-height', '0px');
          list.style.setProperty('--line-top', '0px');
        } else if (item.classList.contains("featuresSecond") && item.classList.contains("active")) {
          list.style.setProperty('--line-height', '140px');
          list.style.setProperty('--line-top', '100px');
        }
        if (item.classList.contains("featuresThird") && !item.classList.contains("active")) {
          list.style.setProperty('--line-height', '0px');
          list.style.setProperty('--line-top', '0px');
        } else if (item.classList.contains("featuresThird") && item.classList.contains("active")) {
          list.style.setProperty('--line-height', '100px');
          list.style.setProperty('--line-top', '180px');
        }
         
        if (item.classList.contains("active")) {
          if (item.classList.contains("featuresFirst")) {
            list.style.setProperty('--line-height', '140px');
            list.style.setProperty('--line-top', '10px');
          } 
          else if (item.classList.contains("featuresSecond")) {
            list.style.setProperty('--line-height', '140px');
            list.style.setProperty('--line-top', '100px');
          } 
          else if (item.classList.contains("featuresThird")) {
            list.style.setProperty('--line-height', '100px');
            list.style.setProperty('--line-top', '180px');
          }
        } else {
          list.style.setProperty('--line-height', '0px');
          list.style.setProperty('--line-top', '0px');
        }
        */
    };

    trigger.addEventListener('click', toggleAccordion);
    dotFeatures.addEventListener('click', toggleAccordion);
});








