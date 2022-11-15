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

const logoSlider = new Swiper(".header__logo-slider", {
	// effect: "fade",
	effect: "creative",
	speed: 700,
	direction: "vertical",
	creativeEffect: {
		prev: {
			translate: [0, 0, -400],
			opacity: 0,
		},
		next: {
			translate: [0, "100%", 0],
		},
	},
	allowTouchMove: false,
	watchSlidesProgress: true,
});

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
			y: -90,
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
		gsap.to(video, { y: 90, width: "88%", zIndex: 1 }, "<");
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

const homeSlider = document.querySelector(".home-slider");
const homeSlides = homeSlider.querySelectorAll(".home-slider__slide");
const ANIMATIONS_WIDTH_BREAKPOINT = 1200;

let sliderHeight = 0;
let slidesHeights = [];
homeSlides.forEach((slide, index, array) => {
	slide.style.zIndex = array.length + 1 - index + 1;
	const height = slide
		.querySelector(".section")
		.getBoundingClientRect().height;
	sliderHeight += height;
	slidesHeights.push(height);
});

const scrollController = new ScrollMagic.Controller();
let pinHeight = sliderHeight * 2 - 800;
if (window.innerWidth < ANIMATIONS_WIDTH_BREAKPOINT) {
	pinHeight = sliderHeight * 2 - 1350;
}

const scrollShaft = document.querySelector(".home-slider__scrollbar-shaft");
const shaftHeight = scrollShaft.getBoundingClientRect().height;
const shaftTl = gsap
	.timeline()
	.to(".home-slider__scrollbar-shaft", { y: shaftHeight * 2 + 10 });

if (window.innerWidth > ANIMATIONS_WIDTH_BREAKPOINT) {
	const sectionPin = new ScrollMagic.Scene({
		triggerElement: ".home-slider",
		duration: pinHeight,
		triggerHook: 0,
	})
		.setPin(".home-slider")
		.setTween(shaftTl)
		.addTo(scrollController);
}

let ht1 = slidesHeights[0];
if (window.innerWidth > ANIMATIONS_WIDTH_BREAKPOINT) {
	ht1 = window.innerHeight + 100;
}

let currentSlide = 0;
function setLogo1(e, force = false) {
	if (window.pageYOffset < s1Duraction || force) {
		currentSlide = 0;
		logoSlider.slideTo(0);
	}
}
function setLogo2(e) {
	if (e.type == "enter") {
		logoSlider.slideTo(1);
		currentSlide = 1;
	}
}
function setLogo3(e) {
	if (e.type == "enter") {
		logoSlider.slideTo(2);
		currentSlide = 2;
	}
}

// #region s1
const slide1Tl = gsap.timeline();
if (window.innerWidth > ANIMATIONS_WIDTH_BREAKPOINT) {
	slide1Tl
		.to(".home-slider__slide-1 .section__content", {
			y: -400,
			autoAlpha: 0,
		})
		.to(
			".home-slider__slide-1 .section__videos",
			{ x: 400, autoAlpha: 0 },
			"<"
		)
		.to(".home-slider__slide-1 .section__footer", { y: 400 }, "<")
		.from(
			".home-slider__slide-1 .section__fader",
			{ autoAlpha: 0 },
			">-0.22"
		)
		.to(".home-slider__slide-1 .section__footer", { opacity: 0 }, "<")
		.to(".home-slider__slide-1", { autoAlpha: 0 }, ">-0.1");
} else {
	// let tY = window.innerHeight * 1.2 - 450;
	// if (window.innerHeight < 700) {
	// 	tY = window.innerHeight * 1.2 - 150;
	// }
	// if (window.innerHeight > 900 && window.innerWidth > 576) {
	// 	tY = window.innerHeight / 2 - 150;
	// }
	// slide1Tl
	// 	.to(".home-slider__slide-1 .section__content", {
	// 		y: -tY * 1.5,
	// 		autoAlpha: 0,
	// 	})
	// 	.to(".home-slider__slide-1 .section__videos", { y: -tY * 1.5 }, "<")
	// 	.to(".home-slider__slide-1 .section__footer", { y: -tY * 1.5 }, "<")
	// 	.from(
	// 		".home-slider__slide-1 .section__fader",
	// 		{ autoAlpha: 0 },
	// 		"<+0.42"
	// 	)
	// 	.to(".home-slider__slide-1", { autoAlpha: 0 }, "<-0.1");
}
let s1Duraction =
	1.5 *
		document
			.querySelector(".home-slider__slide-1")
			.querySelector(".section")
			.getBoundingClientRect().height -
	400;

