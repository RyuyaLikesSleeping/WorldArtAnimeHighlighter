document.addEventListener("DOMContentLoaded", function (event: Event): void
{
    chrome.storage.sync.get(["wantSeeUrl", "seeUrl", "seenUrl", "droppedUrl", "inCollectionUrl"], function (items: { [key: string]: any; }): void
    {
        for (let i: number = 0; i < Object.keys(items).length; i++)
        {
            if (items[Object.keys(items)[i]])
            {
                (<HTMLInputElement>document.getElementById(Object.keys(items)[i])).value = items[Object.keys(items)[i]]
            }
        }
    });

    chrome.storage.local.get(["extensionEnabled", "lastUpdateDate"], function (items: { [key: string]: any; }): void
    {
        (<HTMLOptionElement>document.querySelector("#extensionEnabled [value=" + items["extensionEnabled"] + "]")).selected = true;
        document.getElementById("lastUpdateDate").innerText = items["lastUpdateDate"] ? items["lastUpdateDate"] : "никогда";
    });

    document.getElementById("saveOrUpdateListsUrl").addEventListener("click", function (event: MouseEvent): void
    {
        let select: HTMLSelectElement = (<HTMLSelectElement>document.getElementById("extensionEnabled"));

        chrome.storage.local.set({ "extensionEnabled": select.options[select.selectedIndex].value == "true" ? true : false });

        let lists: NodeListOf<HTMLInputElement> = (<NodeListOf<HTMLInputElement>>document.querySelectorAll("input[id$=\"Url\"]"));

        for (let i: number = 0; i < lists.length; i++)
        {
            if (lists[i].value)
            {
                chrome.storage.sync.set({ [lists[i].id]: lists[i].value }, function (): void
                {
                    chrome.runtime.getBackgroundPage(function (background: any): void
                    {
                        background.getListDataFromServer(lists[i].id, lists[i].value);
                    });
                });
            }
            else
            {               
                chrome.storage.sync.get(lists[i].id, function (items: { [key: string]: any; }): void
                {
                    if (items[lists[i].id])
                    {
                        chrome.storage.local.set({ [lists[i].id.replace("Url", "Data")]: [] }, function (): void { });
                    }
                });

                chrome.storage.sync.set({ [lists[i].id]: lists[i].value });
            }
        }

        chrome.storage.local.get("lastUpdateDate", function (items: { [key: string]: any; }): void
        {
            document.getElementById("lastUpdateDate").innerText = items["lastUpdateDate"];
        });

        document.getElementById("status").style.visibility = "visible";

        setTimeout(function (...args: any[]): void
        {
            document.getElementById("status").style.visibility = "hidden";
        }, 3000);
    }, false);
}, false);
