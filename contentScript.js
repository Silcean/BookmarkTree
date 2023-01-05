/* #region Initial Variables */
let options = {
    enableSearch: true
};
chrome.storage.sync.get(['BetterBookmarksOptions'], function(result) {
    if (result.BetterBookmarksOptions != undefined) {
        options = result;
    }
});

let sites = [
    'https://smile.amazon.de',
    // 'https://imgur.com',
    'https://www.youtube.com/feed/subscriptions',
    'https://www.twitter.com',
    'https://www.reddit.com',
    'https://www.twitch.tv/directory/following',
    'https://web.whatsapp.com',
    'https://owa.edvschule-plattling.de/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fowa.edvschule-plattling.de%2fowa%2f',
    'https://www.netflix.com/browse',
    'https://www.humblebundle.com',
    'https://www.photopea.com'
];
let names = ['Amazon', /*'Imgur',*/ 'Youtube', 'Twitter', 'Reddit', 'Twitch', 'Whatsapp', 'Schulmail', 'Netflix', 'Humble Bundle', 'Photopea'];
let iconsPreDictionary = {
    'howlongtobeat': '.png',
    'whatsapp': '.png',
    'photopea': '.png',
    'humblebundle': '.png',
    'webtoons': '.ico',
    'youtube': '.png',
    'twitter': '.svg',
    'edvschule-plattling': '.ico',
    '9cache': '.ico',
    'bluetooth': '.png',

    'catsuka': '.ico',
    'chromeexperiments': '.ico',
    'curseforge': '.png',
    'twimg': '.svg',
    'teardowngame': '.jpg',
    'hackertyper': '.ico'
        /*
        'explosm': '.png',
        'factoryidle': '.png',
        'feastforaking': '.png',
        'fridgegame': '.png',
        'geometrize': '.png',
        'github': '.png',
        'hackertyper': '.png',
        'keychron': '.png',
        'lingojam': '.png',
        'media': '.png',
        'minecraftforum': '.png',
        'minecraftmaps': '.png',
        'mrgarretto': '.png',
        'nomada': '.png',
        'notion': '.png',
        'oldgamesdownload': '.png',
        'polygon': '.png',
        'projectmaldonado': '.png',
        'redd': '.png',
        'sbnation': '.png',
        'scaryforkids': '.png',
        'scpwiki': '.png',
        'seriencamp-watchroom': '.png',
        'strawpoll': '.png',
        'teardowngame': '.png',
        'textlog': '.png',
        'thebookofshaders': '.png',
        'thejimquisition': '.png',
        'thetruesize': '.png',
        'threadless': '.png',
        'townofsilenthill': '.png',
        'twimg': '.png',
        'userinyerface': '.png',
        'zbfs': '.png',
        */
};
//let relpath="chrome-extension://fkiejkbalijkjgcihgedcjpafokknkad/"

let relpath = chrome.runtime.getURL(
    '/'
  );
  console.log('extension path='+relpath)
let trashsrc = relpath + "icons/trash.svg";
let onerrorsrc = relpath + "icons/site.png";
let savedIconPath = relpath + "icons/";
let iconerrors = {};
let head = document.getElementsByTagName('head')[0];
let body = document.getElementsByTagName('body')[0];

let cssnewtab = document.createElement("link");
cssnewtab.rel = "stylesheet";
cssnewtab.href = relpath + "css/newtab.css";
head.appendChild(cssnewtab);
let cssfira_code = document.createElement("link");
cssfira_code.rel = "stylesheet";
cssfira_code.href = relpath + "css/fira_code.css";

head.appendChild(cssfira_code);
body.removeAttribute('bgcolor');
body.removeAttribute('text');
body.removeAttribute('link');
body.innerHTML = "";
let bm = document.createElement("div");
bm.id = "bm";
body.appendChild(bm);


let listdiv = document.createElement("div");
listdiv.id = "ullist"
let list = document.createElement("ul");
list.id = 'list';
listdiv.appendChild(list);
body.appendChild(listdiv);
let searchdiv = document.createElement("div");
searchdiv.id = 'search';
body.appendChild(searchdiv);

let tree;
let currentlyActive = [];
let blacklist = ["Mozilla Firefox"];
let preactivatedlist = ['Bookmarks bar', 'Kategorie'];
let toactivatelist = [];

