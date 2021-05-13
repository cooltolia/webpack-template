import { getScrollbarWidth } from '@/js/common/plugins';
import MicroModal from 'micromodal';

/**
 * @type {HTMLElement[]}
 */
const fixedNodes = [
    document.querySelector('.fixed-header'),
];

function onModalOpen(modal) {
    const scrollBarWidth = getScrollbarWidth();

    document.body.style.paddingRight = scrollBarWidth + 'px';
    modal.children[0].style.paddingRight = scrollBarWidth + 'px';
    fixedNodes.forEach(node => {
        if (node) node.style.paddingRight = scrollBarWidth + 'px';
    });
}

function onModalClose(modal, remove = true, modalCopy) {
    resetPadding();

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

    function resetPadding() {
        document.body.style.paddingRight = null;
        modal.children[0].style.paddingRight = null;

        fixedNodes.forEach(node => {
            if (node) node.style.paddingRight = null;
        });
    }
}

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback onShowCallback
 * @param {HTMLElement} modal
 * @param {HTMLButtonElement | HTMLElement} trigger
 * @param {any} [args]
 */

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback onCloseCallback
 * @param {HTMLElement} modal
 */

/**
 *
 * @param {String} id - id of modal
 * @param {Object} [props]
 * @param {onShowCallback} [props.onShown] callback to fire when modal is shown
 * @param {onCloseCallback} [props.onClosed] callback to fire when modal is closed
 * @param {Boolean} [props.removeOnClose = false] Boolean to remove node from DOM
 */
function showModal(
    id,
    { onShown = null, onClosed = null, removeOnClose = false } = {}
) {
    MicroModal.show(id, {
        disableScroll: true,
        disableFocus: true,
        awaitCloseAnimation: true,
        /**
         * @param {HTMLElement} modal
         * @param {HTMLElement} trigger
         */
        onShow(modal, trigger) {
            onModalOpen(modal);
            if (typeof onShown === 'function')
                onShown(modal, trigger, ...arguments);
        },
        /**
         * @param {HTMLElement} modal
         * @param {HTMLElement} trigger
         */
        onClose(modal) {
            onModalClose(modal, removeOnClose);
            if (typeof onClosed === 'function') onClosed(modal);
        },
    });
}

function closeModal(id) {
    return new Promise(resolve => {
        const modal = document.querySelector(`#${id}`);
        MicroModal.close(id);

        modal.addEventListener('animationend', function onClose() {
            resolve()
            this.removeEventListener('animationend', onClose);
        });
    });
}

export default {
    showModal,
    closeModal,
};
