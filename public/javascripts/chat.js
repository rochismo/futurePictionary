window.onload = function () {

    // Establish connection
    const socket = io.connect('http://mypictionary.cleverapps.io/');
    //const socket = io.connect('http://localhost:8080/');
    const askLogin = (uses) => {
        name.value = uses.handleName();
        while (!name.value) {
            name.value = uses.handleName();
        }


        socket.emit("login", name.value);
        name.disabled = true;
    };

    // Save DOM elements
    const msg = document.querySelector("#msg"),
        name = document.querySelector("#handle"),
        sendBtn = document.querySelector("#send"),
        output = document.querySelector("#output"),
        feedback = document.querySelector("#feedback"),
        chat = document.querySelector("#mario-chat"),
        vind = document.querySelector("#chat-window"),
        users = document.querySelector("#users ");

    const uses = getUses(socket, name, msg, feedback, output, users, vind);
    askLogin(uses);

    handleEvents(uses, sendBtn, msg, socket);
}



Window.prototype.handleEvents = (uses, sendBtn, msg, socket) => {
    // Emit events
    sendBtn.onclick = uses.handleClicks;

    msg.onkeydown = uses.detectTyping;

    window.onkeypress = uses.handleKeys;

    // Listen for events

    socket.on("usernames", uses.handleUsers)

    socket.on("notifyAll", uses.handleLogins);

    socket.on("leave", uses.handleDisconnection);

    socket.on('chat', uses.retrieveMessages);

    socket.on("typing", uses.handleTyping);

    socket.on("empty", uses.handleEmpty);
    
}

Window.prototype.getUses = (socket, name, msg, feedback, output, users, chat) => {

    const updateScrollBar = () => {
        chat.scrollTop = chat.scrollHeight * 2;
    };

    return {
        handleChatLoad: (ev) => {
            console.log(name.value);
            socket.emit("login", name.value);
            socket.emit("notifyAll", name.value);
            return name.value;
        },

        handleName: () => {
            const name = prompt("Type in your user name");
            if (!name) {
                alert("Name cannot be empty");
                return null;
            }
            return name;
        },

        handleClicks: (evt) => {
            socket.emit('chat', {
                message: msg.value,
                name: name.value
            });
            msg.value = "";
            updateScrollBar();
        },

        detectTyping: (ev) => {
            socket.emit('typing', name.value);
            if (msg.value == "") {
                socket.emit('empty');
            }
            updateScrollBar();
        },

        handleTyping: (data) => {
            feedback.innerHTML = "<p><em>" + data + " is typing . . . </em></p>";
            updateScrollBar();
        },

        handleEmpty: () => {
            feedback.innerHTML = "";
            updateScrollBar();
        },

        retrieveMessages: (data) => {
            feedback.innerHTML = "";
            output.innerHTML += "<p><strong>" + data.name + ": </strong>" + data.message + "</p>";
            updateScrollBar();
        },

        handleKeys: (ev) => {
            if (ev.keyCode === 13 && msg.value) {
                socket.emit('chat', {
                    message: msg.value,
                    name: name.value
                });
                msg.value = "";
                updateScrollBar();
            }
        },

        handleUsers: (nicknames) => {
            let html = "";
            nicknames.forEach((user) => html += "<li class='list-group-item'>" + user + "</li>"); 
            users.innerHTML = html;
            updateScrollBar();
        },

        handleDisconnection: (nickname) => {
            console.log(nickname + " Leaving");
            output.innerHTML += "<p><em>" + nickname + " Disconnected from the fuxin chat </em></p>";
        },

        handleLogins: (nickname) => {
            output.innerHTML += "<p><em>" + nickname + " Joined the fuxin chat </em></p>";
        }
    };
};