let onclicklisteners = [];
let imagesWithNoSrc = [];

let sentImagerequests = 0;
let gotimageResponses = 0;

let imagedictionary = {};

/*#endregion*/


//#region Misc Fucntions
/*
encodeImagetoBase64=(url)=>{
    
}

*/
sanitizeUrl = (url) => {
    if (url.indexOf('https://') != -1) { //remove https://
        url = url.substring('https://'.length, url.length);
    } else if (url.indexOf('http://') != -1) {
        //remove http://
        url = url.substring('http://'.length, url.length);
    }


    if (url.lastIndexOf('/') === url.length - 1) { //remove / if at end of string
        url = url.substring(0, url.length - 1);
    }

    url = getBaseUrl(url);


    //TODO remove atelier.zaumstudio.com atelier or other pretexts
    let indexseconddot = url.substring(url.indexOf('.') + 1, url.length).indexOf('.');
    if (indexseconddot != -1) {
        url = url.substring(url.indexOf('.') + 1, url.length);
    }
    /*
    if (url.indexOf('www.') != -1) {//remove www.
        url = url.substring('www.'.length, url.length);
    }*/


    return url;
}

faviconurl = (url) => {
    url = sanitizeUrl(url);
    let name = url.substring(0, url.indexOf('.'));
    if (iconsPreDictionary[name]) {
        return savedIconPath + name + iconsPreDictionary[name];
    }
    return 'https://' + url + '/favicon.ico';
}

getBaseUrl = (url) => {
    if (url.indexOf('/') != -1) {
        url = url.substring(0, url.indexOf('/'));
    }
    return url;
    /*
    let indexofseconddot = url.substring(url.indexOf('.') + 1, url.length).indexOf('.') + url.indexOf('.') + 1;
    let indexOfFirstSlashAfterSecondDot = url.substring(indexofseconddot, url.length).indexOf('/') + indexofseconddot;
    if (indexOfFirstSlashAfterSecondDot == indexofseconddot - 1) {//could not find slash => already baseurl
        return url;
    }
    return url.substring(0, indexOfFirstSlashAfterSecondDot);
    */
}

function getBaseFaviconUrl() {
    const faviconUrl = new URL("chrome://favicon2/");
    faviconUrl.searchParams.set("size", "16");
    return faviconUrl
}

function getFaviconForPageURL(url, isSyncedUrlForHistoryUi, remoteIconUrlForUma = "", size = 16) {
    const faviconUrl = getBaseFaviconUrl();
    faviconUrl.searchParams.set("size", size);
    faviconUrl.searchParams.set("page_url", url);
    return faviconUrl.toString()
}

removeBm = (trashid) => {
    let bmid = trashid.substring(('remove').length, trashid.length);
    console.log(bmid);
    try {
        let id = document.getElementById(bmid);
        id.style.display = 'none';
    } catch (error) {

    }
    chrome.runtime.sendMessage({ deleteBm: bmid });

}

removeFromActiveArray = (element) => {
    let filtered = currentlyActive.filter(function(value) {
        return value[0] !== element[0] && value[1] !== element[1];
    })
    currentlyActive = filtered;
}

//#endregion


//#region Drawing Tree
drawTree = () => {
    let depth = 0;
    let thumbnaildiv = document.createElement("div");
    thumbnaildiv.className = 'thumbnailcontainer';
    let displaydiv = document.createElement("div");
    displaydiv.className = 'displaycontainer';
    let bmdiv = document.createElement("div");
    bmdiv.className = 'bmcontainer';
    bm.innerHTML = '';
    bm.appendChild(thumbnaildiv);
    bm.appendChild(displaydiv);
    bm.appendChild(bmdiv);
    // drawUlWithChildDetails(tree, bmdiv);
    recursiveDrawObj(tree, thumbnaildiv, displaydiv, bmdiv, depth);

    //preactivates a few things.
    toactivatelist.forEach(e => {
        toggleFolderbyClassIntoDisplaydiv(document.getElementById(e));
    });
    console.log(iconerrors);
}

