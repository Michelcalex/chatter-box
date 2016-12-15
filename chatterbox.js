function init() {
    let request = new XMLHttpRequest();
    request.open('GET', 'http://api.queencityiron.com/chats');
    request.addEventListener('load', function() {
        let response = JSON.parse(request.responseText);
        for(let i =0; i < response.chats.length; i++) {
            let message = response.chats[i];
            //showChats(message);
            console.log(message);
        }
    });

    request.send();
}

window.addEventListener('load', init);