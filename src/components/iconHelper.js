/* #region Initial Variables */
const chromeDefaultFavicon =
  // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE40lEQVR4AdRXS0xcVRg+5zJ37pQ3QoFqTNXEjQsTTVypERI3oibGmhFqhQ4WZqQtBRqIYq0JKmpJAaHiDJDhUQItjbqxLNzQRl2YatLUhYnGGDUKtCCdgcLcuTP3eL4m5/Ywj9uhG+OEn//9/d+ce865oJD/+PP/ItD1YU/1BycHLvSeCvwzGBjT/cEpEwIbMeRQs51FzWgF3u3pPTHgD+rl5ffMFBeXPJWbm1ekaZpTURQK0TTNiRhyqEEtejIhYkugq7v3yf6h0XDZzvJ2l8vlzAQQNahFD3qBgVg6SUvgve6TzcWlxReys7Pz5GbGzKge0b+NRPR+ZsabTGYe5P4gY+yGXAcbvcAAFvxUkpIAGnbu2tWvOlQrH4/FQjEj5i3KceYd9nmeaPZ5Wr31r37q8+wb0nJ2fEcpzUk1ABjAAmaqvDVAJLFkRaUlfZQSKmKGrn++++6SsqaG2mG32x0VcaGpyaqEnUoDC5jATswnEcgvzD8P1qIwqhvdB72ePVVVVbqIQc/PzztGJqdbRiZmzjDCnkPMToAJ7MSaLQSwc/HcRJHBv/khb91bwheaP2/llz8WvmIm6eP2y4SRfJGz08DGDLlmC4GCvMIjIolnfv+9ZXuFL+vgxNmn+dBKOZapLc9Aj0UAFwiOD4IQxkhH4rIjDjEJeQb6TgQzMEv0WgRUVfOJIONHraTANS78JK0wLSm2jYA8yyKgadrDAiOqG5dS7XaRJya9TCk9Jwuh9FcrfxtDnmURUFWndY4ZIZfsMBr2Vw831NW4ZeFkRu165Jw8SyKgqqJIczp+FnbGmplzvNbgkvKHMfajSKj8I2yLgAhAUyVraHh8miXJxMza8PjMD/zsT4+ePvsCaoU01O29Qimpp4QuidhNTekmf2G9w+8K/00fv/gSQ0EsAgb/IGArjOUSwh7l36bGjMe/4ETOTU3NWXcAJzHl2F1+H1EdjxCqPO9QHBWFO7JKD9RWd/F99aDANmKGtVISgWjSy0Q0pNOcyEub8VCrnPdUVkYaX3Ffbqyr/rK+1n2Rb+Z15Ckhj0FDDOPWLIuArutXkNyu8KU9Mjs7m2vXx/NOp6ZaBORZFgHD0G89Izu0xBwjRaHN2AOJYdlfDkX2U6pYf0/IsywCx99oPxOJRJLedDJQOjuL0h3pcnNzcxql5ITIYwZmCd8igEA4HBqAthVKwpTSn2Thmzqerue3P5emsxyOApEPrV3/WNjQWwgc62ht39jYWEMinVBCz/ML6CFZXqut+T5V/anAxPuqpr0ocsB+u72tQ/jQWwggEL4efpYfE/6+gXdngmX/JDD2Gd94nQIBmMAWvtBJBI53tn29enW5lb8N+cqKssw0dvvQyGTj738vL8nfHFjABHYiUhIBFBzrPDpwbWGhBazhyxKPx/cM+se+GQwEP/IHJxsDwdOvD/jH+hBbvRFdc6iOgPzMgQEsYMo4wk5JAEk0rFxdqcBzgy+EX6tOzaU9rmmuDkVxBCi/tl0urQUx+aihHr3AABb8VJKWAIqxZC1NB/KXri324PgglomgFj3oBYZdjy0B0Yid2+yr1xYX/6pZWVm+uL6+tspvs6hp8v8KuMBGDDnUoBY9ot9OZ0RAAOACefNoc0XbIe9dh70ezVe/T4HARgw51Ij6TPS2CGQCmFhzO/9fAAAA//8ERAMIAAAABklEQVQDALNmOF8ZtM0WAAAAAElFTkSuQmCC";
  "data:image/bmp;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA0lBMVEUAAACCiIuPlJmHjZKCho6QlpySmJ6TmZ+Eho2VnKGYnqSDi46TmJ+Zn6SSmJ+Zn6aVmZ+2traqqqqWm6OXnKKboaeboaeboaeZnqOaoaaYn6SUmaGqqqqboaa/v7+ao6j///+TmJ+Zn6WboKiboqeboKiboaeaoaeboqiaoaadoKiZn6WaoaeaoKeboaeco6mboaaboKeaoaecoqiYnaSboaekpLafv7+apaqaoaieoqqaoKaboaeaoaaeoqeEio+boqadoqeYnqSTmZ6ZnqOaoKZY7AimAAAARXRSTlMAWO7APfL5+W79/orE+Y/+rQcGZvDWqqZp8WqFDC4EWwKS9I+WZqXceL5G0vPNqFBc6PZ+/qsOCDBMP/p/7jeLcDT5iWZ0yHdHAAABHklEQVR42qzSBXLkMABE0TYze3hmecPMzH3/K8W2SoqpOK/YIPz4VpqhO77v6IaGMYFNxQ7QZ1rssEx0uB4rURjPl7//sOa5nfcJybLIUflJIWl9YXok0wyNLQr0TEgWyRVqP16OFpQstX6SKWq/dtkWQLDJUoy/xw4bDY1kgcZfdmmoGWSUo/GPXQZqOhlC+D+tbFPRUXPIGC07VBzUfHKOls09G/ukLz8QDg5nx6icnJI8O1+SF3KKL5dXAK5vbu/WiOUUOtseIIVykQbbHtcQ8khuU2PHBkKhDgo2257QyErShvBMCotJ5RWNVFyWYFGYQVmRtDrBdD7I0m4wIjn1QV6U3eRUtG/h+8c8DqNhtJ8jmOwxMw6hrEdNAADzYWX7dx2hpwAAAABJRU5ErkJggg==";
