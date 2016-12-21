// Keep track of latest data item displayed
let	timestamp = 0;
let msgID;
let btnUpdate = document.querySelector('#deleteID');

function init() {
	
	getMessages();
	
    let button = document.querySelector('#send');
    button.addEventListener('click', sendMessage);
	
	let remove = document.querySelector('#delete');
    remove.addEventListener('click', deleteMessage);
	
}


function getMessages() {
	
	// AJAX request for chats
	let request = new XMLHttpRequest();
    request.open('GET', 'http://api.queencityiron.com/chats');
    request.addEventListener('load', function() {
		
		let response = JSON.parse(request.responseText);
		

		for(let i=0; i < response.chats.length; i++) {
			let chat = response.chats[i];
			
			// Only add newest elements
			if ( Date.parse(chat.added) > timestamp) {
				
				// Create list item elements
				let chatItem = document.createElement('li');
				chatItem.setAttribute('value', chat.id);
				
				
				/*** Filter message content, then display ***/
				let text = chat.message;
				
				//let image = /\[image=([0-z]*)\]/;
				let image = /\[image=(.*)\]/g;
				if ( image.test(text) ) {
					//text.replace(image, '<img src='$1'">');
					message = document.createElement('img');
					text = text.replace(image, '$1');
					message.src = text;
				}
				
				let emoji = /:([^:]*):/g;
				if ( emoji.test(text) ) {
					message = document.createElement('img');
					message.classList.add('emoji');
					text = text.replace(emoji, 'emoji/$1.png');
					message.src = text;
					
					/* Looping through regex
					https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
					
					let match;
					while (match = emoji.exec(text)) {
						console.log('found', match[1], 'at', match.index);
					}*/
				}
				
				if ( emoji.test(text) ) {
					let emArray;
					while ((emArray = emoji.exec(text)) !== null) {
						
						let emParent = document.createElement('img');
						
						let msg = emArray[0];
						console.log(msg);
						
						message.appendChild(emParent);
					}
				}
				
				// Highlight text w '!important' tag
				if (text.includes('!important')) {
					message.classList.add('highlight');
				}
				
				chatItem.innerHTML = Mustache.render(
					document.querySelector('#chat-template').innerHTML,
					{	user: chat.from,
						message: text,
						id: chat.id,
					}
				);
				
				let chatDiv = document.querySelector('ul');
				chatDiv.appendChild(chatItem);
				/*** End filter/display messages ***/
				
				
				// Wait until list items are populated
				// Add chat id to each list item value
				setChatId();
				
				timestamp = Date.parse(chat.added);
				
				// Continue to check for new chats from other users
				setTimeout(getMessages, 5000);
			}
		}
	});
	
	request.send();
}


function sendMessage (){
	
	let request = new XMLHttpRequest();
    request.open('POST', 'http://api.queencityiron.com/chats');
	
	let body = JSON.stringify({
		from: document.querySelector('#from').value,
		message: document.querySelector('#user-message').value,
	});
	
	request.addEventListener('load', function() {
		getMessages();
	});
	
	request.send(body);
	
}


// Can only be called after list items are populated
function setChatId() {
	let msg = document.querySelectorAll('li');
	for (let i=0; i<msg.length; i++) {
		msg[i].addEventListener('click', function() {
			// this value will be used to delete message by ID
			msgID = msg[i].value; 
			
			btnUpdate.textContent = ' ' + msgID + '?';
		});
	}
}


function deleteMessage() {
	
	let request = new XMLHttpRequest();
    request.open('DELETE', 'http://api.queencityiron.com/chats');
	
	let body = JSON.stringify({
		id: msgID,
	});
	
    request.addEventListener('load', function() {
		let chats = document.querySelector('ul');
		btnUpdate.textContent = '';
		
		// Repopulate all chats so that deleted msg is removed
		chats.innerHTML = '';
		timestamp = 0;
		getMessages();
	});
	
	request.send(body);
	
}

function getInfo() {
	alert(
		'Use !important to flag priority messages \nImage syntax-  [image=placehold.it/350x150] \nEmoji syntax- :smile_cat:'
	);
}


window.addEventListener('load', init);