let options = {
    enableSearch: true,
    favorites: [],
    blacklist: []
};

function sendValues() {
    options.enableSearch = document.getElementById('toast').checked;
    chrome.storage.sync.set({ BetterBookmarksOptions: options }, function() {
        console.log('LocalStorage set to' + options);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['BetterBookmarksOptions'], function(result) {

        if (result.BetterBookmarksOptions != undefined) {
            options = result;
        }
    });
    document.getElementById('toast').addEventListener("click", function() { sendValues(); });
});