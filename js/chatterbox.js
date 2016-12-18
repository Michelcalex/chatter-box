// Set timestamp of last ajax call
let	timestamp = 0;

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

		let parent = document.querySelector('ul');

		for(let i=0; i < response.chats.length; i++) {
			let chat = response.chats[i];
			
			// Only add newest elements
			if ( Date.parse(chat.added) > timestamp) {
				// Create list item elements
				let item = document.createElement('li');
				parent.appendChild(item);
			
				let added = document.createElement('p');
				added.textContent = ('added: ' + Date.parse(chat.added) +  ', stamp = ' + timestamp);
				item.appendChild(added);

				let user = document.createElement('p');
				user.textContent = ('From: ' + chat.from);
				item.appendChild(user);

				let message = document.createElement('p');
				let text = chat.message;

				/*let target = text.includes('app');
				if (target) {
					text = 'MARGO';
				}*/

				if (text.includes('app')) {
					text = 'MARGO';
				}

				message.textContent = ('Message: ' + text);
				item.appendChild(message);
				
				timestamp = Date.parse(chat.added);
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


function deleteMessage (){
	
	let request = new XMLHttpRequest();
	
    request.open('DELETE', 'http://api.queencityiron.com/chats');
	
	let body = {
		'id': 3,
	}
	
    request.addEventListener('load', function() {
		//getMessages();
	});
	
	request.send(body);
	
}


window.addEventListener('load', init);