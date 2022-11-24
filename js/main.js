let os = "Unknown";
if (navigator.appVersion.indexOf("Win") != -1) os = "windows";
if (navigator.appVersion.indexOf("Mac") != -1) os = "macos";
if (navigator.appVersion.indexOf("X11") != -1) os = "unix";
if (navigator.appVersion.indexOf("Linux") != -1) os = "linux";
// document.body.classList.add("os-" + os);

// Служебные переменные
const d = document;
const body = document.querySelector("body");

// Служебные функции

function find(selector) {
	return document.querySelector(selector);
}

function findAll(selectors) {
	return document.querySelectorAll(selectors);
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items, itemClass) {
	if (typeof items == "string") {
		items = document.querySelectorAll(items);
	}
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		item.classList.remove(itemClass);
	}
}

function bodyLock(con) {
	if (con === true) {
		body.classList.add("_lock");
	} else if (con === false) {
		body.classList.remove("_lock");
	} else if (con === undefined) {
		if (!body.classList.contains("_lock")) {
			body.classList.add("_lock");
		} else {
			body.classList.remove("_lock");
		}
	} else {
		console.error("Неопределенный аргумент у функции bodyLock()");
	}
}

// Валидация формы
function validationForm() {
	const name = find("#user_name");
	const phone = find("#user_phone");
	const email = find("#user_email");

	let con = true;

	for (let i = 0; i < [name, phone, email].length; i++) {
		const elem = [name, phone, email][i];
		const elemValue = elem.value.trim();

		if (elemValue === "") {
			elem.classList.add("_error");
			con = false;
		} else {
			elem.classList.remove("_error");
			con = true;
		}
	}

	return con;
}

// Отправка формы
// sumbitForm();
function sumbitForm() {
	const form = find(".modal__form");

	form.addEventListener("submit", async (e) => {
		const modal = find(".modal._show");
		const btnSend = form.querySelector("[type=submit]");
		btnSend.classList.add("send-preloader");

		e.preventDefault();

		let con = validationForm();

		if (con === true) {
			const formData = new FormData();
			const action = form.getAttribute("action");

			let response = await fetch(action, {
				method: "POST",
				body: formData,
			});

			// settimeout здесь для того, чтобы показать работу отправки формы. В дальнейшем это нужно убрать
			setTimeout(() => {
				if (response.ok) {
					console.log("Successful");
					form.reset();

					modal.classList.remove("_show");
					find("#send-done").classList.add("_show");
					btnSend.classList.remove("send-preloader");
				} else {
					console.log("Error");
					form.reset();

					modal.classList.remove("_show");
					find("#send-error").classList.add("_show");
					btnSend.classList.remove("send-preloader");
				}
			}, 2000);
		}
	});
}

// Мобильное меню
// menu()
function menu() {
	const burger = find(".burger");
	const menu = find(".menu");

	// Высота меню
	window.addEventListener("resize", () => {
		const headerHeight = find(".header").clientHeight;

		if (window.innerWidth <= 768) {
			menu.style.paddingTop = headerHeight + "px";
		} else {
			menu.style.paddingTop = 0;
		}
	});

	burger.addEventListener("click", (e) => {
		burger.classList.toggle("burger_close");
		menu.classList.toggle("_show");
		bodyLock();
	});
}

// const logoSlider = new Swiper(".header__logo-slider", {
// 	// effect: "fade",
// 	effect: "creative",
// 	speed: 700,
// 	direction: "vertical",
// 	creativeEffect: {
// 		prev: {
// 			translate: [0, 0, -400],
// 			opacity: 0,
// 		},
// 		next: {
// 			translate: [0, "100%", 0],
// 		},
// 	},
// 	allowTouchMove: false,
// 	watchSlidesProgress: true,
// });

function toggleMouseWheel(swiper) {
	swiper.mousewheel.disable();
	const slide = swiper.slides[swiper.activeIndex];
	const offsetHeight = slide.offsetHeight;
	const scrollHeight = slide.scrollHeight;
	const scrollTop = slide.scrollTop;

	const scrollResult = scrollHeight - (offsetHeight + scrollTop);

	// console.log(offsetHeight, scrollHeight, scrollTop);
	// console.log(scrollResult);
	if (scrollTop < 1 && scrollResult < 1) {
		// console.log("enable", swiper.mousewheel);
		setTimeout(() => {
			swiper.mousewheel.enable();
		}, 100);
	} else {
		// console.log("disable", swiper.mousewheel);
		swiper.mousewheel.disable();
	}
}

// #region videoSwap
const ANIMATION_BREAKPOINT = 1179;
const s1Videos = document.querySelectorAll(
	".home-slider__slide-1 .section__videos-item"
);
const FORBID_CHANGE_CLASS = "section__videos-item--forbid-change";
const VIDEO_TOP_CLASS = "section__videos-item--top";

function onVideoChangeStart() {
	forbidVideoChanging();
}
function onVideoChangeEnd() {
	setTimeout(() => {
		allowVideoChanging();
	}, 200);
}
function forbidVideoChanging() {
	s1Videos.forEach((video) => video.classList.add(FORBID_CHANGE_CLASS));
}
function allowVideoChanging() {
	s1Videos.forEach((video) => video.classList.remove(FORBID_CHANGE_CLASS));
}
function isVideoChangeAllowed(video) {
	return !video.classList.contains(FORBID_CHANGE_CLASS);
}

