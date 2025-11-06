document.getElementById('send-button').addEventListener('click', function() {
    const inputElement = document.getElementById('message-input');
    const messageText = inputElement.value.trim();

    if (messageText) {
        addMessage(messageText, 'sent');
        inputElement.value = ''; // Limpa o input
        scrollToBottom();
    }
});

function addMessage(text, type) {
    const messageArea = document.getElementById('message-area');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);
    messageArea.appendChild(messageDiv);
}

function scrollToBottom() {
    const messageArea = document.getElementById('message-area');
    messageArea.scrollTop = messageArea.scrollHeight; // Rola automaticamente para a última mensagem
}