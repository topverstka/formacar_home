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

function defaultParallaxFrom(y = 150) {
	return {
		opacity: 0,
		y,
	};
}
function defaultParallaxTo(y = 0) {
	return {
		opacity: 1,
		y,
	};
}
function makeDefaultScene(
	trigger,
	tween,
	triggerHook = 0.35,
	indicate = false,
	offset = 0,
	duration = 0
) {
	duration =
		duration == 0
			? document.querySelector(trigger).getBoundingClientRect().height
			: duration;
	const defaultScene = new ScrollMagic.Scene({
		triggerElement: trigger,
		duration,
		triggerHook,
		offset,
	})
		.setTween(tween)
		.addTo(scrollController);
	if (indicate) {
		defaultScene.addIndicators({ name: indicate, color: "#ffffff" });
	}
}

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
const sectionPin = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration: sliderHeight,
	triggerHook: 0,
})
	.setPin(".home-slider")
	.addTo(scrollController);

let ht1 = slidesHeights[0];
if (window.innerWidth > 576) {
	ht1 = window.innerHeight + 100;
}

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
		.to(".home-slider__slide-1 .section__footer", { y: -100 }, "<")
		.from(
			".home-slider__slide-1 .section__fader",
			{ autoAlpha: 0 },
			">-0.22"
		)
		.to(
			".home-slider__slide-1",
			{ autoAlpha: 0, pointerEvents: "none" },
			">0.1"
		);
} else {
	const tY = window.innerHeight * 1.2;
	slide1Tl
		.to(".home-slider__slide-1 .section__content", {
			y: -tY,
			autoAlpha: 0,
		})
		// .to(
		// 	".home-slider__slide-1 .home-slider__desc",
		// 	{ y: -tY, autoAlpha: 0 },
		// 	"<"
		// )
		.to(".home-slider__slide-1 .section__videos", { y: -tY }, "<")
		.to(".home-slider__slide-1 .section__footer", { y: -tY }, "<")
		.from(
			".home-slider__slide-1 .section__fader",
			{ autoAlpha: 0 },
			">-0.12"
		)
		.to(
			".home-slider__slide-1",
			{ autoAlpha: 0, pointerEvents: "none" },
			">0.1"
		);
}
const slide1S = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration:
		document
			.querySelector(".home-slider__slide-1")
			.querySelector(".section")
			.getBoundingClientRect().height - 200,
	triggerHook: "onLeave",
	// offset: slidesHeights[0],
})
	.setTween(slide1Tl)
	.addTo(scrollController);
// .addIndicators({ name: "s1" });

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
		// .from(
		// 	".home-slider__slide-2 .home-slider__desc",
		// 	{ y: 300, autoAlpha: 0 },
		// 	"<"
		// )
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
		// .to(
		// 	".home-slider__slide-2 .home-slider__desc",
		// 	{ y: -300, autoAlpha: 0, delay: 0.1 },
		// 	"<"
		// )
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
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 1 }, "<-0.03")
		.to(
			".home-slider__slide-2",
			{ autoAlpha: 0, pointerEvents: "none" },
			"<"
		);
} else {
	const tY = window.innerHeight * 1.2;
	slide2Tl
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 0 })
		.to(".home-slider__slide-2 .section__content", {
			y: -tY,
			autoAlpha: 0,
		})
		// .to(
		// 	".home-slider__slide-2 .home-slider__desc",
		// 	{ y: -tY, autoAlpha: 0 },
		// 	"<"
		// )
		.to(".home-slider__slide-2 .section__videos", { y: -tY }, "<")
		.to(".home-slider__slide-2 .section__footer", { y: -tY }, "<")
		.to(".home-slider__slide-2 .section__fader", { autoAlpha: 1 }, "<+0.1")
		.to(
			".home-slider__slide-2",
			{ autoAlpha: 0, pointerEvents: "none" },
			"<"
		);
}

let slide2Duration = slidesHeights[1] * 1.5;
let s2Offset = slidesHeights[0] - 100;
if (window.innerWidth < 576) {
	// slide2Duration = slidesHeights[1] * 1.1;
	s2Offset = slidesHeights[0] - 100;
}
const slide2S = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration: slide2Duration,
	triggerHook: "onEnter",
	offset: s2Offset,
})
	.setTween(slide2Tl)
	.addTo(scrollController);
// .addIndicators({ name: "s2" });

const slide3Tl = gsap.timeline();
if (window.innerWidth) {
	slide3Tl
		.to(".home-slider__slide-3 .section__fader", { autoAlpha: 0 })
		.from(
			".home-slider__slide-3 .section__content",
			{ y: 300, autoAlpha: 0 },
			">"
		)
		// .from(
		// 	".home-slider__slide-3 .home-slider__desc",
		// 	{ y: 300, autoAlpha: 0 },
		// 	"<"
		// )
		.from(
			".home-slider__slide-3 .section__body-img",
			{ x: 300, autoAlpha: 0 },
			"<"
		)
		.from(
			".home-slider__slide-3 .section__footer",
			{ y: 300, autoAlpha: 0 },
			"<"
		);
}
let s3Offset = slidesHeights[1] + 350;
if (window.innerWidth < 576) {
	s3Offset = slidesHeights[0] + slidesHeights[1] - 350;
	slide3Tl.to(".home-slider__slide-3 .section__inner", { y: -200 });
}
const slide3S = new ScrollMagic.Scene({
	triggerElement: ".home-slider",
	duration:
		document
			.querySelector(".home-slider__slide-3")
			.querySelector(".section")
			.getBoundingClientRect().height * 1.5,
	triggerHook: "onEnter",
	offset: s3Offset,
})
	.setTween(slide3Tl)
	.addTo(scrollController);
// .addIndicators({ name: "s3" });
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
