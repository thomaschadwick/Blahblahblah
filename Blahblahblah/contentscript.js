// contentscript.js

var friends = [];
var replaceText;

// show the icon in the url bar
chrome.extension.sendMessage({type:'showPageAction'});

// get friends list from local storage
chrome.extension.sendRequest({method: "getLocalStorage", key: "friends"}, function(response) {
  friends = response.data ? JSON.parse(response.data) : [];
});

// get value to replace statuses and comments with from local storage
chrome.extension.sendRequest({method: "getLocalStorage", key: "replaceValue"}, function(response) {
  replaceText = response.data;
});

/* would be nice to get this working properly
document.addEventListener("load", function(event) {
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	var obs = new MutationObserver(function(mutations, observer) {
		processFriends();
	});

	obs.observe(document.body, { 
		childList: true, 
		attributes: true, 
		characterData: true 
	});
});*/

// this fires way too often
/*document.addEventListener("DOMSubtreeModified", function(event){
	//something on the page has changed
	processFriends();
});*/

var timeout = null;
document.addEventListener("DOMSubtreeModified", function() {
	if (timeout) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(processFriends, 1000);
}, false);

function processFriends(){
	console.log("Processing");
	if (friends.length < 1) {
		console.log("Blah blah blah: No Friends Found");
	} else {
		for (var i = 0; i < friends.length; i++) {
			var statusUpdates = document.querySelectorAll("span.fwb.fcg a");
			for (var j = 0; j < statusUpdates.length; j++) {
				if (statusUpdates[j].innerHTML == friends[i]) {
					// I'm sorry, this is horrible...
					statusUpdates[j].parentNode.parentNode.parentNode.parentNode.children[1].innerHTML = replaceText;
				}
			}

			var comments = document.querySelectorAll("a.UFICommentActorName");
			for (var j = 0; j < comments.length; j++) {
				if (comments[j].innerHTML == friends[i]) {
					comments[j].parentNode.children[2].firstChild.firstChild.innerHTML = replaceText;
				}
			}
		}
	}
}
