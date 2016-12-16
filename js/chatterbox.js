function init() {
	
    getMessages();
	
    let button = document.querySelector('#send');
    button.addEventListener('click', sendMessage);
}

function getMessages() {
	
	// AJAX request for chats
	let request = new XMLHttpRequest();
	
    request.open('GET', 'http://api.queencityiron.com/chats');
	
    request.addEventListener('load', function() {
		
		let response = JSON.parse(request.responseText);

		let parent = document.querySelector('ul');

		for(let i =0; i < response.chats.length; i++) {
			
			// Create list item elements
			let item = document.createElement('li');
			parent.appendChild(item);

			let user = document.createElement('p');
			user.textContent = ('From: ' + response.chats[i].from);
			item.appendChild(user);

			let message = document.createElement('p');

			message.textContent = ('Message: ' + response.chats[i].message);
			item.appendChild(message);
		}
	});
	
	request.send();
}


function sendMessage (){
	
	let request = new XMLHttpRequest();
	
    request.open('GET', 'http://api.queencityiron.com/chats');
	
	let body = JSON.stringify({
		from: document.querySelector('#from').value,
		message: document.querySelector('#user-message').value,
	});
	
    document.querySelector('#user-message').value = '';
	
	request.send(body);
	
}


window.addEventListener('load', init);