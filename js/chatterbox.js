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
				
				
				// 1. Filter message content for regex (images, emojis, !important)
				// =================================================================
					let usrMsg = chat.message;
					let imgSrc;
					let msgClass;
					
					let imageRegex = /\[image=(.*)\]/g; //  /\[image=([0-z]*)\]/
					if ( imageRegex.test(usrMsg) ) {
						imgSrc = usrMsg.replace(imageRegex, '$1');
						msgClass = 'image';
						usrMsg = '';
					}
					
					let emojiRegex = /:([^:]*):/g;
					if ( emojiRegex.test(usrMsg) ) {
						imgSrc = usrMsg.replace(emojiRegex, 'emoji/$1.png');
						msgClass = 'emoji';
						usrMsg = '';
						
						/* Looping through regex
						https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
						
						let match;
						while (match = emojiRegex.exec(usrMsg)) {
							console.log('found', match[1], 'at', match.index);
						}*/
					}
				
					// Highlight text w '!important' tag
					if (usrMsg.includes('!important')) {
						msgClass = 'highlight';
					}
				// ====================================================
				// End filter messages
				
				
				// 2. Now display messages
				chatItem.innerHTML = Mustache.render(
					document.querySelector('#chat-template').innerHTML,
					{	user: chat.from,
						message: usrMsg,
						image: imgSrc,
						class: msgClass,
						id: chat.id,
					}
				);
				
				let chatDiv = document.querySelector('ul');
				chatDiv.appendChild(chatItem);
				
				
				
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


function sendMessage() {
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


// Only called after list items are populated / after GET request
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


window.addEventListener('load', init);