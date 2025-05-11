async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value;
    if (!message) return;
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
    userInput.value = "";
    try {
        const response = await fetch("https://campusbuzz-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        chatBox.innerHTML += `<div class="bot-msg">${data.response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight; 
        userInput.focus();
    } catch (error) {
        console.error('Error:', error);
    }
}
document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});