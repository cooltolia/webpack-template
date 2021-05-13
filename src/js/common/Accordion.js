import { slideToggle } from '@/js/common/plugins';

/**
 *
 * @export
 * @class Accordion
 */
export default class Accordion {
    /**
     *Creates an instance of Accordion.
     * @param {HTMLElement} section
     * @memberof Accordion
     */
    constructor(section) {
        this.section = section;

        this.init()
    }

    init() {
        this.setEventListeners();
    }

    onChange(trigger) {
        return new CustomEvent('change', {
            detail: {
                opened: !!trigger.classList.contains('active'),
                parentBlock: trigger.parentElement
            },
        });
    }

    setEventListeners() {
        this.section.addEventListener('click', e => {
            const trigger = e.target.closest('.js-trigger');
            if (trigger) {
                const content = trigger.nextElementSibling;
                trigger.classList.toggle('active');
                slideToggle(content).promise.then(() => {
                    this.section.dispatchEvent(this.onChange(trigger));
                });
            }
        })
    }

    on(event, callback) {
        this.section.addEventListener(event, ({ detail }) => {
            callback(detail)
        });
    }

}