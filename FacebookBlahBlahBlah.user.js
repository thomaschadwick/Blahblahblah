// ==UserScript==
// @name         Blah blah blah
// @namespace    blahblah
// @match      	 https://www.facebook.com/*
// @match	 https://*.facebook.com/*
// @author       Thomas Chadwick
// @description  Blah blah blah
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
	$('div.UFICommentContent').children("a:contains('INSERT USERNAME')").parent().children(':last-child').text('Blah blah blah');
}

// load jQuery and execute the main function
addJQuery(main);