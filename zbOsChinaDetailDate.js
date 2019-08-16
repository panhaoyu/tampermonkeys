// ==UserScript==
// @name         Zhong Bao Detail Page Date Time
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Automatically show the date and time, instead of only date.
// @author       Haoyu Pan
// @match        https://www.sciencedirect.com/science/article/pii/*
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';
    let id = location.href.split('=')[1];
    let response = await fetch('https://zb.oschina.net/project/detail?id=' + id);
    let data = await response.json();
    console.log(data);
    document.querySelector('.detail__main > p > span').innerText = data.data.publishTime;
})();