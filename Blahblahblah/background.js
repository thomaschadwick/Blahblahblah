// background.js

chrome.extension.onMessage.addListener(function(message, sender) {
    if (message && message.type === 'showPageAction') {
        var tab = sender.tab;
        chrome.pageAction.show(tab.id);
        chrome.pageAction.setTitle({
            tabId: tab.id,
            title: 'url=' + tab.url
        });
    }
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // ignore
});

// re-adds icon while navigating facebook... it disappears for some reason
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf("facebook.com") > -1) {
        chrome.pageAction.show(tabId);
    }
});