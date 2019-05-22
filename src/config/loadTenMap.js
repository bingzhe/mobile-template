export default function loadMap() {
  return new Promise(function (resolve, reject) {
    if (typeof qq !== "undefined") {
      resolve(qq.maps);
      return true;
    }
    window.onMapCallback = function () {
      resolve(qq.maps);
    };
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
            "https://map.qq.com/api/js?v=2.exp&key=UIGBZ-HNXWX-NQ34S-ZP4PT-KKQ2F-NHFX3&callback=onMapCallback";
    script.onerror = reject;
    document.head.appendChild(script);
  });
} 
