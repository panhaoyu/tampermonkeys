// ==UserScript==
// @name         同济一卡通处理
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  下载同济一卡通数据
// @author       Haoyu Pan
// @match        https://yikatong.tongji.edu.cn/page/page
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';
    await import('https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js')
    const data = {"sdate": "2020-01-01", "edate": "2029-01-01", "account": "370701", "page": 1, "rows": 10000}
    const response = await fetch("https://yikatong.tongji.edu.cn/Report/GetPersonTrjn", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&'),
        "method": "POST",
    });
    const result = await response.json()
    const excelData = result.rows.map(i => ({
        '交易时间': i['OCCTIME'],
        '交易地点': i['MERCNAME'],
        '交易金额': i['TRANAMT'],
        '交易类型': i['TRANNAME'],
        '卡余额': i['CARDBAL'],
    })).filter(i => ['持卡人开户', '持卡人消费', '领取补助'].includes(i.交易类型))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(excelData), "Sheet1")
    XLSX.writeFile(wb, "一卡通流水.xlsx")
})();