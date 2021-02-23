class Counter {
    /**
     * @param {HTMLElement} wrapper
     */
    constructor(wrapper) {
        this.wrapper = wrapper;
        if (!this.wrapper) return;

        this.currentNode = this.wrapper.querySelector('.counter__current');
        this.minusButton = this.wrapper.querySelector(`[data-action='minus']`);
        this.plusButton = this.wrapper.querySelector(`[data-action='plus']`);

        this.maxCount = parseInt(this.wrapper.dataset.max);
        this.initialCount = parseInt(this.currentNode.value);
    }

    init() {
        if (!this.wrapper) return;

        this.setActiveControls();

        this.minusButton.addEventListener('click', () => {
            this.decreaseCounter();
        });

        this.plusButton.addEventListener('click', () => {
            this.inreaseCounter();
        });
    }

    update(newValue, newMax) {
        this.currentNode.value = newValue;

        this.maxCount = +newMax;
        this.counter.dataset.max = newMax;

        this.setActiveControls();
    }

    decreaseCounter() {
        const current = parseInt(this.currentNode.value);
        let newValue = current;

        newValue = current - 1;
        this.plusButton.classList.remove('disabled');
        if (newValue < 1) {
            return current;
        } else if (newValue === 1) {
            this.minusButton.classList.add('disabled');
        }

        this.currentNode.value = newValue;

        return newValue;
    }

    inreaseCounter() {
        const current = parseInt(this.currentNode.value);
        let newValue = current;

        newValue = current + 1;
        this.minusButton.classList.remove('disabled');
        if (newValue > this.maxCount) {
            /** show some error, I guess */
            return current;
        } else if (newValue === this.maxCount) {
            this.plusButton.classList.add('disabled');
        }

        this.currentNode.value = newValue;

        return newValue;
    }

    setActiveControls() {
        this.minusButton.classList.remove('disabled');
        this.plusButton.classList.remove('disabled');

        if (this.maxCount === this.initialCount) {
            this.plusButton.classList.add('disabled');
        }

        if (this.initialCount === 1) {
            this.minusButton.classList.add('disabled');
        }
    }
}