toggleFolderbyClassIntoDisplaydiv = (sender) => {
    console.log('Click on Folder: ' + sender.id);
    let objectsfolder = document.getElementById('folder' + sender.id + 'content');
    let classes = objectsfolder.className.split(' ');
    if (classes.indexOf('active') != -1) {
        //isopen=> set to collapse
        objectsfolder.classList.remove('active');
        sender.classList.remove('active');
        removeFromActiveArray([classes[1], sender.id]);
    } else {
        //iscollapes => set to open
        //see if other thumbnail in same region is open
        let elementActiveInSameDisplayContainer = currentlyActive.find(elem => elem[0] === classes[1]);
        if (elementActiveInSameDisplayContainer != undefined) { // one is open

            //remove display
            let activediv = document.getElementById('folder' + elementActiveInSameDisplayContainer[1] + 'content');
            activediv.classList.remove('active');
            //remove active status from thumbnail

            let activethumbnail = document.getElementById(elementActiveInSameDisplayContainer[1]);
            activethumbnail.classList.remove('active');
            //remove from list of currently active thumbnails
            removeFromActiveArray(elementActiveInSameDisplayContainer);
        };
        currentlyActive.push([classes[1], sender.id]);
        objectsfolder.classList.add('active');
        sender.classList.add('active');
    }
}

recursiveDrawObj = (obj, thumbnaildiv, displaydiv, bmdiv, depth) => {
    if (blacklist.indexOf(obj.title) != -1) {
        return;
    }
    if (obj.title == "" && obj.children) {
        obj.children.forEach(e => {
            recursiveDrawObj(e, thumbnaildiv, displaydiv, bmdiv, depth);
        });
    } else {
        if (obj != null && obj.url != undefined) { // is bookmark
            drawBM(obj, bmdiv, depth);
        } else if (obj != null && obj.id != undefined) { //is folder
            depth++;
            if(obj.children.length!=0){//do not draw empty folders

                drawFolder(obj, thumbnaildiv, displaydiv, depth);
            }
        }
    }
}


drawFolder = (obj, superthumbnaildiv, superdisplaydiv, depth) => {
    /*
    div structure:
    <div class="folder">
        <div id=obj.id >Foldertitle</div>
        <div class='contentdiv>
            <div class='line'></div>
            <div class='content'>
                <div class='thumbnailcontainer'>//only contains clickable divs, no actual content
                    <div id=1 class="thumbnail">
                    <div id=2 class="thumbnail">
                    <div id=3 class="thumbnail">
                    <div id=4 class="thumbnail">
                </div>
                <div classname='displaycontainer' id=obj.id'+displaycontainer'>//holds all the actual content, only ona at time set visible
                    <div id=displaycontent1 ></div>
                    <div id=displaycontent2 ></div>
                    <div id=displaycontent3 ></div>
                    <div id=displaycontent4 ></div>
                </div>
                <div class='bmcontainer'>
                bms
                </div>
            </div>
            <div class='line'></div>
        </div>
    </div>
    */


    var thumbnail = document.createElement("div");
    thumbnail.id = obj.id;
    thumbnail.onclick = function(e) {
        toggleFolderbyClassIntoDisplaydiv(e.target);
    };
    //folder title
    thumbnail.innerHTML = obj.title;
    thumbnail.className = 'thumbnail';
    superthumbnaildiv.appendChild(thumbnail);

    onclicklisteners.push(thumbnail.id);
    //containerdiv, is unique to every folder
    let contentcontainer = document.createElement("div");
    contentcontainer.id = 'folder' + obj.id + 'content';
    contentcontainer.className = 'contentcontainer indisplayfolder' + superdisplaydiv.id + ' depth' + depth;

    //dividing lines
    let divline = document.createElement("div");
    divline.classList.add('line');
    let divline2 = document.createElement("div");
    divline2.classList.add('line');

    //contentdiv
    let content = document.createElement("div");
    content.classList.add('content');

    contentcontainer.appendChild(divline);
    contentcontainer.appendChild(content);
    contentcontainer.appendChild(divline2);

    //extra div for all the thumbnails
    //cause css cannot handle it elsewise
    let thumbnaildiv = document.createElement("div");
    thumbnaildiv.className = 'thumbnailcontainer';
    content.appendChild(thumbnaildiv);

    //displaycontainer. holds the actual content the thumbnails link to
    let displaydiv = document.createElement("div");
    displaydiv.className = 'displaycontainer';
    displaydiv.id = obj.id + 'displaycontainer';
    content.appendChild(displaydiv);

    //extra div for all the bookmarks
    //cause css cannot handle it elsewise
    let bmdiv = document.createElement("div");
    bmdiv.className = 'bmcontainer';
    content.appendChild(bmdiv);
    //add children
    obj.children.forEach(e => {
        recursiveDrawObj(e, thumbnaildiv, displaydiv, bmdiv, depth);
    });
    superdisplaydiv.appendChild(contentcontainer);
    if (preactivatedlist.indexOf(obj.title) != -1) {
        toactivatelist.push(obj.id);
    }
    depth++;
}

