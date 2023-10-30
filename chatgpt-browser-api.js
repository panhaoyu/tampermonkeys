// ==UserScript==
// @name         ChatGPT API By Browser Script
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// ==/UserScript==

const WS_URL = `ws://127.0.0.1:8765`

function getTextFromNode(node) {
    let result = ''

    if (!node) return result
    const childNodes = node.childNodes

    for (let i = 0; i < childNodes.length; i++) {
        let childNode = childNodes[i]
        if (childNode.nodeType === Node.TEXT_NODE) {
            result += childNode.textContent
        } else if (childNode.nodeType === Node.ELEMENT_NODE) {
            result += getTextFromNode(childNode)
        }
    }

    return result
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

function rightArea() {
    return document.querySelector('[role="presentation"]')
}

function leftArea() {
    return document.querySelector('[aria-label="Chat history"]')
}

function newChatButton() {
    return Array.from(leftArea().querySelectorAll('a'))
        .find(i => i.textContent.trim() === 'New Chat')
}

function gptModel3Button() {
    return Array.from(rightArea().querySelectorAll('button[type=button]'))
        .find(i => i.textContent.trim() === 'GPT-3.5')
}

function gptModel4Button() {
    return Array.from(rightArea().querySelectorAll('button[type=button]'))
        .find(i => i.textContent.trim() === 'GPT-4')
}

function formArea() {
    return rightArea().querySelector('form')
}

function inputWidget() {
    return formArea().querySelector('textarea')
}

function regenerateButton() {
    return Array.from(formArea().querySelectorAll('button'))
        .find(i => i.textContent.trim().toLowerCase() === 'regenerate')
}

function stopGeneratingButton() {
    return Array.from(formArea().querySelectorAll('button'))
        .find(i => i.textContent.trim().toLowerCase() === 'stop generating')
}

function sendButton() {
    return inputWidget().nextElementSibling
}


// Main app class
class App {
    constructor() {
        this.socket = null
        this.observer = null
        this.stop = false
        this.dom = null
    }

    async start({text, model, newChat}) {
        this.stop = false
        if (newChat) {
            newChatButton().click()
            await sleep(500)
            switch (model) {
                case 'gpt-3':
                    gptModel3Button().click()
                    break
                case 'gpt-4':
                    gptModel4Button().click()
                    break
            }
            await sleep(500)
        }
        inputWidget().value = text
        inputWidget().dispatchEvent(new Event('input', {bubbles: true}))
        await sleep(500)
        sendButton().click()
        this.observeMutations()
    }

    observeMutations() {
        this.observer = new MutationObserver(async (mutations) => {
            const list = [...document.querySelectorAll('[role=presentation] .group [data-message-author-role=assistant]')]
            const last = list[list.length - 1]
            if (!last) return
            const lastText = getTextFromNode(last.querySelector('div.flex.flex-grow.flex-col.gap-3'))
            console.log('send', {text: lastText,})
            this.socket.send(JSON.stringify({type: 'answer', text: lastText}))
            await sleep(1000)
            if (stopGeneratingButton()) return
            if (regenerateButton()) {
                // TODO 没有处理continue的按钮，或者其它别的按钮的逻辑
                if (this.stop) return
                this.stop = true
                console.log('send', {type: 'stop'})
                this.socket.send(JSON.stringify({type: 'stop'}))
                this.observer.disconnect()
            }
        })

        this.observer.observe(document.body, {childList: true, subtree: true})
    }

    sendHeartbeat() {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({type: 'heartbeat'}))
        }
    }

    connect() {
        this.socket = new WebSocket(WS_URL)
        this.socket.onopen = () => {
            console.log('Server connected, can process requests now.')
            this.dom.innerHTML = '<div style="color: green ">API Connected !</div>'
        }
        this.socket.onclose = () => {
            console.log('The server connection has been disconnected, the request cannot be processed.')
            this.dom.innerHTML = '<div style="color: red ">API Disconnected !</div>'

            setTimeout(() => {
                console.log('Attempting to reconnect...')
                this.connect()
            }, 2000)
        }
        this.socket.onerror = () => {
            console.log('Server connection error, please check the server.')
            this.dom.innerHTML = '<div style="color: red ">API Error !</div>'
        }
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log('params', data)
            this.start(data)
        }
    }

    init() {
        window.addEventListener('load', () => {
            this.dom = document.createElement('div')
            this.dom.style = 'position: fixed top: 10px right: 10px z-index: 9999 display: flex justify-content: center align-items: center'
            document.body.appendChild(this.dom)

            this.connect()

            setInterval(() => this.sendHeartbeat(), 30000)
        })
    }

}

(function () {
    'use strict'
    const app = new App()
    app.init()
})()