let s1Offset = 300;
if (window.innerWidth < ANIMATIONS_WIDTH_BREAKPOINT) {
	s1Offset = 0;
}
let s1Hook = "onLeave";
const slide1S = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration: s1Duraction,
	triggerHook: s1Hook,
	offset: s1Offset,
})
	.setTween(slide1Tl)
	.addTo(scrollController)
	.on("enter leave", function (e) {
		setLogo1(e);
	});
// .addIndicators({ name: "s1" });
// #endregion s1

// #region s2
let ht2 = slidesHeights[1];
if (window.innerWidth > ANIMATIONS_WIDTH_BREAKPOINT) {
	ht1 = window.innerHeight + 100;
}

const slide2Tl = gsap.timeline();
if (window.innerWidth > ANIMATIONS_WIDTH_BREAKPOINT) {
	slide2Tl
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 0 })
		// .to(".home-slider__slide-1", { pointerEvents: "none" }, "<")
		.from(
			".home-slider__slide-2 .section__content",
			{ y: 300, autoAlpha: 0 },
			">-0.2"
		)
		.from(
			".home-slider__slide-2 .section__videos",
			{ x: 300, autoAlpha: 0 },
			"<"
		)
		.from(
			".home-slider__slide-2 .section__footer",
			{ y: 300, autoAlpha: 0 },
			"<"
		)
		.to(
			".home-slider__slide-2 .section__content",
			{ y: -300, autoAlpha: 0 },
			">+0.001"
		)
		.to(
			".home-slider__slide-2 .section__footer",
			{ y: 300, autoAlpha: 0 },
			"<"
		)
		.to(
			".home-slider__slide-2 .section__videos",
			{ x: 300, autoAlpha: 0 },
			"<"
		)
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 1 }, "<+0.02")
		.to(".home-slider__slide-2", { autoAlpha: 0 }, "<");
} else {
	// let tY = window.innerHeight - 700;
	// if (window.innerHeight < 700) {
	// 	tY = window.innerHeight * 1.2 - 400;
	// }
	// if (window.innerHeight > 900 && window.innerWidth > 576) {
	// 	tY = window.innerHeight / 2 - 150;
	// }
	// slide2Tl
	// 	.to(".home-slider__slide-2 .section__fader", { autoAlpha: 0 })
	// 	.to(".home-slider__slide-1", { pointerEvents: "none" }, "<")
	// 	.from(
	// 		".home-slider__slide-2 .section__content",
	// 		{ y: 300, autoAlpha: 0 },
	// 		"<"
	// 	)
	// 	.from(
	// 		".home-slider__slide-2 .section__videos",
	// 		{ y: 300, autoAlpha: 0 },
	// 		"<"
	// 	)
	// 	.from(
	// 		".home-slider__slide-2 .section__footer",
	// 		{ y: 300, autoAlpha: 0 },
	// 		"<"
	// 	)
	// 	.to(
	// 		".home-slider__slide-2 .section__content",
	// 		{
	// 			y: -tY,
	// 			autoAlpha: 0,
	// 		},
	// 		">"
	// 	)
	// 	.to(".home-slider__slide-2 .section__videos", { y: -tY }, "<")
	// 	.to(".home-slider__slide-2 .section__footer", { y: -tY }, "<")
	// 	.to(".home-slider__slide-2 .section__fader", { autoAlpha: 1 }, "<+0.3")
	// 	.to(".home-slider__slide-2", { autoAlpha: 0 }, "<");
}

let slide2Duration = slidesHeights[1] * 2.2 - 200;
let s2Offset = 2 * slidesHeights[0] - 500;
if (window.innerWidth < ANIMATIONS_WIDTH_BREAKPOINT) {
	s2Offset = 1.5 * slidesHeights[0] - 100;
}
const slide2S = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration: slide2Duration,
	triggerHook: "onEnter",
	offset: s2Offset,
})
	.setTween(slide2Tl)
	.addTo(scrollController)
	.on("enter leave", function (e) {
		setLogo2(e);
	});
