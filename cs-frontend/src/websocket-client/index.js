import { middleDispatch } from './reducer';

const websocketUrl = 'ws://localhost:1234';

let ws;

export function startWebSocket(onOpenCallBack) {
    console.log('ws cteating...');
    if (ws && ws.readyState === 1) {
        console.log('ws already created...');
        return;
    }
    ws = new WebSocket(websocketUrl, 'echo-protocol');
    ws.binaryType = "arraybuffer";
    ws.onopen = function () {
        console.log('ws opened...');
        if (onOpenCallBack && typeof onOpenCallBack === 'function') {
            onOpenCallBack();
        }
    };
    ws.onmessage = function (evt) {
        if (typeof (evt.data) === "string") {
            console.log(evt.data);
            middleDispatch(JSON.parse(evt.data));
        }
        else {
            // Save, WebSocket-HTML5Player
        }
    };
    ws.onerror = function (evt) {
        console.log('ws error.');
    };
    ws.onclose = function () {
        console.log('ws closed.');
    };
}

export function closeWebSocket() {
    ws.close();
}

export function sendDataToServer(data) {
    ws.send(data);
}