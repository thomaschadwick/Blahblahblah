// contentscript.js

var friends = [];
var replaceText;

// show the icon in the url bar
chrome.extension.sendMessage({type:'showPageAction'});

// can't figure out how to get this to work... won't update the page

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//getStoredSettings();
		if (request.method == "processFriends"){
			processFriends();
			//processFriends();
		}
    	
	}
);

function getStoredSettings() {
	// get friends list from local storage
	chrome.extension.sendRequest({method: "getLocalStorage", key: "friends"}, function(response) {
	  friends = response.data ? JSON.parse(response.data) : [];
	});

	// get value to replace statuses and comments with from local storage
	chrome.extension.sendRequest({method: "getLocalStorage", key: "replaceValue"}, function(response) {
	  replaceText = response.data;
	});
}

var timeout = null;
var obs = new window.MutationObserver(function(mutations, observer) {
	processFriends();
});

obs.observe(document.body, { 
	childList: true,
	subtree: true 
});


// this fires way too often
/*document.addEventListener("DOMSubtreeModified", function(event){
	//something on the page has changed
	processFriends();
});*/

// works but mutationobserver is better
/*var timeout = null;
document.addEventListener("DOMSubtreeModified", function() {
	if (timeout) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(processFriends, 1000);
}, false);*/

function processFriends(){
	getStoredSettings();
	console.log("Blah blah blah: Processing");
	if (friends.length < 1) {
		console.log("Blah blah blah: No Friends Found");
	} else {
		for (var i = 0; i < friends.length; i++) {

			// plain status updates
			var statusUpdates = document.querySelectorAll("span.fwb.fcg a");
			for (var j = 0; j < statusUpdates.length; j++) {
				if (statusUpdates[j].innerHTML == friends[i]) {
					// I'm sorry, this is horrible...
					var contentArea = statusUpdates[j].parentNode.parentNode.parentNode.parentNode.children[1];
					if (contentArea.innerHTML != "" && contentArea.innerHTML.length > 0) {
						contentArea.innerHTML = replaceText; 
					}
				}
			}

			// status updates with those feeling thingers 
			var statusFeelers = document.querySelectorAll("div.fwn.fcg > span.fcg > span.fwb > a.profileLink");
			for (var j = 0; j < statusFeelers.length; j++) {
				if (statusFeelers[j].innerHTML == friends[i]) {
					// I'm sorry, this is horrible...
					var contentArea = statusFeelers[j].parentNode.parentNode.parentNode.parentNode.parentNode.children[1];
					if (contentArea.innerHTML.length > 0) {
						contentArea.innerHTML = replaceText;
					}
				}
			}				

			// comments
			var comments = document.querySelectorAll("a.UFICommentActorName");
			for (var j = 0; j < comments.length; j++) {
				if (comments[j].innerHTML == friends[i]) {
					comments[j].parentNode.children[2].firstChild.firstChild.innerHTML = replaceText;
				}
			}

			// status updates on profile page
			var profileOwner = document.getElementsByClassName("_8_2")
			if (profileOwner != null && profileOwner.length > 0) {
				if (profileOwner[0].innerHTML == friends[i]) {
					var statuses = document.getElementsByClassName("userContent");
					for (var j = 0; j < statuses.length; j++) {
						statuses[j].innerHTML = replaceText;
					}
				}
			}
		}
	}
}
