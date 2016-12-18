// Keep track of latest data item displayed
let	timestamp = 0;

function init() {
	
	getMessages();
	
    let button = document.querySelector('#send');
    button.addEventListener('click', sendMessage);
	
	/*let remove = document.querySelector('#delete');
    remove.addEventListener('click', deleteMessage);*/
}

function getMessages() {
	
	// AJAX request for chats
	let request = new XMLHttpRequest();
	
    request.open('GET', 'http://api.queencityiron.com/chats');
	
    request.addEventListener('load', function() {
		
		let response = JSON.parse(request.responseText);

		let parent = document.querySelector('ul');

		for(let i=0; i < response.chats.length; i++) {
			let chat = response.chats[i];
			
			// Only add newest elements
			if ( Date.parse(chat.added) > timestamp) {
				// Create list item elements
				let item = document.createElement('li');
				parent.appendChild(item);
			
				let user = document.createElement('p');
				user.classList.add('from-div');
				user.textContent = (chat.from + ': ');
				item.appendChild(user);
				
				/*
				 * Filter message content, then display
				 */
				let message = document.createElement('p');
				message.classList.add('message-div');
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
				}
				
				// Highlight text w '!important' tag
				if (text.includes('!important')) {
					message.classList.add('highlight');
				}

				message.textContent = (text);
				item.appendChild(message);
				/*
				 * End filter messages
				 */

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
		document.querySelector('#user-message').value = '';
	});
	
	request.send(body);
	
}


function deleteMessage() {
	
	let request = new XMLHttpRequest();
	
    request.open('DELETE', 'http://api.queencityiron.com/chats');
	
	let body = {
		'id': 2,
	}
	
    request.addEventListener('load', function() {
		getMessages();
		console.log('delete');
	});
	
	request.send(body);
	
}


window.addEventListener('load', init);