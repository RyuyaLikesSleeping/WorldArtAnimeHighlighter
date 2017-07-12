chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.storage.sync.get(["wantSeeUrl", "seeUrl", "seenUrl", "droppedUrl", "inCollectionUrl"], function (items) {
            for (let i = 0; i < Object.keys(items).length; i++) {
                if (!items[Object.keys(items)[i]]) {
                    chrome.storage.sync.set({ [Object.keys(items)[i]]: "" });
                }
            }
        });
        chrome.storage.local.set({ "extensionEnabled": true, "lastUpdateStatus": false, "lastUpdateDate": "", "wantSeeData": [], "seeData": [], "seenData": [], "droppedData": [], "inCollectionData": [] });
    }
});
chrome.runtime.onStartup.addListener(function () {
    chrome.storage.local.get(["extensionEnabled", "lastUpdateStatus", "lastUpdateDate"], function (items) {
        if (items["extensionEnabled"]) {
            if (!items["lastUpdateStatus"] || items["lastUpdateStatus"] != new Date().toLocaleDateString("ru-RU")) {
                updateAllLists();
            }
        }
    });
});
function updateAllLists() {
    chrome.storage.sync.get(["wantSeeUrl", "seeUrl", "seenUrl", "droppedUrl", "inCollectionUrl"], function (items) {
        for (let i = 0; i < Object.keys(items).length; i++) {
            if (items[Object.keys(items)[i]]) {
                getListDataFromServer(Object.keys(items)[i], items[Object.keys(items)[i]]);
            }
        }
    });
}
function getListDataFromServer(name, url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.addEventListener("load", function (event) {
        let html = document.createElement("html");
        html.innerHTML = xhr.responseText;
        html = html.querySelector("a[href=\"list.php?id=225948&list_id=218300&sector=animation&sort=4&edit_mode=0\"]").parentElement.parentElement.parentElement;
        let ids = [];
        for (let i = 2; i < html.children.length; i++) {
            let id = html.children[i].children[1].innerHTML;
            id = id.substring(id.indexOf("id=") + 3);
            id = id.substring(0, id.indexOf("\""));
            ids.push(id);
        }
        chrome.storage.local.set({ "lastUpdateStatus": true, "lastUpdateDate": new Date().toLocaleDateString("ru-RU"), [name.replace("Url", "Data")]: ids });
    }, false);
    xhr.addEventListener("error", function (error) {
        chrome.storage.local.set({ "lastUpdateStatus": false });
    }, false);
    xhr.send();
}
