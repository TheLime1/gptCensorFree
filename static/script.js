const chatbox = document.getElementById("chatbox");
const messageInput = document.getElementById("message");

// create a Showdown converter object
const converter = new showdown.Converter();

const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", toggleDarkMode);

const textarea = document.getElementById("message");

function sendMessage() {
  const message = messageInput.value.trim();

  if (message === "") {
    return;
  }

  // convert message from markdown to HTML
  const htmlMessage = converter.makeHtml(message);

  // create new message element
  const messageEl = document.createElement("div");
  messageEl.classList.add("message", "user");
  messageEl.innerHTML = htmlMessage; // use innerHTML instead of textContent to display the HTML content

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
      // convert response from markdown to HTML
      const htmlResponse = converter.makeHtml(data.response);

      // create new message element for response
      const responseEl = document.createElement("div");
      responseEl.classList.add("message", "bot");
      responseEl.innerHTML = htmlResponse; // use innerHTML instead of textContent to display the HTML content

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

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
}

textarea.addEventListener("input", () => {
  textarea.style.height = "60px";
  textarea.style.height = `${textarea.scrollHeight}px`;
});
