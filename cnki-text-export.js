// ==UserScript==
// @name         知网文本导出
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Export the text content of a specific element to a TXT file with a custom filename and preprocessing
// @author       You
// @match        *://*.cnki.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 "保存 TXT" 按钮并添加到页面
    const btn = document.createElement("button");
    btn.innerHTML = "保存 TXT";
    btn.style.position = "fixed";
    btn.style.top = "0";
    btn.style.right = "0";
    btn.style.zIndex = "9999";

    document.body.appendChild(btn);

    // 清理文件名，仅保留中英文字符
    function cleanFilename(filename) {
        return filename.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '');
    }

    // 预处理文件内容
    function preprocessContent(content) {
        // 删除开头的特定文本（如“网络首发时间: 2018-12-13 10:27”）
        content = content.replace(/^网络首发时间: \d{4}-\d{2}-\d{2} \d{2}:\d{2}\n?/, '');

        // 删除开头的空格
        content = content.replace(/^\s+/, '');


        // 将NBSP替换为空格
        content = content.replace(/\u00A0/g, ' ');

        // 使用正则表达式删除匹配到的内容
        const regex = /((\(|（)[-a-zA-Z .]{1,30}(\)|）)| |\[\d+\])/g;
        content = content.replace(regex, '');


        return content;
    }

    // 当点击按钮时执行的函数
    btn.onclick = function() {
        // 使用 CSS 选择器获取特定元素的文本内容
        const selector = "#mainBody > div.main > div.content";
        const element = document.querySelector(selector);
        if (element) {
            let specificText = element.innerText;

            // 预处理文件内容
            specificText = preprocessContent(specificText);

            const lines = specificText.split('\n');

            // 提取第二行作为文件名
            let filename = lines.length > 1 ? lines[1] : "default";
            filename = cleanFilename(filename) + ".txt";

            // 创建一个 Blob 对象
            const blob = new Blob([specificText], { type: 'text/plain' });

            // 创建一个下载链接
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;

            // 触发下载
            document.body.appendChild(a);
            a.click();

            // 清理
            document.body.removeChild(a);
        } else {
            alert("Element not found!");
        }
    };

})();