drawBM = (obj, bmcontainerdiv, depth) => {
        var bmdiv = document.createElement("div");
        bmdiv.className = 'tile linktobm' + obj.id + ' depth' + depth;
        bmdiv.id = obj.id;

        var titlespan = document.createElement('span');
        titlespan.innerHTML += obj.title;

        let img = document.createElement("img");

        img.onload =
            function() {
                if ('naturalHeight' in this) {
                    if (this.naturalHeight + this.naturalWidth === 0) {
                        this.onerror();
                        return;
                    }
                } else if (this.width + this.height == 0) {
                    this.onerror();
                    return;
                }
            };
        img.src = faviconurl(obj.url);
        // img.src= getFaviconForPageURL(obj.url,false);


        //img.src=getBaseUrl(obj.url) + '/favicon.ico';
        img.onerror = function() {
            iconerrors[sanitizeUrl(this.currentSrc.substring(0, this.currentSrc.indexOf('.')))] = '.png';

            img.src = onerrorsrc;
        }
        img.className = 'icon';

        let a = document.createElement("a");
        a.href = obj.url;

        let imgtrash = document.createElement("img");
        //imgtrash.src = './icons/trash-2.svg';
        imgtrash.src = trashsrc;
        imgtrash.id = 'remove' + obj.id;
        imgtrash.className = 'delicon';

        imgtrash.onclick = function(e) {
            removeBm(e.target.id);
        };
        onclicklisteners.push(imgtrash.id);
        /*
        let shorturl = sanitizeUrl(getBaseUrl(obj.url));
        //TODO Refactor, so sendmessage is in extra method
        if (imagedictionary!=undefined&&imagedictionary[shorturl] != undefined) {
            img.url = imagedictionary[shorturl];
        } else {
            sentImagerequests++;
            chrome.runtime.sendMessage({ getFaviconUrl: [obj.id, obj.url] }, (response) => {
                gotimageResponses++;
                if (response.getFaviconUrl != 'unable') {
                    img.src = response.getFaviconUrl[1];
                } else {
                    imagesWithNoSrc.push([obj.id, obj.url]);
                }
                if (sentImagerequests === gotimageResponses) {
                    sentImagerequests = 0;
                    gotimageResponses = 0;
                    chrome.runtime.sendMessage({ getFaviconUrlList: imagesWithNoSrc }, (response) => {
                    });
                }
            });
 
        }
    */
        a.appendChild(img);
        a.appendChild(titlespan); //write name
        bmdiv.appendChild(a);
        bmdiv.appendChild(imgtrash);
        bmcontainerdiv.appendChild(bmdiv);
    }
    //#endregion


//#region Messages, and Listeners
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        //console.log('got message');
        if (request.giveTreeUwU != undefined) {
            tree = request.giveTreeUwU[0];
            console.log('tree from startupevent:');
            console.log(tree);
            drawTree();
        } else if (request.favicon != undefined) {
            let linkdiv = document.getElementById('linktobm' + request.favicon[0]);
            linkdiv.appendChild(favicon[1]);
        } else if (request.updateTree != undefined) {
            sendResponse({ updateTree: 'reveived' });
            /*
            tree = request.updateTree;
            console.log('treeupdated');
            onclicklisteners.forEach(e => {
                let element=document.getElementById(e);
                element.onclick=null;
            });
            drawTree();
            */
        } else if (request.sendFaviconUrl != undefined) {
            if (request.sendFaviconUrl[1] != 'nourl') {
                let div = document.getElementById(request.sendFaviconUrl[0]);
                try {
                    if (request.sendFaviconUrl[1].icons.length > 0) {
                        let url = request.sendFaviconUrl[1].icons[0].src;
                        console.log(request.sendFaviconUrl[0]);
                        div.childNodes[0].childNodes[0].src = url;
                    } else {
                        console.log('no icon in website found');
                    }

                } catch (error) {
                    console.log('error in new imgsrc:');
                    console.log(error);
                    console.log(div);
                    console.log(request.sendFaviconUrl);
                }
            }

        }
    });

