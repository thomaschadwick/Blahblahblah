// options.js

document.addEventListener('DOMContentLoaded', RestoreOptions);
document.querySelector('#save').addEventListener('click', SaveOptions);
document.querySelector('#add').addEventListener('click', AddFriendName);



// Save to localStorage
function SaveOptions() {
	var replaceValue = document.getElementById("replaceValue").value;
	localStorage["replaceValue"] = replaceValue;

	var table = document.getElementById("replaceNames");
	var rowCount = table.rows.length;
	var friends = [];
	for (var i = 1; i < rowCount; i++) {
		console.log(i);
		friends[i-1] = table.rows[i].cells[0].innerHTML;
	}
	localStorage["friends"] = JSON.stringify(friends);

	var status = document.getElementById("status");
	status.innerHTML = "Saved.";

	setTimeout(function() {
		status.innerHTML = "";
	}, 2000);

	setTimeout(function() {
		UpdateScreen();
	}, 2000)
	// need to call it twice for some reason... first call doesn't update
	UpdateScreen();
}

function UpdateScreen() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.sendMessage(tabs[0].id, {method: "processFriends"})
	});
}

function RestoreOptions() {
	var table = document.getElementById("replaceNames");
	var replaceValue = localStorage["replaceValue"];
	var friends = localStorage.friends ? JSON.parse(localStorage["friends"]) : [];
	var noFriends = document.getElementById("noFriends");
	if (friends.length > 0)
	{
		for (var i = 0; i < friends.length; i++) {
			var rowCount = table.rows.length;
			var row = table.insertRow(rowCount);
			var cell1 = row.insertCell(0);
			cell1.innerHTML = friends[i];

			var cell2 = row.insertCell(1);
			var element = document.createElement("button");
			element.name = "removeFriend";
			element.id = rowCount;
			element.className = "btn btn-danger btn-xs";
			element.innerHTML = "Remove";
			element.onclick = function() { DeleteFriend(this)};
			cell2.appendChild(element);			
		}
		
		noFriends.style.display = "none"
	}

	if (table.rows.length < 2) {
		table.style.display = "none";
		noFriends.style.display = "block";
	}

	if (replaceValue) {
		var replaceValueInput = document.getElementById("replaceValue");
		replaceValueInput.value = replaceValue;
	}
}

function AddFriendName() {
	var input = document.getElementById("addFriendName");
	if (input.value != null && input.value != "")
	{
		var addError = document.getElementById("addError");
		addError.innerHTML = "";

		var noFriends = document.getElementById("noFriends");
		noFriends.style.display = "none";

		var table = document.getElementById("replaceNames");
		table.style.display = "block";
		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);
		

		var cell1 = row.insertCell(0);
		cell1.innerHTML = input.value;

		var cell2 = row.insertCell(1);
		var element = document.createElement("button");
		element.name = "removeFriend";
		element.id = rowCount;
		element.innerHTML = "Remove";
		element.className = "btn btn-danger btn-xs";
		element.onclick = function() { DeleteFriend(this)};
		cell2.appendChild(element);

		input.value = "";	
	} else {
		var addError = document.getElementById("addError");
		addError.innerHTML = "You must provide a name.";
	}


}

function DeleteFriend(el) {
	el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode);
	var table = document.getElementById("replaceNames");
	var noFriends = document.getElementById("noFriends");

	if (table.rows.length < 2) {
		table.style.display = "none";
		noFriends.style.display = "block";
	}
}

