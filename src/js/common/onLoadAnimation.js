export default function () {
    const pageWrapper = document.querySelector('.page-wrapper');
    if (!pageWrapper) return;

    /** @type {Array<HTMLElement>} */
    const childrenToAnimate = [...pageWrapper.children]
        .filter(el => {
            return (
                !el.classList.contains('fixed-header') &&
                !el.classList.contains('dropdown-menu') &&
                el
            );
        })
        .filter((_, i) => i <= 3);

    const animationStep = 150; // transtion delay step in ms

    /** first hide elements */
    childrenToAnimate.map(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(-50px)';
    });

    /** fire animation */
    setTimeout(() => {
        childrenToAnimate.map((el, index) => {
            el.classList.add('animatable');
            el.style.transitionDelay =
                index * animationStep + animationStep + 'ms';
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';

            /** not crucial but remove animation inline styles */
            setTimeout(() => {
                el.style = null;
            }, 1000);
        });
    }, 4);
}
