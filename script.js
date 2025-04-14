async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value;
    if (!message) return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
    userInput.value = "";

    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chatBox.innerHTML += `<div class="bot-msg">${data.response}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  document.getElementById("user-input").addEventListener("keypress",function(e){
    if(e.key==="Enter"){
      sendMessage();
    }
  });