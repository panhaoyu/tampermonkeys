// ==UserScript==
// @name         Science Direct Prettify
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Get a better performance when reading papers from science direct website.
// @author       Haoyu Pan
// @match        https://www.sciencedirect.com/science/article/pii/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        document.querySelector('body').innerHTML = document.querySelector('article').innerHTML;
        document.querySelector('body').style.margin = '1rem';
	if (Number(window.getComputedStyle(document.querySelector('html')).width.slice(0, 4)) > 1300){
            document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, th, td').forEach(e => {
                e.style.cssText += `
	            font-size: ${Number(window.getComputedStyle(e).fontSize.slice(0, 2)) * 3}px !important;
		    line-height: ${Number(window.getComputedStyle(e).fontSize.slice(0, 2)) * 4}px !important;
		    `;
            })
	} else {
            document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, th, td').forEach(e => {
                e.style.cssText += `
                    font-size: ${Number(window.getComputedStyle(e).fontSize.slice(0, 2)) * 2}px !important;
                    line-height: ${Number(window.getComputedStyle(e).fontSize.slice(0, 2)) * 3}px !important;
                    `;
            })
	    
	}
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(e => {
            e.style.cssText += `
color: red;
font-weight: bold !important;
`;
        });
    }, 1000);
})();
