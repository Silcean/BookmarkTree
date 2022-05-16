let options = {
    showToasts: true
};

function sendValues() {
    options.showToasts = document.getElementById('toast').checked;
    chrome.storage.sync.set({ TwitterNFTBlockOptions: options }, function() {
        console.log('LocalStorage set to' + options);
    });
}

function resetBlockcount() {
    chrome.storage.sync.set({ TwitterNFTBlockReset: true }, function() {
        console.log('LocalStorage Reset set to' + options);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('resBlockCnt').addEventListener("click", function() {
        resetBlockcount();
    });
    document.getElementById('toast').addEventListener("click", function() { sendValues(); });
});