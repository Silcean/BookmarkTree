
# Visual Bookmark Tree

See a beautifull sorted aragement of your Bookmarks on the newtab page

## Features
Complety customizable colors, a search function, and pinnable favorites.

### Change Colors
<img src="docs/color-change.png" alt="Animated picture of color configuration" width="500" >

### Configure Layout
<img src="docs/config.png" alt="Animated picture of layout configuration" width="500" >


## Get this extension
This free Extension can be found on the Extension Stores of the Browsers
### Firefox Add Ons
 <img src="docs/firefoxstore.png" width="150" alt="Firefox Add Ens Logo" >

### Chrome Webstore
<img src="docs/chromestore.png" width="150" alt="Chrome Web Store Logo" >

## Planned Features
New features will be added soon, and I am open to suggestions.

Planned Features:
  - Short Term
    - Rename bookmarks in this view
    - Immediate updates when a new bookmark/folders has been added/deleted/moved
    - Performance improvements on image load on firefox
      - This would be done immediately if they implemented the extension favicon API. 
  - Long Term
    - Drag and drop to sort bookmarks

## Run this Project
Execute `buildScript.sh` and then load the extensions from the `dist` folder in the corresponting browser.

If you make a change execute `buildScript.sh` and reload (In the extension settings, not the newtab page) the extension in your browser.

### Firefox
Visit the URL `about:debugging#/runtime/this-firefox` select `Load Temporary Add-on..` and select the `dist/firefox/manifest.json` file. Congrats the extension is now loaded

### Chrome
Visit the URL `chrome://extensions` and toggle the `Developer mode` switch if it is not turned on already. Click  `Load unpacked` and select the `dist/chrome/` folder. Congrats the extension is now loaded.