const googleDefautlFavicon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACiElEQVQ4EaVTzU8TURCf2tJuS7tQtlRb6UKBIkQwkRRSEzkQgyEc6lkOKgcOph78Y+CgjXjDs2i44FXY9AMTlQRUELZapVlouy3d7kKtb0Zr0MSLTvL2zb75eL838xtTvV6H/xELBptMJojeXLCXyobnyog4YhzXYvmCFi6qVSfaeRdXdrfaU1areV5KykmX06rcvzumjY/1ggkR3Jh+bNf1mr8v1D5bLuvR3qDgFbvbBJYIrE1mCIoCrKxsHuzK+Rzvsi29+6DEbTZz9unijEYI8ObBgXOzlcrx9OAlXyDYKUCzwwrDQx1wVDGg089Dt+gR3mxmhcUnaWeoxwMbm/vzDFzmDEKMMNhquRqduT1KwXiGt0vre6iSeAUHNDE0d26NBtAXY9BACQyjFusKuL2Ry+IPb/Y9ZglwuVscdHaknUChqLF/O4jn3V5dP4mhgRJgwSYm+gV0Oi3XrvYB30yvhGa7BS70eGFHPoTJyQHhMK+F0ZesRVVznvXw5Ixv7/C10moEo6OZXbWvlFAF9FVZDOqEABUMRIkMd8GnLwVWg9/RkJF9sA4oDfYQAuzzjqzwvnaRUFxn/X2ZlmGLXAE7AL52B4xHgqAUqrC1nSNuoJkQtLkdqReszz/9aRvq90NOKdOS1nch8TpL555WDp49f3uAMXhACRjD5j4ykuCtf5PP7Fm1b0DIsl/VHGezzP1KwOiZQobFF9YyjSRYQETRENSlVzI8iK9mWlzckpSSCQHVALmN9Az1euDho9Xo8vKGd2rqooA8yBcrwHgCqYR0kMkWci08t/R+W4ljDCanWTg9TJGwGNaNk3vYZ7VUdeKsYJGFNkfSzjXNrSX20s4/h6kB81/271ghG17l+rPTAAAAAElFTkSuQmCC";
function getFaviconChromeExtensionAPI(urlString) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", new URL(urlString));
  url.searchParams.set("size", "32");
  return url.toString();
}
function getFaviconUrl(url) {
  if (typeof browser !== "undefined") {
    return getFavIconFirefox(url);
  } else if (typeof chrome !== "undefined") {
    return getFaviconChromeExtensionAPI(url);
  } else {
    return getFavIconFirefox(url);
  }
}

