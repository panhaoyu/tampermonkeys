// ==UserScript==
// @name         同济本部羽毛球场馆查询
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://gym.tongji.edu.cn/Pc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongji.edu.cn
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';
    const element = document.createElement('div')
    element.style.backgroundColor = 'white'
    element.style.position = 'fixed'
    element.style.width = '80vw'
    element.style.height = '80vh'
    element.style.top = '10vh'
    element.style.left = '10vw'
    element.style.zIndex = 999
    const button = document.createElement('button')
    button.innerText = '关闭'
    button.onclick = () => element.remove()
    element.appendChild(button)
    document.body.appendChild(element)

    function modalLog(text) {
        let line = document.createElement('p')
        line.innerText = text
        element.appendChild(line)
    }

    const axios = await import('https://cdn.jsdelivr.net/npm/axios/+esm')
    const dateFns = await import('https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm')
    const client = axios.default.create({
        headers: {
            "authorization": sessionStorage.tjyyToken,
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        }
    })
    const today = new Date()
    let currentDay
    let data

    modalLog('已开始处理，请等待约10秒。')
    modalLog('如果本部有可预约的场馆，则会列出；如果没有，则不列出。')
    // 1 - 129; 2 - 攀岩; 10 - 沪西
    for (const stadiumId of [1, 2]) {
        const stadiumsResponse = await client.post('https://gym.tongji.edu.cn/forwarding/stadiumApi/pc/getStadiumLocationList', {
            stadium_id: stadiumId, stadium_item_id: 1,
        })
        const stadiums = stadiumsResponse.data.data.data
        currentDay = today
        const dates = []
        while (true) {
            dates.push(dateFns.format(currentDay, 'yyyy/MM/dd'))
            if (currentDay.getDay() === 0) break
            currentDay = dateFns.addDays(currentDay, 1)
        }
        for (const stadium of stadiums) {
            for (const date of dates) {
                const response = await client.post("https://gym.tongji.edu.cn/forwarding/stadiumApi/pc/checkStadiumLocationTime", {
                    "stadium_location_id": stadium.id,
                    'date_start': date,
                });
                data = response?.data?.data?.data ?? []
                for (const obj of data) {
                    if (obj.is_check === 2) continue
                    modalLog(`${stadium.name} ${date} ${obj.time_start} - ${obj.time_end}`)
                }
            }
        }
    }
    modalLog('已完成全部处理')
})().then();