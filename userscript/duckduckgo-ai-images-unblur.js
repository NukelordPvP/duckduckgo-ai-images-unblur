// ==UserScript==
// @name         DuckDuckGo AI Images Unblur (Double State Flip)
// @namespace    duckduckgo-ai-images-unblur
// @version      3.0
// @match        https://duckduckgo.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let passes = 0;
    let opened = false;

    function getAIToggle() {
        const span = Array.from(document.querySelectorAll('span'))
        .find(s => {
            const t = s.textContent.trim();
            return t === 'AI images: show' || t === 'AI images: hide';
        });

        if (!span) return null;

        return {
            state: span.textContent.includes('hide') ? 'hide' : 'show',
 el: span.closest('div')
        };
    }

    function findMenuOption(text) {
        return Array.from(document.querySelectorAll('span'))
        .find(s => s.textContent.trim() === text)
        ?.closest('div');
    }

    const observer = new MutationObserver(() => {
        const toggle = getAIToggle();
        if (!toggle) return;

        // Open menu
        if (!opened) {
            toggle.el.click();
            opened = true;
            return;
        }

        // Click opposite option
        const opposite = toggle.state === 'show' ? 'Hide' : 'Show';
        const option = findMenuOption(opposite);

        if (option) {
            option.click();
            opened = false;
            passes++;

            // Run twice total, then stop forever
            if (passes >= 2) {
                observer.disconnect();
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
