function onModalOpen(modal) {
    const scrollBarWidth = $$.getScrollbarWidth();
    document.body.style.paddingRight = scrollBarWidth + 'px';

    // if (modal) modal.children[0].style.paddingRight = scrollBarWidth + 'px';

    const fixedNodes = [document.querySelector('.fixed-header')];
    fixedNodes.forEach((node) => {
        if (node) node.style.paddingRight = scrollBarWidth + 'px';
    });
}

function onModalClose(modal, remove = true, modalCopy) {
    // modal.children[0].style.paddingRight = null;
    document.body.style.paddingRight = null;

    const fixedNodes = [document.querySelector('.fixed-header')];
    fixedNodes.forEach((node) => {
        if (node) node.style.paddingRight = null;
    });

    if (remove) {
        modal.addEventListener('animationend', function removeModal() {
            this.remove();
            this.removeEventListener('animationend', removeModal);
        });
    }
    if (modalCopy) {
        // clone to delete all event listeners
        modal.addEventListener('animationend', function updateModal() {
            modalCopy.classList.remove('is-open');
            this.removeEventListener('animationend', updateModal);
            this.remove();

            document.body.append(modalCopy);
        });
    }
}

function loadModal(url) {
    return new Promise((resolve) => {
        getData(url).then((data) => {
            debugger;
            const modalHtml = data.html;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            resolve();
        });
    });
}

/**
 *
 * @param {String} id - id of modal
 * @param {Object} [props]
 * @param {Function} [props.onShow] callback to fire when modal is shown
 * @param {Function} [props.onClose] callback to fire when modal is closed
 * @param {Boolean} [props.removeOnClose = false] Boolean to remove node from DOM
 */
MicroModal.showModal = function(id, { onShow = null, onClose = null, removeOnClose = false } = {}) {
    this.show(id, {
        disableScroll: true,
        disableFocus: true,
        awaitCloseAnimation: true,
        onShow(modal, trigger) {
            onModalOpen(modal);
            if (typeof onShow === 'function') onShow(modal, trigger, ...arguments);
        },
        onClose(modal) {
            onModalClose(modal, removeOnClose);
            if (typeof onClose === 'function') onClose(modal);
        },
    });
};

