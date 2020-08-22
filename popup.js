// message pass 준비
var port = chrome.extension.connect({
    name: 'Sample Connection from popup'
});

// message pass 수신
port.onMessage.addListener((msg)=>{
    console.log('message from backgroun:', msg);
});

// init
window.onload = ()=>{
    document.querySelector('#startRecord').addEventListener('click', (event)=>{
        port.postMessage({'action': 'startRecord'});
    });
}