function getDefaultCompareString() {
  if (typeof browser !== "undefined") {
    return googleDefautlFavicon;
  } else if (typeof chrome !== "undefined") {
    return chromeDefaultFavicon;
  } else {
    return googleDefautlFavicon;
  }
}
function getFavIconFirefox(urlString) {
  if (urlString == "") return getDefaultCompareString();
  // const url = new URL(
  //   "https://www.faviconextractor.com/favicon/" +
  //     encodeURIComponent(new URL(urlString).hostname)
  // );
  // const url = new URL(
  //   `https://icons.duckduckgo.com/ip3/` +
  //     encodeURIComponent(new URL(urlString).hostname)
  // );
  // const url = new URL(
  //   `https://icon.horse/icon/` + encodeURIComponent(new URL(urlString).hostname)
  // );
  const baseurl = new URL(urlString).origin;
  const url = new URL(
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      baseurl
    )}&sz=128`
  );

  return url.toString();
}

function drawBookmarkIcon(url) {
  let img = document.createElement("img");
  img.src = getFaviconUrl(url);
  img.className = "bookmark-line-element-favicon favicon-border-radius";
  return img;
}

function drawFallbackIcon() {
  let img = document.createElement("div");
  img.className = "bookmark-line-element-favicon favicon-border-radius ";
  img.innerHTML=iconFallback();
  return img;
}
function trashIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M308-140q-37 0-61.5-24.5T222-226v-498h-40v-54h176v-36h246v36h176v54h-40v498q0 36.73-24.64 61.36Q690.72-140 654-140H308Zm378-584H276v498q0 14 9 23t23 9h346q12 0 22-10t10-22v-498ZM381-275h54v-368h-54v368Zm146 0h54v-368h-54v368ZM276-724v530-530Z"/></svg>`;
}

function resetIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  ><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>`;
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
function checkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`;
}

