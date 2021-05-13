import { scrollTo } from '@/js/common/plugins'

export default function() {
    document.addEventListener('click', e => {
        const target = e.target.dataset.scrollTo
        if (target) {
            // e.preventDefault();
            const el = document.querySelector(target);
            scrollTo(el);
        }
    })
}