// ==UserScript==
// @name         找歌词网zgeci复制lrc
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  复制lrc内容
// @author       Haoyu Pan
// @match        https://www.zgeci.com/lrc/*.html
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    // lrc想处理好还是比较麻烦的，暂时不处理
    const clipboardObj = navigator.clipboard;
    console.assert(clipboardObj !== undefined)
    const text = document.querySelector('#lrc').innerText
    text.split('\n')
        .map(line => line.split(']', 2))
        .map(([time, content]) => [`${time}]`, content])
        .filter(([time, content]) => content)
        .map(([time, content]) => `${time}${content}`)
        .forEach(line => console.log(line))

})();