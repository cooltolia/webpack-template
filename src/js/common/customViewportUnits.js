export default function () {
    const alreadyDifined = !!document.documentElement.style.getPropertyValue(
        '--vh'
    );
    if (alreadyDifined) return;

    window.addEventListener('resize', resizeThrottler, false);

    let resizeTimeout;
    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                actualResizeHandler();
            }, 66);
        }
    }

    function actualResizeHandler() {
        let vh = window.innerHeight * 0.01;
        let vw = document.documentElement.clientWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    }

    actualResizeHandler();
}
