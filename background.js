var tree;
var tabsWaitingForTree = [];
var imgDomains = {};

chrome.runtime.onStartup.addListener(function () {
    chrome.storage.sync.clear();
    //chrome.storage.sync.get(
    chrome.storage.local.get(['imgDomains'], function (result) {
        console.log('From LocalStorage:')
        console.log(result);
        if (result != undefined) {
            imgDomains = result;
        }
        console.log();
    });
})

//respondes to request for the bookmark tree from tabs
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log('Message from: ' + sender.tab.id + '  ' + request);
        if (request.message === "wantTreeUwU") {
            if (tree == undefined) {
                //if the tree has not loaded yet, add tab to array
                tabsWaitingForTree.push(sender.tab.id)
                console.log('No tree, added to tabs');
                console.log(tabsWaitingForTree);
                sendResponse({ message: "NoTree" });
                loadTree(1);
            } else {
                //sends tree
                console.log('sent tree')
                sendResponse({ message: tree });
            }
            console.log('End message');
            console.log('');
        } else if (request.deleteBm != undefined) {
            try {
                chrome.bookmarks.remove(request.deleteBm, function () {
                    sendResponse({ deleteBm: 'success' });
                    console.log('deleted' + request.deleteBm);
                    updateTree();
                })
            } catch (error) {

            }
        } else if (request.getFaviconUrl != undefined) {
            //base idea, if i have it not in storage send it back, it will put it in array, end send the full thing through after the side is built
            let result = imgDomains[request.getFaviconUrl[1]];
            if (result === undefined) {
                sendResponse({ getFaviconUrl: 'unable' });
            } else {
                sendResponse({ getFaviconUrl: result });
            }

            //{1,'https://humblebundle.com'}
            //loadImageUrls(request.getFaviconUrl[1], sender.tab.id, request.getFaviconUrl[0])
        } else if (request.getFaviconUrlList != undefined) {
            console.log(imgDomains);
            workImageQueue(sender.tab.id, request.getFaviconUrlList);

        } else if (request.getFaviconUrlDictionary != undefined) {
          sendResponse({getFaviconUrlDictionary: imgDomains});
        } else if(request.getPath != undefined){
            sendResponse({getPath: chrome.runtime.getURL(request.getPath)});
        }


    });


getBaseUrl = (url) => {
    let indexofseconddot = url.substring(url.indexOf('.') + 1, url.length).indexOf('.') + url.indexOf('.') + 1;
    let indexOfFirstSlashAfterSecondDot = url.substring(indexofseconddot, url.length).indexOf('/') + indexofseconddot;
    if (indexOfFirstSlashAfterSecondDot == indexofseconddot - 1) {//could not find slash => already baseurl
        return url;
    }
    return url.substring(0, indexOfFirstSlashAfterSecondDot);
}

workImageQueue = async (tabid, urllist) => {
    console.log('startedworking on queue')
    while (urllist.length > 0) {
        console.log('queuesize: ' + urllist.length);
        let currobj = urllist.pop();   
        let baseurl = sanitizeUrl(getBaseUrl(currobj[1]));
        console.log('start request for:' + baseurl);
        await fetchRequest(baseurl, 0).then(apiresult => {
            if (apiresult === -1 || apiresult === undefined) {
                apiresult = 'nourl';
                console.log('got no image for:' + baseurl);
            } else {
                imgDomains[baseurl] = apiresult;
                console.log('got image to url:' + baseurl);
                saveimgDomains();
            }

            let toSatisfy = urllist.filter(e => {
                return sanitizeUrl(getBaseUrl(e[1])) === baseurl;
            });

            toSatisfy.push(currobj);
            toSatisfy.forEach(e => {
                chrome.tabs.sendMessage(tabid, { sendFaviconUrl: [e[0], apiresult] });
            });
            
            console.log('sent ' + apiresult + 'to '+toSatisfy.length+' bms');
            urllist = urllist.filter(e => {
                return sanitizeUrl(getBaseUrl(e[1])) != baseurl;
            });
            console.log();
        });
    }
};

saveimgDomains = async () => {
    chrome.storage.local.set({ imgDomains: imgDomains }, function () {
        console.log('saved imgdomain succesfully');
    });
}

fetchRequest = async (url, attempt) => {
    await delay(5000);
    return { "domain": "whatsapp.com", "icons": [{ "src": "https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png" }, { "src": "https://www.whatsapp.com/favicon.ico", "type": "image/x-icon" }] }
/*
     if (attempt < 5) {//try five times
         if (attempt != 0) {//wait for 5 seconds, dont want to ddos the api
             await delay(10000);
         }
         attempt++;
         const response = await fetch('https://favicongrabber.com/api/grab/' + url);
         if(response.ok){
             const iconobject = await response.json();
             return iconobject;
         }else{
            await fetchRequest(url, attempt);
         }
     } else {
         //i dont know do nothing   
         console.log('Too Many Attempts Abort');
         console.log();
         return -1;

     }
     */
}


sanitizeUrl = (url) => {
    
    if (url.indexOf('https://') != -1) {//remove https://
        url = url.substring('https://'.length, url.length);
    }

    //TODO remove atelier.zaumstudio.com atelier or other pretexts
    let indexseconddot=url.substring(url.indexOf('.'), url.length).indexOf('.');
    if(indexseconddot!=-1){
        url = url.substring(url.indexOf('.'), url.length);
    }
    /*
    if (url.indexOf('www.') != -1) {//remove www.
        url = url.substring('www.'.length, url.length);
    }*/

    if (url.lastIndexOf('/') === url.length - 1) {//remove / if at end of string
        url = url.substring(0, url.length - 1);
    }

    return url;
}

loadTree = async (firstload) => {
    chrome.bookmarks.getTree((result) => {
        //got tree
        console.log('Loaded Bookmark Tree');
        tree = result;
        if (firstload == 1) {
            console.log(tabsWaitingForTree);
            //go through all saved tabs, which got proto object before
            tabsWaitingForTree.forEach(e => {
                //sends tree
                chrome.tabs.sendMessage(e, { giveTreeUwU: tree });
                console.log('send tree to tab ' + e);
            });
            tabsWaitingForTree = [];//resets tabs
            console.log('end tree distribution');
        }
    });
}

updateTree = async () => {
    tree = undefined;
    await loadTree();
    chrome.tabs.query({ title: 'New Tab' }, (tabs) => {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { updateTree: tree }, function (response) {
                console.log(response.updateTree);
            });
        }
    });
}

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    console.log('bookmark created');
    updateTree();
})

chrome.bookmarks.onMoved.addListener((id, bookmark) => {
    updateTree();
})



function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}