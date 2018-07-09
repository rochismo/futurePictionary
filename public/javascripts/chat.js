window.onload = function () {
    // Establish connection
    const socket = io.connect('http://mypictionary.cleverapps.io/');

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

    socket.on('chat', uses.retrieveMessages);

    socket.on("typing", uses.handleTyping);

    socket.on("empty", uses.handleEmpty);

    socket.on("usernames", uses.handleUsers);

}

Window.prototype.getUses = (socket, name, msg, feedback, output, users, chat) => {
    return {
        handleChatLoad: (ev) => {
            const name = prompt("Input your nickname");
            socket.emit("login", name || "Anonymous");
            return name;
        },

        handleClicks: (evt) => {
            socket.emit('chat', {
                message: msg.value,
                name: name.value
            });
            // Setup Scroll
            console.log("Scrolling");
            chat.scrollTop = chat.scrollHeight;
            msg.value = "";
        },

        detectTyping: (ev) => {
            socket.emit('typing', name.value);
            if (msg.value == "") {
                socket.emit('empty');
            }
        },

        handleTyping: (data) => {
            feedback.innerHTML = "<p><em>" + data + " is typing . . . </em></p>";
        },

        handleEmpty: () => {
            feedback.innerHTML = "";
        },

        retrieveMessages: (data) => {
            feedback.innerHTML = "";
            output.innerHTML += "<p><strong>" + data.name + ":</strong>" + data.message + "</p>";
        },

        handleKeys: (ev) => {
            if (ev.keyCode === 13 && msg.value) {
                socket.emit('chat', {
                    message: msg.value,
                    name: name.value
                });
                // Setup Scroll
                console.log("Scrolling");
                chat.scrollTop = chat.scrollHeight;
                
                msg.value = "";
            }
        },

        handleUsers: (nicknames) => {
            let html = "";
            nicknames.forEach((user) => html += "<p>" + user + "<br>"); 
            users.innerHTML = html;
        }
    };
};
