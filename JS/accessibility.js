function trapFocus(element, namespace) {
    var focusableEls = element.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="email"]'),
        firstFocusableEl = focusableEls[0];
        lastFocusableEl = focusableEls[focusableEls.length - 1];
        KEYCODE_TAB = 9;

    firstFocusableEl.focus();

    element.addEventListener('keydown', function(e) {
        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }

        if ( e.shiftKey ) /* shift + tab */ {
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else /* tab */ {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }

    });
}