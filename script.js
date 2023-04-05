const openai = require("openai-api");
const api_key = "YOUR_API_KEY";

const chatbot = new openai(api_key);

function sendMessage() {
  let inputMessage = document.getElementById("input-message").value;

  // Append user message to chat body
  let chatBody = document.getElementById("chat-body");
  let userMessage = document.createElement("div");
  userMessage.classList.add("chat-message", "user-message");
  userMessage.innerHTML = "<p>" + inputMessage + "</p>";
  chatBody.appendChild(userMessage);

  // Send message to ChatGPT API
  chatbot
    .complete({
      engine: "davinci",
      prompt: inputMessage,
      maxTokens: 150,
      n: 1,
      stop: "\n",
    })
    .then((response) => {
      let outputMessage = response.choices[0].text.trim();

      // Append bot message to chat body
      let botMessage = document.createElement("div");
      botMessage.classList.add("chat-message", "bot-message");
      botMessage.innerHTML = "<p>" + outputMessage + "</p>";
      chatBody.appendChild(botMessage);

      // Clear input field
      document.getElementById("input-message").value = "";
    })
    .catch((error) => console.error(error));
}
