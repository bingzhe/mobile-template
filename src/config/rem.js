// !function (e, t) { function n() { t.body ? t.body.style.fontSize = 12 * o + "px" : t.addEventListener("DOMContentLoaded", n); } function d() { var e = i.clientWidth / 10; i.style.fontSize = e + "px"; } var i = t.documentElement, o = e.devicePixelRatio || 1; if (n(), d(), e.addEventListener("resize", d), e.addEventListener("pageshow", function (e) { e.persisted && d(); }), o >= 2) { var a = t.createElement("body"), s = t.createElement("div"); s.style.border = ".5px solid transparent", a.appendChild(s), i.appendChild(a), 1 === s.offsetHeight && i.classList.add("hairlines"), i.removeChild(a); } }(window, document);
(function flexible(window, document) {
  // html根元素
  var docEl = document.documentElement;
  var dpr = window.devicePixelRatio || 1;

  // 标准fontSize计算值
  var base_font_size = 0;

  /**
    * 修复异常的fontSize代码
    */ 
  var fix = function () {
    var ua = navigator.userAgent;
    var isIOS = /(iPhone|iPad|iPod)/.test(ua);
    // 非苹果设备，均进行检测
    if (!isIOS) {
      var div = window.document.createElement("div");
      div.style.width = "10rem";
      window.document.body.appendChild(div);
      window.setTimeout(function () {
        var getWidth = parseFloat(window.getComputedStyle(div).width);
        // 获取屏幕宽度
        var screen_width = docEl.clientWidth;
        var rea_base_font_size;

        if (getWidth > screen_width || getWidth < (screen_width - 10)) {
          // 此时是出问题的情况
          var ratio = getWidth / screen_width;
          rea_base_font_size = (base_font_size / ratio).toFixed(4);
          docEl.style.fontSize = rea_base_font_size + "px";
        }
        div.remove();
      }, 100);
    }
  };

  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + "px";
    }
    else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    base_font_size = docEl.clientWidth / 10;
    docEl.style.fontSize = base_font_size + "px";
    fix();
  }

  setRemUnit();

  // reset rem unit on page resize
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
}(window, document));