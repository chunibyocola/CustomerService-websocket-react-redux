import * as types from '../../constants/CustomerServiceActionTypes';
import { sendFileUploadHead, sendFileUploadEnd, sendFileUploadFragment } 
    from '../../websocket-client/wsSend';
import { getStoreState } from '../../store';

const fragmentSize = 2048;

let uploadList = {};
let readyList = {};
let fileIdFlag = 0;
export function addFileUploadItem(fileInfo, targetId, senderId, msgType) {
    let type = fileInfo.name.split('.')[1];
    let reader = new FileReader();
    reader.readAsDataURL(fileInfo);
    reader.onload = function () {
        let dataUrl = this.result.split(',')[1];
        let preDataUrl = this.result.split(',')[0];
        let size = dataUrl.length;
        readyList[fileIdFlag] = { 
            type, size, dataUrl, targetId, senderId, preDataUrl
        };
        sendFileUploadHead(targetId, type, size, fileIdFlag, msgType);
        fileIdFlag++;
    }
}

export function fileUploadHeadSuccess(payload, dispatch) {
    let { fileName, fileId, status } = payload;
    let { targetId, senderId } = readyList[fileId];
    let { preDataUrl, dataUrl } = readyList[fileId];
    let { chatState } = getStoreState();
    let msgId = chatState[targetId].msgCount;
    if (status) {
        uploadList[fileName] = {
            ...readyList[fileId], current: 0, last: 0, msgId
        }
    }
    delete readyList[fileId];
    dispatch({ 
        type: types.FILE_UPLOAD_HEAD, 
        payload: { 
            ...payload,
            targetId, senderId, dataUrl: `${ preDataUrl },${ dataUrl }`, msgId
        }
    });
    if (status) {
        nextFileUploadFragment({ fileName, status: true, allowResendTimes: null });
    }
}

export function nextFileUploadFragment(payload) {
    let { status, allowResendTimes, fileName } = payload;
    let { current, size, dataUrl, last } = uploadList[fileName];
    let fileFragment;
    if (status) {
        if (current < size) {
            fileFragment = dataUrl.slice(current, current + fragmentSize);
            last = current;
            current += fragmentSize;
            //send next
            sendFileUploadFragment(fileName, fileFragment);
            uploadList[fileName] = { ...uploadList[fileName], current, last };
        }
        else {
            //send end
            sendFileUploadEnd(fileName);
        }
    }
    else {
        if (allowResendTimes > 0) {
            current = last;
            fileFragment = dataUrl.slice(current, current + fragmentSize);
            current += fragmentSize;
            // send next
            sendFileUploadFragment(fileName, fileFragment);
            uploadList[fileName] = { ...uploadList[fileName], current, last };
        }
    }
}

export function fileUploadEnd(payload, dispatch) {
    let { fileName } = payload;
    let { targetId, msgId } = uploadList[fileName];
    payload = { ...payload, targetId, msgId };
    dispatch({ type: types.FILE_UPLOAD_END, payload });
    delete uploadList[fileName];
}