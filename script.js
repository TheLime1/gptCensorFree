const chatbox = document.getElementById("chatbox");
const messageInput = document.getElementById("message");

function sendMessage() {
  const message = messageInput.value.trim();

  if (message === "") {
    return;
  }

  // create new message element
  const messageEl = document.createElement("div");
  messageEl.classList.add("message", "user");
  messageEl.textContent = message;

  // append message element to chatbox
  chatbox.appendChild(messageEl);

  // send message to chatbot API
  fetch("http://localhost:5000/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input_message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      // create new message element for response
      const responseEl = document.createElement("div");
      responseEl.classList.add("message", "bot");
      responseEl.textContent = data.response;

      // append message element to chatbox
      chatbox.appendChild(responseEl);

      // scroll chatbox to bottom
      chatbox.scrollTop = chatbox.scrollHeight;
    });

  // clear message input
  messageInput.value = "";
}

// send message on pressing enter key
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
