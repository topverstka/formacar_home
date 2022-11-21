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
	const slides = [];
	let pinHeight = 0;
	const totalSlides = [...document.querySelectorAll(".home-slider__slide")];
	pinHeight = totalSlides.reduce((height, slide, index, array) => {
		slide.style.zIndex = array.length + 1 - index + 1;

		let h = slide.offsetHeight;
		slides.push({ h });
		return height + h;
	}, pinHeight);

	gsap.registerPlugin(ScrollTrigger);
	// gsap.defaults({ duration: 1 });

	let s1 = gsap.timeline();
	function useLogo(slideNumber) {
		if (slideNumber == 1) {
			s1.to(".logo-1", { autoAlpha: 1 }, "<");
			s1.to(".logo-2", { autoAlpha: 0 }, "<");
			s1.to(".logo-3", { autoAlpha: 0 }, "<");
		} else if (slideNumber == 2) {
			s1.to(".logo-1", { autoAlpha: 0 }, "<");
			s1.to(".logo-2", { autoAlpha: 1 }, "<");
			s1.to(".logo-3", { autoAlpha: 0 }, "<");
		} else if (slideNumber == 3) {
			s1.to(".logo-1", { autoAlpha: 0 }, "<");
			s1.to(".logo-2", { autoAlpha: 0 }, "<");
			s1.to(".logo-3", { autoAlpha: 1 }, "<");
		}
	}

	// Sets initial slider position
	gsap.to(".home-slider__slide-1 .section__fader", { autoAlpha: 0 });
	gsap.to(".home-slider__slide-2", { pointerEvents: "none" });
	gsap.to(".home-slider__slide-3", { pointerEvents: "none" });
	useLogo(1);
	s1.from(".logo-1", { autoAlpha: 1 }, "<");

	useLogo(1);
	let s1Y =
		document.querySelector(".home-slider__slide-1").getBoundingClientRect()
			.height -
		window.innerHeight +
		5;
	s1Y <= window.innerHeight / 3 ? window.innerHeight / 3 : s1Y;

	s1.to(".home-slider__slide-1", { y: -s1Y }, "<");
	s1.to(".home-slider__slide-1 .section__bg", { y: s1Y }, "<");

	// Slide 2
	if (window.innerWidth < ANIMATION_BREAKPOINT) {
		s1.to(".home-slider__slide-1", { autoAlpha: 0 }, ">");
	} else {
		s1.to(".home-slider__slide-1", { autoAlpha: 0 }, "<");
	}

	const scrollShaft = document.querySelector(".home-slider__scrollbar-shaft");
	const shaftHeight = scrollShaft.getBoundingClientRect().height;
	if (window.innerWidth > ANIMATION_BREAKPOINT) {
		s1.to(".home-slider__scrollbar-shaft", { y: shaftHeight }, "<");
	}
	useLogo(2);

	s1.from(".home-slider__slide-2", { autoAlpha: 0 }, "<");
	s1.to(".home-slider__slide-2 .section__fader", { autoAlpha: 0 }, "<+0.3");
	s1.to(".home-slider__slide-1", { pointerEvents: "none" }, "<");
	s1.to(".home-slider__slide-2", { pointerEvents: "auto" }, "<");

	let s2Y =
		document.querySelector(".home-slider__slide-2").getBoundingClientRect()
			.height - window.innerHeight;
	s2Y = s2Y == 0 ? -20 : s2Y;

	s1.fromTo(
		".home-slider__slide-2 .section__inner",
		{ y: window.innerHeight + s2Y },
		{ y: -s2Y },
		"<+0.1"
	);
	console.log(s2Y);
	// s1Y <= window.innerHeight / 3 ? window.innerHeight / 3 : s1Y;
	// s1.fromTo(
	// 	".home-slider__slide-2 .section__bg",
	// 	{ y: s2Y / 3 },
	// 	{ y: s2Y },
	// 	"<"
	// );

	// if (window.innerWidth < 600 && window.innerHeight > 800) {
	// 	s1.fromTo(
	// 		".home-slider__slide-2 .section__inner",
	// 		{ yPercent: 10 },
	// 		{ yPercent: -2 },
	// 		"<"
	// 	);
	// } else {
	// 	s1.fromTo(
	// 		".home-slider__slide-2 .section__inner",
	// 		{ yPercent: 10 },
	// 		{ yPercent: -2 },
	// 		"<"
	// 	);
	// }

	// if (window.innerHeight > 690) {
	// } else if (window.innerHeight < 500) {
	// 	s1.to(".home-slider__slide-2 .section__inner", { yPercent: -65 }, ">");
	// } else {
	// 	s1.to(".home-slider__slide-2 .section__inner", { yPercent: -20 }, ">");
	// }

	// Finish slide2
	s1.to(".home-slider__slide-2", { autoAlpha: 0 }, ">");
	s1.from(".home-slider__slide-3", { autoAlpha: 0 }, "<");
	s1.to(".home-slider__slide-3 .section__fader", { autoAlpha: 0 }, "<+0.4");
	s1.to(".home-slider__slide-2", { pointerEvents: "none" }, "<");
	s1.to(".home-slider__slide-3", { pointerEvents: "auto" }, "<");

	if (window.innerWidth > ANIMATION_BREAKPOINT) {
		s1.to(".home-slider__scrollbar-shaft", { y: shaftHeight * 2 }, "<");
	}

	useLogo(3);

	if (window.innerWidth < ANIMATION_BREAKPOINT) {
		if (window.innerHeight < 400) {
			s1.fromTo(
				".home-slider__slide-3 .section__inner",
				{ yPercent: 30 },
				{ yPercent: -45 },
				"<"
			);
			s1.to(
				".home-slider__slide-3 .section__footer",
				{ yPercent: -375 },
				"<"
			);
		} else if (window.innerHeight < 500) {
			console.log("phone album");
			s1.fromTo(
				".home-slider__slide-3 .section__inner",
				{ yPercent: 30 },
				{ yPercent: -45 },
				"<"
			);
			s1.to(".home-slider__slide-3 .section__footer", { y: -145 }, "<");
		} else if (window.innerHeight < 800) {
			s1.fromTo(
				".home-slider__slide-3 .section__inner",
				{ yPercent: 30 },
				{ yPercent: -5 },
				"<"
			);
		} else {
			s1.fromTo(
				".home-slider__slide-3 .section__inner",
				{ yPercent: 30 },
				{ yPercent: 15 },
				"<"
			);
		}
	} else {
		// desktop
		s1.from(".home-slider__slide-3 .section__inner", { yPercent: 30 }, "<");
	}

	if (window.innerHeight < 500 && window.innerWidth > 576) {
		s1.to(
			".home-slider__slide-3 .section__body-img",
			{ yPercent: -20 },
			"<"
		);
	}
	s1.from(".home-slider__slide-3 .section__body-img", { xPercent: 120 }, "<");

	if (window.innerWidth < 576) {
		if (window.innerHeight < 700) {
			s1.to(
				".home-slider__slide-3 .section__inner",
				{ yPercent: -10 },
				">"
			);
		} else {
			s1.to(
				".home-slider__slide-3 .section__inner",
				{ yPercent: 15 },
				">"
			);
		}
	} else {
		if (window.innerHeight < 500) {
		} else {
			s1.to(
				".home-slider__slide-3 .section__inner",
				{ yPercent: -5 },
				">"
			);
		}
	}

	if (window.innerWidth < ANIMATION_BREAKPOINT) {
	} else {
		s1.to(".home-slider__slide-3 .section__body-img", { xPercent: 0 }, ">");
	}

	s1.to(".home-slider__slide-3", { autoAlpha: 1 }, ">");

	document.querySelector(".home-slider").style.height = `${pinHeight}px`;

	let scrollEnd = pinHeight + window.innerHeight;
	ScrollTrigger.create({
		animation: s1,
		trigger: ".home-slider",
		start: "top top",
		end: `+=${scrollEnd - 500}`,
		pin: true,
		markers: true,
		scrub: true,
		anticipatePin: 1,
	});
});
// #endregion gsap

document.querySelectorAll(".section__videos").forEach((videoNode) => {
	lightGallery(videoNode, {
		download: false,
		plugins: [lgVideo],
	});
});
