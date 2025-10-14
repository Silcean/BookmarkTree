/* #region Initial Variables */
const chromeDefaultFavicon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE40lEQVR4AdRXS0xcVRg+5zJ37pQ3QoFqTNXEjQsTTVypERI3oibGmhFqhQ4WZqQtBRqIYq0JKmpJAaHiDJDhUQItjbqxLNzQRl2YatLUhYnGGDUKtCCdgcLcuTP3eL4m5/Ywj9uhG+OEn//9/d+ce865oJD/+PP/ItD1YU/1BycHLvSeCvwzGBjT/cEpEwIbMeRQs51FzWgF3u3pPTHgD+rl5ffMFBeXPJWbm1ekaZpTURQK0TTNiRhyqEEtejIhYkugq7v3yf6h0XDZzvJ2l8vlzAQQNahFD3qBgVg6SUvgve6TzcWlxReys7Pz5GbGzKge0b+NRPR+ZsabTGYe5P4gY+yGXAcbvcAAFvxUkpIAGnbu2tWvOlQrH4/FQjEj5i3KceYd9nmeaPZ5Wr31r37q8+wb0nJ2fEcpzUk1ABjAAmaqvDVAJLFkRaUlfZQSKmKGrn++++6SsqaG2mG32x0VcaGpyaqEnUoDC5jATswnEcgvzD8P1qIwqhvdB72ePVVVVbqIQc/PzztGJqdbRiZmzjDCnkPMToAJ7MSaLQSwc/HcRJHBv/khb91bwheaP2/llz8WvmIm6eP2y4SRfJGz08DGDLlmC4GCvMIjIolnfv+9ZXuFL+vgxNmn+dBKOZapLc9Aj0UAFwiOD4IQxkhH4rIjDjEJeQb6TgQzMEv0WgRUVfOJIONHraTANS78JK0wLSm2jYA8yyKgadrDAiOqG5dS7XaRJya9TCk9Jwuh9FcrfxtDnmURUFWndY4ZIZfsMBr2Vw831NW4ZeFkRu165Jw8SyKgqqJIczp+FnbGmplzvNbgkvKHMfajSKj8I2yLgAhAUyVraHh8miXJxMza8PjMD/zsT4+ePvsCaoU01O29Qimpp4QuidhNTekmf2G9w+8K/00fv/gSQ0EsAgb/IGArjOUSwh7l36bGjMe/4ETOTU3NWXcAJzHl2F1+H1EdjxCqPO9QHBWFO7JKD9RWd/F99aDANmKGtVISgWjSy0Q0pNOcyEub8VCrnPdUVkYaX3Ffbqyr/rK+1n2Rb+Z15Ckhj0FDDOPWLIuArutXkNyu8KU9Mjs7m2vXx/NOp6ZaBORZFgHD0G89Izu0xBwjRaHN2AOJYdlfDkX2U6pYf0/IsywCx99oPxOJRJLedDJQOjuL0h3pcnNzcxql5ITIYwZmCd8igEA4HBqAthVKwpTSn2Thmzqerue3P5emsxyOApEPrV3/WNjQWwgc62ht39jYWEMinVBCz/ML6CFZXqut+T5V/anAxPuqpr0ocsB+u72tQ/jQWwggEL4efpYfE/6+gXdngmX/JDD2Gd94nQIBmMAWvtBJBI53tn29enW5lb8N+cqKssw0dvvQyGTj738vL8nfHFjABHYiUhIBFBzrPDpwbWGhBazhyxKPx/cM+se+GQwEP/IHJxsDwdOvD/jH+hBbvRFdc6iOgPzMgQEsYMo4wk5JAEk0rFxdqcBzgy+EX6tOzaU9rmmuDkVxBCi/tl0urQUx+aihHr3AABb8VJKWAIqxZC1NB/KXri324PgglomgFj3oBYZdjy0B0Yid2+yr1xYX/6pZWVm+uL6+tspvs6hp8v8KuMBGDDnUoBY9ot9OZ0RAAOACefNoc0XbIe9dh70ezVe/T4HARgw51Ij6TPS2CGQCmFhzO/9fAAAA//8ERAMIAAAABklEQVQDALNmOF8ZtM0WAAAAAElFTkSuQmCC";

function getFaviconChromeExtensionAPI(urlString) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", new URL(urlString));
  url.searchParams.set("size", "32");
  return url.toString();
}

function getFavIconFirefox(urlString) {
  const url = new URL(
    "https://www.faviconextractor.com/favicon/" +
      encodeURIComponent(new URL(urlString).hostname)
  );
  return url.toString();
}

function getFaviconUrl(url) {
  return getFavIconFirefox(url);
  // return getFaviconChromeExtensionAPI(url);
}

function isDefaultChromeImage(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const dataURL = canvas.toDataURL("image/png");
  const isMatch = dataURL == chromeDefaultFavicon;
  return isMatch;
}

function drawTrashCanIcon(id) {
  let imgtrash = document.createElement("img");
  imgtrash.src = trashIcon();
  imgtrash.id = "remove" + id;
  imgtrash.className = "line-hover-icon";
  return imgtrash;
}

function drawBookmarkIcon(url) {
  let img = document.createElement("img");
  img.onload = function () {
    if (isDefaultChromeImage(img)) {
      img.className += " defaultFavImage ";
    }
    if ("naturalHeight" in this) {
      if (this.naturalHeight + this.naturalWidth === 0) {
        this.onerror();
        return;
      }
    } else if (this.width + this.height == 0) {
      this.onerror();
      return;
    }
  };

  img.src = getFaviconUrl(url);
  img.className = "bookmark-line-element-favicon";
  return img;
}

function trashIcon() {
  // <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
  //   <polyline points="3 6 5 6 21 6"></polyline>
  //   <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  //   <line x1="10" y1="11" x2="10" y2="17"></line>
  //   <line x1="14" y1="11" x2="14" y2="17"></line>
  // </svg>

  return "data:image/svg+xml;base64,IDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nNTInIGhlaWdodD0nNTInIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgc3Ryb2tlPSdjdXJyZW50Q29sb3InIHN0cm9rZS13aWR0aD0nMS41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIGNsYXNzPSdmZWF0aGVyIGZlYXRoZXItdHJhc2gtMic+PHBvbHlsaW5lIHBvaW50cz0nMyA2IDUgNiAyMSA2Jz48L3BvbHlsaW5lPjxwYXRoIGQ9J00xOSA2djE0YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0yVjZtMyAwVjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2Mic+PC9wYXRoPjxsaW5lIHgxPScxMCcgeTE9JzExJyB4Mj0nMTAnIHkyPScxNyc+PC9saW5lPjxsaW5lIHgxPScxNCcgeTE9JzExJyB4Mj0nMTQnIHkyPScxNyc+PC9saW5lPjwvc3ZnPg==";
}

function resetIcon() {
  return `<svg class="buttonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  ><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>`;
}
function closeIcon() {
  return `<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="#00000"
          >
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg>`;
}
function colorIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M346-140 100-386q-10-10-15-22t-5-25q0-13 5-25t15-22l230-229-106-106 62-65 400 400q10 10 14.5 22t4.5 25q0 13-4.5 25T686-386L440-140q-10 10-22 15t-25 5q-13 0-25-5t-22-15Zm47-506L179-432h428L393-646Zm399 526q-36 0-61-25.5T706-208q0-27 13.5-51t30.5-47l42-54 44 54q16 23 30 47t14 51q0 37-26 62.5T792-120Z"/></svg>`;
}

function addIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`;
}
