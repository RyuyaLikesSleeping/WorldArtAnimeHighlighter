chrome.storage.local.get(["extensionEnabled", "wantSeeData", "seeData", "seenData", "droppedData", "inCollectionData"], function (items) {
    if (items["extensionEnabled"]) {
        let links = document.querySelectorAll("a[href*=\"animation.php\"]");
        for (let i = 0; i < links.length; i++) {
            if (links[i].search.split("&").length == 1 && !links[i].innerText.includes("->") && !links[i].innerText.includes("<-")) {
                if (items["wantSeeData"].includes(links[i].search.split("&")[0].split("=")[1])) {
                    links[i].classList.add("WorldArtAnimeHighlighter-wantSee");
                }
                else if (items["seeData"].includes(links[i].search.split("&")[0].split("=")[1])) {
                    links[i].classList.add("WorldArtAnimeHighlighter-see");
                }
                else if (items["seenData"].includes(links[i].search.split("&")[0].split("=")[1])) {
                    links[i].classList.add("WorldArtAnimeHighlighter-seen");
                }
                else if (items["droppedData"].includes(links[i].search.split("&")[0].split("=")[1])) {
                    links[i].classList.add("WorldArtAnimeHighlighter-dropped");
                }
                else if (items["inCollectionData"].includes(links[i].search.split("&")[0].split("=")[1])) {
                    links[i].classList.add("WorldArtAnimeHighlighter-inCollection");
                }
            }
        }
    }
});
