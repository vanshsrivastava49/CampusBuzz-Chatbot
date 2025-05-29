async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (!message) return;

    const chatBox = document.getElementById("chat-box");
    const loading = document.getElementById("loading");

    chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
    userInput.value = "";

    loading.style.display = "block";
    startTypingAnimation();
    try {
        const response = await fetch("https://campusbuzz-chatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        loading.style.display = "none";
        stopTypingAnimation();
        chatBox.innerHTML += `<div class="bot-msg">${data.response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight; 
        userInput.focus();

    } catch (error) {
        loading.style.display = "none";
        stopTypingAnimation();

        console.error('Error:', error);
        chatBox.innerHTML += `<div class="bot-msg error">Oops! Something went wrong.</div>`;
    }
}

document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

let dotCount = 1;
let typingInterval;

function startTypingAnimation() {
    const dots = document.getElementById("typing-dots");
    typingInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        dots.textContent = '.'.repeat(dotCount);
    }, 500);
}

function stopTypingAnimation() {
    clearInterval(typingInterval);
    document.getElementById("typing-dots").textContent = ".";
}
