function init() {
	
	// AJAX request for chats
    let request = new XMLHttpRequest();
    request.open('GET', 'http://api.queencityiron.com/chats');
    request.addEventListener('load', function() {
        let response = JSON.parse(request.responseText);
        for(let i =0; i < response.chats.length; i++) {
            let message = response.chats[i];
			
            showChats(message);
            //console.log(message);
        }
    });
    request.send();
	
    let button = document.querySelector('#send');
    button.addEventListener('click', sendMessage);
}

function showChats(chat) {
    let parent = document.querySelector('ul');
    
	// Create list item elements
    let item = document.createElement('li');
    parent.appendChild(item);

		let user = document.createElement('p');
		user.textContent = ('From: ' + chat.from);
		item.appendChild(user);

		let message = document.createElement('p');

		message.textContent = ('Message: ' + chat.message);
		item.appendChild(message);
}


function sendMessage (){
    
	// Get user input
	let textBox = document.querySelector('#user-message');
    let userInput = textBox.value;
	textBox.value = '';
	
	// Post message to chats
    // AJAX request here
    console.log(userInput);
    
}


window.addEventListener('load', init);