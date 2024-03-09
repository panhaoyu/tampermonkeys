// ==UserScript==
// @name         ChatGPT Response Download as Markdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to simulate copy to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to create a download link and click it to save the file
    function downloadToFile(content, filename, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // Function to format the current date and time
    function formatDate(date) {
        return date.toISOString().replace(/[\-\:\.]/g, '').slice(0, 15);
    }

    // 使用这个函数来模拟点击复制按钮
    function clickCopyButton() {
        const agentTurns = document.querySelectorAll('.agent-turn');
        const lastAgentTurn = agentTurns[agentTurns.length - 1]
        const lastCopyButtonSvgs = lastAgentTurn.querySelectorAll('button svg.icon-md')
        const lastCopyButtonSvg = lastCopyButtonSvgs[0]
        if (lastCopyButtonSvg) {
            lastCopyButtonSvg.parentNode.click();
        } else {
            throw 'Not found last respose'
        }
    }

    // 使用这个函数实现读取html。
    async function getLastHtml() {
        const agentTurns = document.querySelectorAll('.agent-turn');
        const lastAgentTurn = agentTurns[agentTurns.length - 1]
        const lastHtmlElement = lastAgentTurn.querySelector('[data-message-author-role="assistant"] > div')
        return lastHtmlElement.innerHTML
    }

    // 重写 getLastResponseText 函数
    async function getLastResponseText() {
        // 点击复制按钮
        clickCopyButton();

        // 等待 0.3 秒以确保内容被复制
        await new Promise(resolve => setTimeout(resolve, 300));

        // 从剪切板中读取内容
        try {
            return await navigator.clipboard.readText();
        } catch (error) {
            console.error('Error reading from clipboard: ', error);
            return '';
        }
    }

    // Function to handle the button click
    async function handleButtonClick() {
        // const responseText = await getLastResponseText();
        // if (!responseText) {
        //     alert('No response found to save.');
        //     return;
        // }

        // const filename = `ChatGPT_Response_${formatDate(new Date())}.md`;
        // downloadToFile(responseText, filename, 'text/markdown');

        // const filePath = `C:/Users/panha/Downloads/${filename}`;
        // copyToClipboard(filePath);
        // alert(`Response saved and file path copied to clipboard:\n${filePath}`);

        const lastHtml = await getLastHtml()
        console.log(lastHtml)
        await copyHtmlToClipboard(lastHtml)
    }

    // Create and add the button to the page
    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Save & Copy Last Response';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.addEventListener('click', handleButtonClick);
        document.body.appendChild(button);
    }

    async function copyHtmlToClipboard(html) {
        try {
            await window.navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([html], {type: 'text/html'})
                })
            ]);
            console.log('HTML copied to clipboard');
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    }

    async function sleep(seconds) {
        await new Promise(resolve => setTimeout(resolve, seconds))
    }

    addButton();


// 示例：调用函数
    const htmlContent = `<p>Hello <strong>World</strong></p>`;
    copyHtmlToClipboard(htmlContent);


})();