/* jQuery(document).ready(function() {
    jQuery(".menu a").click(function() {
        ElementClick = jQuery(this).attr("href")
        destination = jQuery(ElementClick).offset().top;
        jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 1100);
        return false;
    });
}); 
header = document.getElementById("header").style.height

function scrollTo(element) {
    window.scroll({
      left: 0, 
      top: 700, 
      behavior: 'smooth'
    })
  }

var about_btn = document.querySelector('.about_btn');
var about_sec = document.querySelector('#about_sec');

about_btn.addEventListener('click', () => {
    scrollTo(about_sec)
})

function scrollWork(element) {
    window.scroll({
        left: 0, 
        top: element.offsetTop-35, 
        behavior: 'smooth'
      })
}

var work_btn = document.querySelector('.work_btn');
var work_sec = document.querySelector('#work_sec');

work_btn.addEventListener('click', () => {
    scrollWork(work_sec)
})


function scrollContacts(element) {
    window.scroll({
        left: 0, 
        top: element.offsetTop, 
        behavior: 'smooth'
      })
}

var contacts_btn = document.querySelector('.contacts_btn');
var contacts_sec = document.querySelector('#contacts_sec');

contacts_btn.addEventListener('click', () => {
    scrollContacts (contacts_sec)
})
*/