function iconFallback() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-74.31 0-140-28.42-65.69-28.43-114.42-77.16-48.73-48.73-77.16-114.42Q120-405.69 120-480q0-74.54 28.42-140.12 28.43-65.57 77.16-114.3 48.73-48.73 114.42-77.16Q405.69-840 480-840q74.54 0 140.12 28.42 65.57 28.43 114.3 77.16 48.73 48.73 77.16 114.3Q840-554.54 840-480q0 74.31-28.42 140-28.43 65.69-77.16 114.42-48.73 48.73-114.3 77.16Q554.54-120 480-120Zm0-39.69q35.23-45.23 58.08-88.85 22.84-43.61 37.15-97.61H384.77q15.85 57.07 37.92 100.69 22.08 43.61 57.31 85.77Zm-50.92-6q-28-33-51.12-81.58-23.11-48.58-34.42-98.88H190.15q34.39 74.61 97.5 122.38 63.12 47.77 141.43 58.08Zm101.84 0q78.31-10.31 141.43-58.08 63.11-47.77 97.5-122.38H616.46q-15.15 51.07-38.27 99.65-23.11 48.58-47.27 80.81ZM173.85-386.15h161.38q-4.54-24.62-6.42-47.97-1.89-23.34-1.89-45.88 0-22.54 1.89-45.88 1.88-23.35 6.42-47.97H173.85q-6.54 20.77-10.2 45.27Q160-504.08 160-480t3.65 48.58q3.66 24.5 10.2 45.27Zm201.38 0h209.54q4.54-24.62 6.42-47.2 1.89-22.57 1.89-46.65t-1.89-46.65q-1.88-22.58-6.42-47.2H375.23q-4.54 24.62-6.42 47.2-1.89 22.57-1.89 46.65t1.89 46.65q1.88 22.58 6.42 47.2Zm249.54 0h161.38q6.54-20.77 10.2-45.27Q800-455.92 800-480t-3.65-48.58q-3.66-24.5-10.2-45.27H624.77q4.54 24.62 6.42 47.97 1.89 23.34 1.89 45.88 0 22.54-1.89 45.88-1.88 23.35-6.42 47.97Zm-8.31-227.7h153.39Q734.69-690 673.5-736.23q-61.19-46.23-142.58-58.85 28 36.85 50.35 84.27 22.35 47.43 35.19 96.96Zm-231.69 0h190.46q-15.85-56.3-39.08-101.84-23.23-45.54-56.15-84.62-32.92 39.08-56.15 84.62-23.23 45.54-39.08 101.84Zm-194.62 0h153.39q12.84-49.53 35.19-96.96 22.35-47.42 50.35-84.27-82.16 12.62-142.96 59.23-60.81 46.62-95.97 122Z"/></svg>`;
}
function iconFallbackSrcString() {
  return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIj48cGF0aCBkPSJNNDgwLTEyMHEtNzQuMzEgMC0xNDAtMjguNDItNjUuNjktMjguNDMtMTE0LjQyLTc3LjE2LTQ4LjczLTQ4LjczLTc3LjE2LTExNC40MlExMjAtNDA1LjY5IDEyMC00ODBxMC03NC41NCAyOC40Mi0xNDAuMTIgMjguNDMtNjUuNTcgNzcuMTYtMTE0LjMgNDguNzMtNDguNzMgMTE0LjQyLTc3LjE2UTQwNS42OS04NDAgNDgwLTg0MHE3NC41NCAwIDE0MC4xMiAyOC40MiA2NS41NyAyOC40MyAxMTQuMyA3Ny4xNiA0OC43MyA0OC43MyA3Ny4xNiAxMTQuM1E4NDAtNTU0LjU0IDg0MC00ODBxMCA3NC4zMS0yOC40MiAxNDAtMjguNDMgNjUuNjktNzcuMTYgMTE0LjQyLTQ4LjczIDQ4LjczLTExNC4zIDc3LjE2UTU1NC41NC0xMjAgNDgwLTEyMFptMC0zOS42OXEzNS4yMy00NS4yMyA1OC4wOC04OC44NSAyMi44NC00My42MSAzNy4xNS05Ny42MUgzODQuNzdxMTUuODUgNTcuMDcgMzcuOTIgMTAwLjY5IDIyLjA4IDQzLjYxIDU3LjMxIDg1Ljc3Wm0tNTAuOTItNnEtMjgtMzMtNTEuMTItODEuNTgtMjMuMTEtNDguNTgtMzQuNDItOTguODhIMTkwLjE1cTM0LjM5IDc0LjYxIDk3LjUgMTIyLjM4IDYzLjEyIDQ3Ljc3IDE0MS40MyA1OC4wOFptMTAxLjg0IDBxNzguMzEtMTAuMzEgMTQxLjQzLTU4LjA4IDYzLjExLTQ3Ljc3IDk3LjUtMTIyLjM4SDYxNi40NnEtMTUuMTUgNTEuMDctMzguMjcgOTkuNjUtMjMuMTEgNDguNTgtNDcuMjcgODAuODFaTTE3My44NS0zODYuMTVoMTYxLjM4cS00LjU0LTI0LjYyLTYuNDItNDcuOTctMS44OS0yMy4zNC0xLjg5LTQ1Ljg4IDAtMjIuNTQgMS44OS00NS44OCAxLjg4LTIzLjM1IDYuNDItNDcuOTdIMTczLjg1cS02LjU0IDIwLjc3LTEwLjIgNDUuMjdRMTYwLTUwNC4wOCAxNjAtNDgwdDMuNjUgNDguNThxMy42NiAyNC41IDEwLjIgNDUuMjdabTIwMS4zOCAwaDIwOS41NHE0LjU0LTI0LjYyIDYuNDItNDcuMiAxLjg5LTIyLjU3IDEuODktNDYuNjV0LTEuODktNDYuNjVxLTEuODgtMjIuNTgtNi40Mi00Ny4ySDM3NS4yM3EtNC41NCAyNC42Mi02LjQyIDQ3LjItMS44OSAyMi41Ny0xLjg5IDQ2LjY1dDEuODkgNDYuNjVxMS44OCAyMi41OCA2LjQyIDQ3LjJabTI0OS41NCAwaDE2MS4zOHE2LjU0LTIwLjc3IDEwLjItNDUuMjdRODAwLTQ1NS45MiA4MDAtNDgwdC0zLjY1LTQ4LjU4cS0zLjY2LTI0LjUtMTAuMi00NS4yN0g2MjQuNzdxNC41NCAyNC42MiA2LjQyIDQ3Ljk3IDEuODkgMjMuMzQgMS44OSA0NS44OCAwIDIyLjU0LTEuODkgNDUuODgtMS44OCAyMy4zNS02LjQyIDQ3Ljk3Wm0tOC4zMS0yMjcuN2gxNTMuMzlRNzM0LjY5LTY5MCA2NzMuNS03MzYuMjNxLTYxLjE5LTQ2LjIzLTE0Mi41OC01OC44NSAyOCAzNi44NSA1MC4zNSA4NC4yNyAyMi4zNSA0Ny40MyAzNS4xOSA5Ni45NlptLTIzMS42OSAwaDE5MC40NnEtMTUuODUtNTYuMy0zOS4wOC0xMDEuODQtMjMuMjMtNDUuNTQtNTYuMTUtODQuNjItMzIuOTIgMzkuMDgtNTYuMTUgODQuNjItMjMuMjMgNDUuNTQtMzkuMDggMTAxLjg0Wm0tMTk0LjYyIDBoMTUzLjM5cTEyLjg0LTQ5LjUzIDM1LjE5LTk2Ljk2IDIyLjM1LTQ3LjQyIDUwLjM1LTg0LjI3LTgyLjE2IDEyLjYyLTE0Mi45NiA1OS4yMy02MC44MSA0Ni42Mi05NS45NyAxMjJaIi8+PC9zdmc+";
}

