// ==UserScript==
// @name           Google Video Search: Autopager
// @description    Infinite Scroll with Thumbnails
// @version        1.1
// @author         vzvu3k6k
// @include        /^https:\/\/www\.google\.tld/search\?*.*tbm=vid.*/
// @match          https://www.google.com/search?*
// @match          https://www.google.co.jp/search?*
// @namespace      http://vzvu3k6k.tk/
// @license        CC0
// ==/UserScript==

(function(){
  // Check if it is video search
  if(location.search.indexOf('tbm=vid') === -1) return;

  // When to prefetch & append the next page
  const remainHeight = document.querySelector('.srg > .g').getBoundingClientRect().height * 3;

  function throttle(minimumInterval, func, funcThis){
    var block = false;
    return function(){
      if(!block){
        block = true;
        setTimeout(function(){
          block = false;
        }, minimumInterval);
        func.apply(funcThis, arguments);
      }
    };
  }

  function getNextUrl(document){
    return document.getElementById('pnnext').href;
  }

  var nextUrl = getNextUrl(document);

  document.addEventListener('scroll', throttle(500, function(event){
    // Copied from autopagerize.user.js by swdyh
    // https://github.com/swdyh/autopagerize/blob/master/autopagerize.user.js
    var scrollHeight = Math.max(document.documentElement.scrollHeight,
                                document.body.scrollHeight);
    if(scrollHeight - window.innerHeight - event.pageY > remainHeight) return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', nextUrl);
    xhr.onload = function(){
      if(xhr.status !== 200) return;

      // Set images
      var scripts = xhr.responseXML.getElementsByTagName('script');
      for(var i = 0; i < scripts.length; i++){
        if(scripts[i].textContent.indexOf('base64') === -1) continue;

        scripts[i].textContent.replace(
            /\["(vidthumb\d+)","(data:image\/jpeg;base64,[^"]+)"\]/g,
          function(substr, id, image){
            var $img = xhr.responseXML.getElementById(id);

            // Fix hexadecimal escape sequences
            // (In JavaScript string literal, for instance, '\u003d' means '=')
            $img.src = image.replace(/\\u([0-9a-z]{4})/g, function(substr, code){
              return String.fromCharCode(parseInt(code, 16));
            });
          });
        break;
      }

      var $res = document.getElementById('res');
      $res.appendChild(document.createElement('hr'));

      // Append search results
      $res.appendChild(xhr.responseXML.getElementById('rso'));

      nextUrl = getNextUrl(xhr.responseXML);
    };
    xhr.responseType = 'document';
    xhr.send();
  }));
})();
