window.onload = function () {
    // Establish connection
    //const socket = io.connect('http://mypictionary.cleverapps.io/');
    const socket = io.connect('http://localhost:8080/');

    // Save DOM elements
    const msg = document.querySelector("#message"),
        name = document.querySelector("#handle"),
        sendBtn = document.querySelector("#send"),
        output = document.querySelector("#output"),
        feedback = document.querySelector("#feedback"),
        chat = document.querySelector("#mario-chat"),
        vind = document.querySelector("#chat-window"),
        users = document.querySelector("#sidebar");

    const uses = getUses(socket, name, msg, feedback, output, users, vind);
    name.value = uses.handleChatLoad(null) || "No name";
    name.disabled = true;

    // Emit events
    sendBtn.onclick = uses.handleClicks;

    msg.onkeydown = uses.detectTyping;

    window.onkeypress = uses.handleKeys;

    // Listen for events

    socket.on("leave", uses.handleDisconnection);

    socket.on('chat', uses.retrieveMessages);

    socket.on("typing", uses.handleTyping);

    socket.on("empty", uses.handleEmpty);

    socket.on("usernames", uses.handleUsers);

}

Window.prototype.getUses = (socket, name, msg, feedback, output, users, chat) => {

    const updateScrollBar = () => {
        chat.scrollTop = chat.scrollHeight * 2;
    };

    return {
        handleChatLoad: (ev) => {
            const name = prompt("Input your nickname");
            socket.emit("login", name || "Anonymous");
            output.innerHTML += "<p><em>" + name + " Joined the fuxin chat </em></p>";
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
            nicknames.forEach((user) => html += "<p>" + user + "<br>"); 
            users.innerHTML = html;
            updateScrollBar();
        },

        handleDisconnection: (nickname) => {
            console.log(nickname + " Leaving");
            output.innerHTML += "<p><em>" + nickname + " Disconnected fro mthe fuxin chat </em></p>";
        } 
    };
};