// .addIndicators({ name: "s2" });
// #endregion s2

// #region s3
const slide3Tl = gsap.timeline();
if (window.innerWidth > ANIMATIONS_WIDTH_BREAKPOINT) {
	slide3Tl
		.to(".home-slider__slide-3 .section__fader", { autoAlpha: 0 })
		// .to(".home-slider__slide-2", { pointerEvents: "none" }, "<")
		.from(
			".home-slider__slide-3 .section__content",
			{ y: 280, autoAlpha: 0 },
			"<"
		)
		.from(
			".home-slider__slide-3 .section__body-img",
			{ x: 300, autoAlpha: 0 },
			"<"
		)
		.from(
			".home-slider__slide-3 .section__footer",
			{ y: 280, autoAlpha: 0 },
			"<"
		);
}

let s3Offset = 2 * (slidesHeights[0] + slidesHeights[1]) - 650;
let s3Duration =
	document
		.querySelector(".home-slider__slide-3")
		.querySelector(".section")
		.getBoundingClientRect().height *
		2 -
	400;
if (window.innerWidth < ANIMATIONS_WIDTH_BREAKPOINT) {
	s3Offset = 2 * (slidesHeights[0] + slidesHeights[1]) - 950;
	slide3Tl.to(".home-slider__slide-3 .section__inner", { y: -100 });
	s3Duration =
		2 *
		document
			.querySelector(".home-slider__slide-3")
			.querySelector(".section")
			.getBoundingClientRect().height;
}
const slide3S = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration: s3Duration,
	triggerHook: "onEnter",
	offset: s3Offset,
})
	.setTween(slide3Tl)
	.addTo(scrollController)
	.on("enter leave", function (e) {
		setLogo3(e);
	});
// .addIndicators({ name: "s3" });
// #endregion s3

function handleSlidePrev() {
	if (currentSlide == 0) {
		// setLogo3({ type: "enter" });
		// window.scroll({
		// 	top: s1Duraction + slide2Duration + 600,
		// 	left: 0,
		// 	behavior: "smooth",
		// });
		// currentSlide = 3;
	} else if (currentSlide == 1) {
		// setLogo1({ type: "enter" }, true);
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
		setTimeout(() => {
			logoSlider.slideTo(0);
			currentSlide = 0;
		}, 100);
	} else if (currentSlide == 2) {
		// setLogo2({ type: "enter" });
		window.scroll({
			top: s1Duraction + 310,
			left: 0,
			behavior: "smooth",
		});
		setTimeout(() => {
			logoSlider.slideTo(1);
			currentSlide = 1;
		}, 100);
	}
}

document.querySelector(".home-slider__prev").addEventListener("click", () => {
	handleSlidePrev();
});

function handleSlideNext() {
	if (currentSlide == 0) {
		// setLogo2({ type: "enter" });
		window.scroll({
			top: s1Duraction + 310,
			left: 0,
			behavior: "smooth",
		});
		setTimeout(() => {
			currentSlide = 1;
			logoSlider.slideTo(1);
		}, 100);
	} else if (currentSlide == 1) {
		// setLogo3({ type: "enter" });
		window.scroll({
			top: s1Duraction + slide2Duration + s3Duration,
			left: 0,
			behavior: "smooth",
		});
		setTimeout(() => {
			currentSlide = 2;
			logoSlider.slideTo(2);
		}, 100);
	} else if (currentSlide == 2) {
		// setLogo1({ type: "enter" }, true);
		// window.scroll({
		// 	top: 0,
		// 	left: 0,
		// 	behavior: "smooth",
		// });
		// currentSlide = 0;
	}
}

document.querySelector(".home-slider__next").addEventListener("click", () => {
	handleSlideNext();
});

window.addEventListener("wheel", (e) => {
	// if (e.deltaY > 0 && currentSlide != 2) {
	// 	handleSlideNext();
	// } else if (e.deltaY < 0 && currentSlide != 0) {
	// 	handleSlidePrev();
	// }
});

// #endregion gsap