chrome.runtime.sendMessage({ message: "wantTreeUwU" }, (response) => {
    if (response.message != "NoTree") {
        tree = response.message[0];
        console.log('tree from tabload:');
        console.log(tree);
        drawTree();
    } else {
        console.log('no tree from tabload');
    }
});
/*
chrome.runtime.sendMessage({ getFaviconUrlDictionary: "blbl" }, (response) => {
    imagedictionary = response.message;
});
*/
//#endregion

//favorites list
for (let i = 0; i < sites.length; i++) {
    list.innerHTML += '<li>' + '<a href="' + sites[i] + '" >' +
        '<div class=imgtile ><img  src="' + faviconurl(sites[i]) + '" ></div>  ' +
        names[i] + '</a></li>';
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
        if (changes.BetterBookmarksOptions != undefined) {
            options = changes.BetterBookmarksOptions.newValue;
            if (options.enableSearch) {
                searchdiv.style.display = 'inline-block';
            } else {
                searchdiv.style.display = 'none';
            }
        }

    }
})

if (options.enableSearch) {
    createElement = (type, id, classlist, parent) => {
        let element = document.createElement(type);
        if (id) {
            element.id = id;
        }
        element.classList = classlist;
        parent.appendChild(element);
        return element;
    }

    //searchbar
    search = () => {
        clear();
        term = searchinput.value.trim()
        if (term != '') {
            searchrecurse(tree, term);
        }
    }
    clear = () => {
        resultlist.innerHTML = '';
    }

    clickPress = (event) => {
        if (event.keyCode == 13) {
            search();
        }
    }
    searchrecurse = async(node, term) => {
        if (node != null && node.url != undefined) {
            // is bookmark
            //todo rate accuraacy of result for sorting
            if (node.title.toLowerCase().includes(term.toLowerCase())) {
                drawBMResult(node, resultlist);
            }
        } else if (node != null && node.id != undefined) {
            //is folder
            if (blacklist.indexOf(node.title) == -1) {
                node.children.forEach(e => {
                    searchrecurse(e, term);
                });
            }
        }

    }


    drawBMResult = (obj, bmcontainerdiv) => {
            var bmdiv = document.createElement("li");
            bmdiv.className = 'tile linktobm' + obj.id;

            var titlespan = document.createElement('span');
            titlespan.innerHTML += obj.title;

            let img = document.createElement("img");

            img.onload =
                function() {
                    if ('naturalHeight' in this) {
                        if (this.naturalHeight + this.naturalWidth === 0) {
                            this.onerror();
                            return;
                        }
                    } else if (this.width + this.height == 0) {
                        this.onerror();
                        return;
                    }
                };
            img.src = faviconurl(obj.url);
            // img.src= getFaviconForPageURL(obj.url,false);


            //img.src=getBaseUrl(obj.url) + '/favicon.ico';
            img.onerror = function() {
                iconerrors[sanitizeUrl(this.currentSrc.substring(0, this.currentSrc.indexOf('.')))] = '.png';

                img.src = onerrorsrc;
            }
            img.className = 'icon';

            let a = document.createElement("a");
            a.href = obj.url;

            a.appendChild(img);
            a.appendChild(titlespan); //write name
            bmdiv.appendChild(a);
            bmcontainerdiv.appendChild(bmdiv);
        }
        //#endregion 
    let searchbar = createElement('div', '', '', searchdiv);
    let searchinput = createElement('input', "searchinput", '', searchbar);
    let searchbutton = createElement('button', "searchbutton", '', searchbar);
    let searchicon = createElement('img', '', '', searchbutton);
    searchicon.src = relpath + "materialIcons/search.png"
    searchbutton.onclick = search;
    searchinput.onkeypress = clickPress;
    let clearbutton = createElement('button', "clearbutton", '', searchbar);
    let clearicon = createElement('img', "icon", '', clearbutton);
    clearicon.src = relpath + "materialIcons/close.png"
    clearbutton.onclick = clear;
    let resultlist = createElement('ul', "resultlist", '', searchdiv);
}