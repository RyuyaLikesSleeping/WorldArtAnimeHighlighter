document.addEventListener("DOMContentLoaded", function (event) {
    chrome.storage.sync.get(["wantSeeUrl", "seeUrl", "seenUrl", "droppedUrl", "inCollectionUrl"], function (items) {
        for (let i = 0; i < Object.keys(items).length; i++) {
            if (items[Object.keys(items)[i]]) {
                document.getElementById(Object.keys(items)[i]).value = items[Object.keys(items)[i]];
            }
        }
    });
    chrome.storage.local.get(["extensionEnabled", "lastUpdateDate"], function (items) {
        document.querySelector("#extensionEnabled [value=" + items["extensionEnabled"] + "]").selected = true;
        document.getElementById("lastUpdateDate").innerText = items["lastUpdateDate"] ? items["lastUpdateDate"] : "никогда";
    });
    document.getElementById("saveOrUpdateListsUrl").addEventListener("click", function (event) {
        let select = document.getElementById("extensionEnabled");
        chrome.storage.local.set({ "extensionEnabled": select.options[select.selectedIndex].value == "true" ? true : false });
        let lists = document.querySelectorAll("input[id$=\"Url\"]");
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].value) {
                chrome.storage.sync.set({ [lists[i].id]: lists[i].value }, function () {
                    chrome.runtime.getBackgroundPage(function (background) {
                        background.getListDataFromServer(lists[i].id, lists[i].value);
                    });
                });
            }
            else {
                chrome.storage.sync.get(lists[i].id, function (items) {
                    if (items[lists[i].id]) {
                        chrome.storage.local.set({ [lists[i].id.replace("Url", "Data")]: [] }, function () { });
                    }
                });
                chrome.storage.sync.set({ [lists[i].id]: lists[i].value });
            }
        }
        chrome.storage.local.get("lastUpdateDate", function (items) {
            document.getElementById("lastUpdateDate").innerText = items["lastUpdateDate"];
        });
        document.getElementById("status").style.visibility = "visible";
        setTimeout(function (...args) {
            document.getElementById("status").style.visibility = "hidden";
        }, 3000);
    }, false);
}, false);