document.querySelectorAll(".section__videos").forEach((videoNode) => {
	lightGallery(videoNode, {
		download: false,
		plugins: [lgVideo],
	});
});

// Функции для модальных окон
modal();
function modal() {
	// Открытие модальных окон при клике по кнопке
	openModalWhenClickingOnBtn();
	function openModalWhenClickingOnBtn() {
		const btnsOpenModal = document.querySelectorAll("[data-modal-open]");

		for (let i = 0; i < btnsOpenModal.length; i++) {
			const btn = btnsOpenModal[i];

			btn.addEventListener("click", (e) => {
				const dataBtn = btn.dataset.modalOpen;
				const modal = document.querySelector(`#${dataBtn}`);

				openModal(modal);
				window.location.hash = dataBtn;
			});
		}
	}

	// Открытие модального окна, если в url указан его id
	openModalHash();
	function openModalHash() {
		if (window.location.hash) {
			const hash = window.location.hash.substring(1);
			const modal = document.querySelector(`.modal#${hash}`);

			if (modal) openModal(modal);
		}
	}

	// Показываем/убираем модальное окно при изменения хеша в адресной строке
	checkHash();
	function checkHash() {
		window.addEventListener("hashchange", (e) => {
			const hash = window.location.hash;
			const modal = document.querySelector(`.modal${hash}`);

			if (find(".modal._show"))
				find(".modal._show").classList.remove("_show");
			if (modal && hash != "") openModal(modal);
		});
	}

	// Закрытие модального окна при клике по заднему фону
	closeModalWhenClickingOnBg();
	function closeModalWhenClickingOnBg() {
		document.addEventListener("click", (e) => {
			const target = e.target;
			const modal = document.querySelector(".modal._show");

			if (modal && target.classList.contains("modal__body"))
				closeModal(modal);
		});
	}

	// Закрытие модальных окон при клике по крестику
	closeModalWhenClickingOnCross();
	function closeModalWhenClickingOnCross() {
		const modalElems = document.querySelectorAll(".modal");
		for (let i = 0; i < modalElems.length; i++) {
			const modal = modalElems[i];
			const closeThisModal = modal.querySelector(".modal__close");

			closeThisModal.addEventListener("click", () => {
				closeModal(modal);
			});
		}
	}

	// Закрытие модальных окон при нажатии по клавише ESC
	closeModalWhenClickingOnESC();
	function closeModalWhenClickingOnESC() {
		const modalElems = document.querySelectorAll(".modal");
		for (let i = 0; i < modalElems.length; i++) {
			const modal = modalElems[i];

			document.addEventListener("keydown", (e) => {
				if (e.key === "Escape") closeModal(modal);
			});
		}
	}

	// Сброс id модального окна в url
	function resetHash() {
		const windowTop = window.pageYOffset;
		window.location.hash = "";
		window.scrollTo(0, windowTop);
	}

	// Открытие модального окна
	function openModal(modal) {
		modal.classList.add("_show");
		bodyLock(true);
	}

	// Закрытие модального окна
	function closeModal(modal) {
		modal.classList.remove("_show");
		bodyLock(false);
		resetHash();
	}
}

if (window.innerWidth < ANIMATIONS_WIDTH_BREAKPOINT) {
	document.querySelector(".section__body-img").dataset.aos = "fade-left";
	[
		document.querySelectorAll(".section__title"),
		document.querySelectorAll(".home-slider__desc"),
		document.querySelectorAll(".section__body-img"),
		document.querySelectorAll(".section__videos-poster"),
		document.querySelectorAll(".section__footer-site"),
		document.querySelectorAll(".download-app__link"),
		document.querySelectorAll(".download-app__title"),
	].forEach((nodeList) => {
		nodeList.forEach((item) => (item.dataset.aos = "fade-up"));
	});

	document
		.querySelectorAll(".social")
		.forEach((socials, socialsIndex, arr) => {
			const links = socials.querySelectorAll(".social__link");
			links.forEach((link, index) => {
				link.dataset.aos = "fade-up";
				link.dataset.aosDelay = 50 * index;
				if (socialsIndex == arr.length - 1) {
					link.dataset.aosOffset = 0;
				}
			});
		});
}
AOS.init();
