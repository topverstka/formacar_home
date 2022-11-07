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
	effect: "fade",
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

// #region gsap

const homeSlider = document.querySelector(".home-slider");
const homeSlides = homeSlider.querySelectorAll(".home-slider__slide");

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
let pinHeight = sliderHeight * 2 - 700;
if (window.innerWidth < 576) {
	pinHeight = sliderHeight * 2 - 1350;
}
const sectionPin = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration: pinHeight,
	triggerHook: 0,
})
	.setPin(".home-slider")
	.addTo(scrollController);

let ht1 = slidesHeights[0];
if (window.innerWidth > 576) {
	ht1 = window.innerHeight + 100;
}

const scrollShaft = document.querySelector(".home-slider__scrollbar-shaft");
const shaftHeight = scrollShaft.getBoundingClientRect().height;

let currentSlide = 0;
function setLogo1(e, force = false) {
	// console.log(e);
	// if (e.type == "enter") {
	if (window.pageYOffset < s1Duraction || force) {
		currentSlide = 0;
		logoSlider.slideTo(0);
		// currentSlide = 0;
		scrollShaft.style.transform = `translateY(0px)`;
	}
	// }
}
function setLogo2(e) {
	if (e.type == "enter") {
		logoSlider.slideTo(1);
		currentSlide = 1;
		const shaftOffset = shaftHeight;
		scrollShaft.style.transform = `translateY(${shaftOffset}px)`;
	}
}
function setLogo3(e) {
	if (e.type == "enter") {
		logoSlider.slideTo(2);
		currentSlide = 2;
		const shaftOffset = shaftHeight * 2;
		scrollShaft.style.transform = `translateY(${shaftOffset}px)`;
	}
}

// #region s1
const slide1Tl = gsap.timeline();
if (window.innerWidth > 576) {
	slide1Tl
		.to(".home-slider__slide-1 .section__content", {
			y: -400,
			autoAlpha: 0,
		})
		// .to(
		// 	".home-slider__slide-1 .home-slider__desc",
		// 	{ y: -400, autoAlpha: 0 },
		// 	"<0.01"
		// )
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
		.to(
			".home-slider__slide-1",
			{ autoAlpha: 0, pointerEvents: "none" },
			">0.1"
		);
} else {
	const tY = window.innerHeight * 1.2 - 100;
	slide1Tl
		.to(".home-slider__slide-1 .section__content", {
			y: -tY * 1.5,
			autoAlpha: 0,
		})
		.to(".home-slider__slide-1 .section__videos", { y: -tY * 1.5 }, "<")
		.to(".home-slider__slide-1 .section__footer", { y: -tY * 1.5 }, "<")
		.from(
			".home-slider__slide-1 .section__fader",
			{ autoAlpha: 0 },
			"<+0.42"
		)
		.to(
			".home-slider__slide-1",
			{ autoAlpha: 0, pointerEvents: "none" },
			"<-0.1"
		);
}
let s1Duraction =
	1.5 *
		document
			.querySelector(".home-slider__slide-1")
			.querySelector(".section")
			.getBoundingClientRect().height -
	200;

let s1Offset = 300;
if (window.innerWidth < 576) {
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
	// .on("enter leave", function (e) {
	// 	console.log(e.type == "enter" ? "inside" : "outside");
	// })
	// .on("start end", function (e) {
	// 	console.log(e.type == "start" ? "top" : "bottom");
	// })
	.addTo(scrollController)
	.on("enter leave", function (e) {
		setLogo1(e);
	})
	.on("progress", function (e) {
		// console.log(e, currentSlide);
		// if (e.progress < 0.75) {
		if (window.pageYOffset < s1Duraction) {
			// setLogo1(e);
		}
	});
// .addIndicators({ name: "s1" });
// #endregion s1

// #region s2
let ht2 = slidesHeights[1];
if (window.innerWidth > 576) {
	ht1 = window.innerHeight + 100;
}

const slide2Tl = gsap.timeline();
if (window.innerWidth > 576) {
	slide2Tl
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 0 })
		.from(
			".home-slider__slide-2 .section__content",
			{ y: 300, autoAlpha: 0 },
			">"
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
			{ y: -300, autoAlpha: 0, delay: 0.1 },
			">+0.001"
		)
		.to(
			".home-slider__slide-2 .section__footer",
			{ y: 300, autoAlpha: 0, delay: 0.1 },
			"<"
		)
		.to(
			".home-slider__slide-2 .section__videos",
			{ x: 300, autoAlpha: 0 },
			"<"
		)
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 1 }, ">")
		.to(
			".home-slider__slide-2",
			{ autoAlpha: 0, pointerEvents: "none" },
			"<"
		);
} else {
	const tY = window.innerHeight * 1.2 - 400;
	slide2Tl
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 0 })
		.from(
			".home-slider__slide-2 .section__content",
			{ y: 300, autoAlpha: 0 },
			"<"
		)
		.from(
			".home-slider__slide-2 .section__videos",
			{ y: 300, autoAlpha: 0 },
			"<"
		)
		.to(
			".home-slider__slide-2 .section__content",
			{
				y: -tY,
				autoAlpha: 0,
			},
			">"
		)
		.to(".home-slider__slide-2 .section__videos", { y: -tY }, "<")
		.to(".home-slider__slide-2 .section__footer", { y: -tY }, "<")
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 1 }, "<+0.3")
		.to(
			".home-slider__slide-2",
			{ autoAlpha: 0, pointerEvents: "none" },
			"<"
		);
}

let slide2Duration = slidesHeights[1] * 2.3 - 500;
let s2Offset = 2 * slidesHeights[0] - 300;
if (window.innerWidth < 576) {
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
if (window.innerWidth) {
	slide3Tl
		.to(".home-slider__slide-3 .section__fader", { autoAlpha: 0 })
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

let s3Offset = 2 * (slidesHeights[0] + slidesHeights[1]) - 350;
let s3Duration =
	document
		.querySelector(".home-slider__slide-3")
		.querySelector(".section")
		.getBoundingClientRect().height *
		2 -
	400;
if (window.innerWidth < 576) {
	s3Offset = 2 * (slidesHeights[0] + slidesHeights[1]) - 1250;
	slide3Tl.to(".home-slider__slide-3 .section__inner", { y: -200 });
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
		setLogo1({ type: "enter" }, true);
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
		currentSlide = 1;
	} else if (currentSlide == 2) {
		setLogo2({ type: "enter" });
		window.scroll({
			top: s1Duraction + 150,
			left: 0,
			behavior: "smooth",
		});
		currentSlide = 2;
	}
}

document.querySelector(".home-slider__prev").addEventListener("click", () => {
	handleSlidePrev();
});

function handleSlideNext() {
	if (currentSlide == 0) {
		setLogo2({ type: "enter" });
		window.scroll({
			top: s1Duraction + 150,
			left: 0,
			behavior: "smooth",
		});
		currentSlide = 1;
	} else if (currentSlide == 1) {
		setLogo3({ type: "enter" });
		window.scroll({
			top: s1Duraction + slide2Duration + s3Duration,
			left: 0,
			behavior: "smooth",
		});
		currentSlide = 2;
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
	// if (e.deltaY > 0) {
	// 	handleSlideNext();
	// } else if (e.deltaY < 0) {
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
