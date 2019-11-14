// ==UserScript==
// @name         Science Direct Prettify
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Get a better performance when reading papers from science direct website.
// @author       Haoyu Pan
// @match        https://www.sciencedirect.com/science/article/pii/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function main() {
        document.querySelectorAll("p").forEach(e => {
            e.style.fontFamily = "微软雅黑";
        });

        window.setTimeout(main,1000);
    }

    main();
})();
