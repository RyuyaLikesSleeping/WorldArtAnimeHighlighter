/*
 * extensionEnabled = true -- local
 * lastUpdateStatus = false -- local
 * lastUpdateDate = "01.02.2017" -- local
 * wantSeeUrl = "http://www.world-art.ru/account/list.php?id=123&list_id=321&sector=animation" -- sync
 * seeUrl = "http://www.world-art.ru/account/list.php?id=123&list_id=321&sector=animation" -- sync
 * seenUrl = "http://www.world-art.ru/account/list.php?id=123&list_id=321&sector=animation" -- sync
 * droppedUrl = "http://www.world-art.ru/account/list.php?id=123&list_id=321&sector=animation" -- sync
 * inCollectionUrl = "http://www.world-art.ru/account/list.php?id=123&list_id=321&sector=animation" -- sync
 * wantSeeData = ["123", "321", "213"] -- local
 * seeData = ["123", "321", "213"] -- local
 * seenData = ["123", "321", "213"] -- local
 * droppedData = ["123", "321", "213"] -- local
 * inCollectionData = ["123", "321", "213"] -- local
*/

chrome.runtime.onInstalled.addListener(function (details: chrome.runtime.InstalledDetails): void
{
    if (details.reason == "install")
    {
        chrome.storage.sync.get(["wantSeeUrl", "seeUrl", "seenUrl", "droppedUrl", "inCollectionUrl"], function (items: { [key: string]: any; }): void
        {
            for (let i: number = 0; i < Object.keys(items).length; i++)
            {
                if (!items[Object.keys(items)[i]])
                {
                    chrome.storage.sync.set({ [Object.keys(items)[i]]: "" });
                }
            }
        });

        chrome.storage.local.set({ "extensionEnabled": true, "lastUpdateStatus": false, "lastUpdateDate": "", "wantSeeData": [], "seeData": [], "seenData": [], "droppedData": [], "inCollectionData": [] });
    }
});

chrome.runtime.onStartup.addListener(function (): void
{
    chrome.storage.local.get(["extensionEnabled", "lastUpdateStatus", "lastUpdateDate"], function (items: { [key: string]: any; }): void
    {
        if (items["extensionEnabled"])
        {
            if (!items["lastUpdateStatus"] || items["lastUpdateStatus"] != new Date().toLocaleDateString("ru-RU"))
            {
                updateAllLists();
            }
        }
    });
});

function updateAllLists(): void
{
    chrome.storage.sync.get(["wantSeeUrl", "seeUrl", "seenUrl", "droppedUrl", "inCollectionUrl"], function (items: { [key: string]: any; }): void
    {
        for (let i: number = 0; i < Object.keys(items).length; i++)
        {
            if (items[Object.keys(items)[i]])
            {
                getListDataFromServer(Object.keys(items)[i], items[Object.keys(items)[i]]);
            }
        }
    });
}

function getListDataFromServer(name: string, url: string): void
{
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.addEventListener("load", function (event: Event): void
    {
        let html: Element = document.createElement("html");
        html.innerHTML = xhr.responseText;
        html = html.querySelector("a[href=\"list.php?id=225948&list_id=218300&sector=animation&sort=4&edit_mode=0\"]").parentElement.parentElement.parentElement;

        let ids: string[] = [];

        for (let i: number = 2; i < html.children.length; i++)
        {
            let id: string = html.children[i].children[1].innerHTML;
            id = id.substring(id.indexOf("id=") + 3);
            id = id.substring(0, id.indexOf("\""));

            ids.push(id);
        }

        chrome.storage.local.set({ "lastUpdateStatus": true, "lastUpdateDate": new Date().toLocaleDateString("ru-RU"), [name.replace("Url", "Data")]: ids });
    }, false);

    xhr.addEventListener("error", function (error: ErrorEvent): void
    {
        chrome.storage.local.set({ "lastUpdateStatus": false });
    }, false);

    xhr.send();
}