function LogoIcon() {
  return `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V18.5C0.5 19.0523 0.947715 19.5 1.5 19.5H18.5C19.0523 19.5 19.5 19.0523 19.5 18.5V1.5C19.5 0.947715 19.0523 0.5 18.5 0.5Z" fill="white"/>
            <path d="M14.5 3.5H5.5C4.94772 3.5 4.5 3.94772 4.5 4.5V15.4731C4.5 16.0358 4.96404 16.4877 5.5265 16.4728H10H14.5C15.0418 16.4584 15.5 16.0151 15.5 15.4731C15.5 14.9312 15.5 4.5 15.5 4.5C15.5 3.94772 15.0523 3.5 14.5 3.5Z" fill="#589E65"/>
            <path d="M9.5 8V3.5H13.5V8L11.5 6.5L9.5 8Z" fill="black"/>
            <path d="M5.5 3.5H14.5M5.5 3.5C4.94772 3.5 4.5 3.94772 4.5 4.5V15.4731C4.5 16.0358 4.96404 16.4877 5.5265 16.4728H10M5.5 3.5H9.5M14.5 3.5C15.0523 3.5 15.5 3.94772 15.5 4.5M14.5 3.5H13.5M15.5 4.5C15.5 4.5 15.5 14.9312 15.5 15.4731M15.5 4.5V15.4731M15.5 15.4731C15.5 16.0151 15.0418 16.4584 14.5 16.4728H10M10 10V16.4728M10 19.5V16.4728M13 13.5L10 15M6.5 10L10 11.5M9.5 3.5V8L11.5 6.5L13.5 8V3.5M9.5 3.5H13.5M1.5 0.5H18.5C19.0523 0.5 19.5 0.947715 19.5 1.5V18.5C19.5 19.0523 19.0523 19.5 18.5 19.5H1.5C0.947715 19.5 0.5 19.0523 0.5 18.5V1.5C0.5 0.947715 0.947715 0.5 1.5 0.5Z" stroke="black" stroke-linecap="round"/>
          </svg>`;
}