function setVideoTop(video) {
	video.classList.add(VIDEO_TOP_CLASS);

	// Специфические стили для карточек
	if (video.classList.contains("section__videos-item_back")) {
		gsap.to(video, {
			y: -135,
			width: "100%",
			zIndex: 2,
			onStart: onVideoChangeStart,
			onComplete: onVideoChangeEnd,
		});
	} else {
		gsap.to(video, {
			y: 0,
			width: "100%",
			zIndex: 2,
			onStart: onVideoChangeStart,
			onComplete: onVideoChangeEnd,
		});
	}
}
function setVideoBack(video) {
	video.classList.remove(VIDEO_TOP_CLASS);

	// Специфические стили для карточек
	if (video.classList.contains("section__videos-item_back")) {
		gsap.to(video, { y: 0, width: "88%", zIndex: 1 });
	} else {
		gsap.to(video, { y: 180, width: "88%", zIndex: 1 }, "<");
	}
}
function isVideoBottom(video) {
	return !video.classList.contains(VIDEO_TOP_CLASS);
}
function getOppositeVideoOf(video) {
	return [...s1Videos].filter((vid) => {
		return vid != video;
	})[0];
}

s1Videos.forEach((video, index) => {
	if (index === 0) {
		video.classList.add(VIDEO_TOP_CLASS);
	}
	video.addEventListener("mouseenter", (e) => {
		if (window.innerWidth < ANIMATION_BREAKPOINT) return;

		const oppositeVideo = getOppositeVideoOf(video);

		if (isVideoBottom(video) && isVideoChangeAllowed(video)) {
			// Меняет местами карточки
			setVideoTop(video);
			setVideoBack(oppositeVideo);
		}
	});
});
// #endregion videoSwap

// #region gsap
window.addEventListener("DOMContentLoaded", (event) => {
	// const slides = [];
	// let pinHeight = 0;
	// const totalSlides = [...document.querySelectorAll(".home-slider__slide")];
	// pinHeight = totalSlides.reduce((height, slide, index, array) => {
	// 	slide.style.zIndex = array.length + 1 - index + 1;

	// 	let h = slide.offsetHeight;
	// 	slides.push({ h });
	// 	return height + h;
	// }, pinHeight);
	const socials = document.querySelectorAll(".social");
	socials.forEach((bar) => {
		bar.querySelectorAll(".social__item").forEach((link, index) => {
			link.dataset.aos = "fade-up";
			link.dataset.aosDelay = index * 100;
			link.dataset.aosOffset = -200;
		});
	});

	if (window.innerWidth < ANIMATION_BREAKPOINT) {
		const videos = document.querySelectorAll(
			".home-slider__slide-1 .section__videos-item"
		);
		videos.forEach((video) => {
			video.dataset.aos = "fade-up";
		});
	}
	setTimeout(() => {
		AOS.init({
			once: false,
			mirror: true,
		});
	}, 200);

	gsap.registerPlugin(ScrollTrigger);
	// gsap.defaults({ duration: 1 });

	const scrollShaft = document.querySelector(".home-slider__scrollbar-shaft");
	const shaftHeight = scrollShaft.getBoundingClientRect().height;
	let s1 = gsap.timeline();
	s1.from(".logo-1", { autoAlpha: 1 }, "<");
	useLogo(1);
	function useLogo(slideNumber) {
		if (slideNumber == 1) {
			gsap.to(".logo-1", { autoAlpha: 1 }, "<");
			gsap.to(".logo-2", { autoAlpha: 0 }, "<");
			gsap.to(".logo-3", { autoAlpha: 0 }, "<");
			gsap.to(".home-slider__scrollbar-shaft", { y: 0 }, "<");
		} else if (slideNumber == 2) {
			gsap.to(".logo-1", { autoAlpha: 0 }, "<");
			gsap.to(".logo-2", { autoAlpha: 1 }, "<");
			gsap.to(".logo-3", { autoAlpha: 0 }, "<");
			gsap.to(".home-slider__scrollbar-shaft", { y: shaftHeight }, "<");
		} else if (slideNumber == 3) {
			gsap.to(".logo-1", { autoAlpha: 0 }, "<");
			gsap.to(".logo-2", { autoAlpha: 0 }, "<");
			gsap.to(".logo-3", { autoAlpha: 1 }, "<");
			gsap.to(
				".home-slider__scrollbar-shaft",
				{ y: shaftHeight * 2 + 10 },
				"<"
			);
		}
	}

	const sections = document.querySelectorAll(".home-slider__slide");
	sections.forEach((section, index) => {
		window.addEventListener("scroll", (e) => {
			const top = section
				.querySelector(".section__title")
				.getBoundingClientRect().top;
			if (top > 100 && top < 400) {
				console.log(index + 1);
				useLogo(index + 1);
			}
		});
	});
});
// #endregion gsap

document.querySelectorAll(".section__videos").forEach((videoNode) => {
	lightGallery(videoNode, {
		download: false,
		plugins: [lgVideo],
	});
});
