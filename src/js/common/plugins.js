let scrollBarWidth = null;
let currentRequestAnimationFrame;

/**
 * @description
 * firstly checks if has cached value in this.scrollBarWidth =>
 * than calcs it if absent
 *
 * @returns {Number} width of scroll bar
 */
function getScrollbarWidth() {
    if (scrollBarWidth || scrollBarWidth === 0) return scrollBarWidth;

    scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    return scrollBarWidth;
}

/**
 * @description
 * relies on window width.
 * should correspond to variables.scss media
 */
const deviceType = {
    mobileMedia: window.matchMedia('(max-width: 767px)'),
    get isMobile() {
        return this.mobileMedia.matches;
    },
    tabletMedia: window.matchMedia(
        '(min-width: 768px) and (max-width: 1023px)'
    ),
    get isTablet() {
        return this.tabletMedia.matches;
    },
    laptopMedia: window.matchMedia(
        '(min-width: 1024px) and (max-width: 1279px)'
    ),
    get isLaptop() {
        return this.laptopMedia.matches;
    },
    desktopMedia: window.matchMedia('(min-width: 1280px)'),
    get isDesktop() {
        return this.desktopMedia.matches;
    },
    /** additional properties */
    minimumLaptopMedia: window.matchMedia('(min-width: 1024px)'),
};

/**
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {String} [props.display='block'] - display property
 * @param {Number} [props.speed = 160] - animation speed
 * @returns {Promise}
 */
function fadeIn(el, { display = 'block', speed = 160 } = {}) {
    /* no need to show again a visible element */
    if (!isHidden(el)) return;

    return new Promise(resolve => {
        const animationSpeed = 16 / speed;
        el.style.opacity = 0;
        el.style.display = display;

        const fade = () => {
            let id;
            var val = parseFloat(el.style.opacity);
            if (!((val += animationSpeed) > 1)) {
                el.style.opacity = val;
                id = requestAnimationFrame(fade);
            } else {
                el.style.opacity = 1;
                resolve();
            }

            return id;
        };

        fade();
    });
}

/**
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {Number} [props.speed = 160] - animation speed
 * @returns {Promise}
 */
function fadeOut(el, { speed = 160 } = {}) {
    /* no need to hide again an invisible element */
    if (isHidden(el)) return;

    return new Promise(resolve => {
        const animationSpeed = 16 / speed;
        el.style.opacity = 1;

        const fade = () => {
            let id;
            if ((el.style.opacity -= animationSpeed) < 0) {
                el.style.display = 'none';
                resolve();
            } else {
                id = requestAnimationFrame(fade);
            }

            return id;
        };

        fade();
    });
}

/**
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {Number} [props.speed = 200] - animation speed
 * @param {String} [props.display='block'] - display property
 * @returns {Promise}
 */
function fadeToggle(el, { speed = 200, display = 'block' } = {}) {
    if (isHidden(el)) {
        fadeIn(el, { speed: speed, display: display });
    } else {
        fadeOut(el, { speed: speed });
    }
}

/**
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {String} [props.display='block'] - display property
 * @param {String} [props.classList] - additional class to add
 */
function show(el, { display = 'block', classList = '' } = {}) {
    el.style.display = display;
    if (classList.length > 0) el.classList.add(classList);
}

/**
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {String} [props.classList] - class name to remove
 */
function hide(el, { classList = '' } = {}) {
    el.style.display = 'none';
    if (classList.length > 0) el.classList.remove(classList);
}

/**
 * @param {HTMLElement} el
 * @param {Object} props
 * @param {String} [props.display='block'] - display property
 * @param {String} [props.classList] - additional class to toggle
 */
function toggle(el, { display = 'block', classList = '' } = {}) {
    if (getComputedStyle(el).display === 'none') {
        el.style.display = display;
        if (classList.length > 0) el.classList.add(classList);
    } else {
        el.style.display = 'none';
        if (classList.length > 0) el.classList.remove(classList);
    }
}

/**
 * @param {HTMLElement} el
 * @param {Object} [props]
 * @param {Number} [props.speed = 120] - animation speed
 * @param {String} [props.display='block'] - display property
 *
 * @typedef {Object} returnObject
 * @property {Promise} returnObject.promise
 * @property {Function} returnObject.cancel - abort animation. Not tested!
 *
 * @returns {returnObject}
 */
