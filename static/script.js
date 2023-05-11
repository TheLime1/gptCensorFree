const chatbox = document.getElementById("chatbox");
const messageInput = document.getElementById("message");

// create a Showdown converter object
const converter = new showdown.Converter();

const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", toggleDarkMode);

const textarea = document.getElementById("message");

const sageButton = document.getElementById("sage-button");
sageButton.addEventListener("click", () => {
  activateButton(sageButton);
  deactivateButton(gptButton);
});

const gptButton = document.getElementById("gpt-button");
gptButton.addEventListener("click", () => {
  activateButton(gptButton);
  deactivateButton(sageButton);
});

function activateButton(button) {
  button.classList.add("active");
}

function deactivateButton(button) {
  button.classList.remove("active");
}

function sendMessage() {
  const message = messageInput.value.trim();

  if (message === "") {
    return;
  }

  // apply syntax highlighting to code blocks
  const highlightedMessage = message.replace(
    /```(\w+)?([\s\S]*?)```/g,
    (match, p1, p2) => {
      if (p1) {
        return `<pre><code class="language-${p1}">${p2.trim()}</code></pre>`;
      }
      return `<pre><code>${p2.trim()}</code></pre>`;
    }
  );

  // convert message from markdown to HTML
  const htmlMessage = converter.makeHtml(highlightedMessage);

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

      // handle code blocks in the response
      const responseCodeBlocks = responseEl.querySelectorAll("pre code");
      responseCodeBlocks.forEach((block) => {
        hljs.highlightBlock(block); // apply syntax highlighting
        const copyButton = document.createElement("button"); // create a copy button
        copyButton.classList.add("copy-button");
        copyButton.textContent = "Copy";
        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(block.textContent.trim()); // copy the code to clipboard
        });
        block.parentNode.insertBefore(copyButton, block); // insert the button before the code block
      });

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
