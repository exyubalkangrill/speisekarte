'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});



/**
 * LOAD AND LOG DESCRIPTIONS
 */

let menuData = [];

const loadDescriptions = function () {
  fetch('./assets/descriptions.json')
    .then(response => response.json())
    .then(data => {
      menuData = data;
      console.log("Menu Data:", data);
      
      // Loop through each category
      data.forEach((categoryObj, index) => {
        console.log(`\n--- Category ${index + 1}: ${categoryObj.category} ---`);
        
        // Loop through items in each category
        categoryObj.items.forEach((item, itemIndex) => {
          console.log(`Item ${itemIndex + 1}:`);
          console.log(`  Name: ${item.name}`);
          console.log(`  Description: ${item.description}`);
          console.log(`  Price: ${item.price}`);
          console.log(`  Image: ${item.src}`);
        });
      });

      // After loading data, set up menu buttons
      setupMenuButtons();
    })
    .catch(error => console.error('Error loading descriptions:', error));
}

// Call the function when page loads
window.addEventListener("load", loadDescriptions);



/**
 * MENU MODAL
 */

const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const modalSlides = document.querySelector('#modalSlides');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const closeBtn = document.querySelector('.modal-btn');

let currentCategoryItems = [];
let currentSlideIndex = 0;

const setupMenuButtons = function () {
  const menuButtons = document.querySelectorAll('.grid-list a.btn');
  menuButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const categoryName = this.querySelector('.text-1').textContent.trim();
      openModalForCategory(categoryName);
    });
  });
}

const openModalForCategory = function (categoryName) {
  const category = menuData.find(cat => cat.category === categoryName);
  if (!category) return;

  currentCategoryItems = category.items;
  currentSlideIndex = 0;
  renderSlides();
  modalOverlay.classList.add('active');
  modal.classList.add('active');
}

const renderSlides = function () {
  modalSlides.innerHTML = ''; // Clear existing slides

  currentCategoryItems.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (index === 0) slide.classList.add('active');

    slide.innerHTML = `
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <div class="price">${item.price}</div>
      <div class="image-placeholder">
        <img src="${item.src}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
      </div>
    `;

    modalSlides.appendChild(slide);
  });
}

const showSlide = function (index) {
  const slides = modalSlides.querySelectorAll('.slide');
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

const nextSlide = function () {
  currentSlideIndex = (currentSlideIndex + 1) % currentCategoryItems.length;
  showSlide(currentSlideIndex);
}

const prevSlide = function () {
  currentSlideIndex = (currentSlideIndex - 1 + currentCategoryItems.length) % currentCategoryItems.length;
  showSlide(currentSlideIndex);
}

const closeModal = function () {
  modalOverlay.classList.remove('active');
  modal.classList.remove('active');
}

// Event listeners for closing modal
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
if (closeBtn) closeBtn.addEventListener('click', closeModal);

// Close modal with ESC key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Navigate slides
if (leftArrow) leftArrow.addEventListener('click', prevSlide);
if (rightArrow) rightArrow.addEventListener('click', nextSlide);

/**
 * LOGO EXPLOSION
 */

const logo = document.querySelector('.logo');
const explosion = document.getElementById('explosion');

if (logo && explosion) {
  logo.addEventListener('click', function(e) {
    e.preventDefault();
    explosion.classList.add('active');
    setTimeout(() => {
      explosion.classList.remove('active');
    }, 3400);
  });
}