function slideDown(el, { speed = 120, display = 'block' } = {}) {
    let resolve, reject;
    const promise = new Promise((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;

        let startHeight = 0;
        let startPaddingTop = 0;
        let startPaddingBottom = 0;

        const elStyles = window.getComputedStyle(el);
        const paddingTop = parseInt(elStyles.paddingTop);
        const paddingBottom = parseInt(elStyles.paddingBottom);

        el.style.height = startHeight + 'px';
        el.style.overflow = 'hidden';
        el.style.display = 'block';
        const height = el.scrollHeight;

        el.style.paddingTop = startPaddingTop;
        el.style.paddingBottom = startPaddingBottom;

        const heightAnimationSpeed = (height / speed) * 16;
        const paddingTopAnimationSpeed = (paddingTop / speed) * 16;
        const paddingBottomAnimationSpeed = (paddingBottom / speed) * 16;
        el.style.display = display;

        const slide = () => {
            let id;
            let newHeight = (startHeight += heightAnimationSpeed);
            let newPaddingTop = (startPaddingTop += paddingTopAnimationSpeed);
            let newPaddingBottom = (startPaddingBottom += paddingBottomAnimationSpeed);
            el.style.height = newHeight + 'px';
            el.style.paddingTop = newPaddingTop + 'px';
            el.style.paddingBottom = newPaddingBottom + 'px';

            if (newHeight > height) {
                currentRequestAnimationFrame = null;
                el.style.cssText = `display: ${display}`;
                resolve();
            } else {
                currentRequestAnimationFrame = requestAnimationFrame(slide);
            }

            return id;
        };

        slide();
    });

    return {
        promise,
        cancel: () => {
            cancelled = true;
            reject({ reason: 'cancelled' });
        },
    };
}

/**
 * @param {HTMLElement} el
 * @param {Object} [props]
 * @param {Number} [props.speed = 120] - animation speed
 *
 * @typedef {Object} returnObject
 * @property {Promise} returnObject.promise
 * @property {Function} returnObject.cancel - abort animation. Not tested!
 *
 * @returns {returnObject}
 */
function slideUp(el, { speed = 120 } = {}) {
    let resolve, reject;
    const promise = new Promise((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;

        const elStyles = window.getComputedStyle(el);
        const height = el.offsetHeight;
        const paddingTop = parseInt(elStyles.paddingTop);
        const paddingBottom = parseInt(elStyles.paddingBottom);

        let startHeight = height;
        let startPaddingTop = paddingTop;
        let startPaddingBottom = paddingBottom;

        el.style.height = startHeight + 'px';
        el.style.overflow = 'hidden';

        const heightAnimationSpeed = (height / speed) * 16;
        const paddingTopAnimationSpeed = (paddingTop / speed) * 16;
        const paddingBottomAnimationSpeed = (paddingBottom / speed) * 16;

        const slide = () => {
            let id;
            let newHeight = (startHeight -= heightAnimationSpeed);
            let newPaddingTop = (startPaddingTop -= paddingTopAnimationSpeed);
            let newPaddingBottom = (startPaddingBottom -= paddingBottomAnimationSpeed);
            el.style.height = newHeight + 'px';
            el.style.paddingTop = newPaddingTop + 'px';
            el.style.paddingBottom = newPaddingBottom + 'px';

            if (newHeight < 0) {
                el.style.cssText = `display: none`;

                currentRequestAnimationFrame = null;
                resolve();
            } else {
                currentRequestAnimationFrame = requestAnimationFrame(slide);
            }

            return id;
        };

        slide();
    });

    return {
        promise,
        cancel: () => {
            cancelled = true;
            reject({ reason: 'cancelled' });
        },
    };
}

/**
 * @param {HTMLElement} el
 * @param {Object} [props]
 * @param {Number} [props.speed = 120] - animation speed
 * @param {String} [props.display='block'] - display property
 */
function slideToggle(el, { speed = 120, display = 'block' } = {}) {
    if (isHidden(el)) {
        return slideDown(el, { speed: speed, display: display });
    } else {
        return slideUp(el, { speed: speed });
    }
}

/**
 * @param {HTMLElement} target - target element to scroll to
 * @param {Number} [offset = 50] - value for top offset
 */
function scrollTo(target, offset = 50) {
    if (!target) {
        console.log('target: ', target);
        return;
    }
    const scrollPosition = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
        top: scrollPosition - offset,
        behavior: 'smooth',
    });
}

/**
 * @param {HTMLElement} el
 * @returns {Boolean} true if el is hidden via display: none
 */
function isHidden(el) {
    let style = window.getComputedStyle(el);
    return style.display === 'none';
}

export {
    hide,
    show,
    isHidden,
    toggle,
    fadeIn,
    fadeOut,
    fadeToggle,
    slideDown,
    slideUp,
    slideToggle,
    scrollTo,
    getScrollbarWidth,
    deviceType,
};
