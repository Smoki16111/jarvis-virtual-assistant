document.addEventListener('DOMContentLoaded', () => {
  const chatOutput = document.getElementById('chat-output');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');
  const ironCore = document.getElementById('iron-core');
  const statusText = document.getElementById('status-text');

  console.log("J.A.R.V.I.S. Инициализация...");

  // Хранилище контекста для ведения осмысленного диалога
  let conversationHistory = [
    { 
      role: 'system', 
      content: 'Ты — ДЖАРВИС, продвинутый искусственный интеллект, созданный Тони Старком. Отвечай уверенно, вежливо, на русском языке, с легким высокотехнологичным шармом. Называй пользователя "сэр" или "мэм". Старайся отвечать кратко, емко и по делу.' 
    }
  ];
  // --- ИНТЕРФЕЙСНЫЕ МЕТОДЫ ---
  function addMessage(text, sender = 'user') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatOutput.appendChild(msgDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }

  function setSystemState(state) {
    if (!ironCore || !statusText) return;
    if (state === 'thinking') {
      ironCore.className = 'arc-reactor thinking';
      statusText.textContent = 'SYSTEM: PROCESSING DATA';
      statusText.style.color = '#ff0055';
    } else if (state === 'listening') {
      ironCore.className = 'arc-reactor listening';
      statusText.textContent = 'SYSTEM: LISTENING...';
      statusText.style.color = '#00ff66';
    } else {
      ironCore.className = 'arc-reactor';
      statusText.textContent = 'SYSTEM: STANDBY';
      statusText.style.color = '#00b4d8';
    }
  }
  // --- ВРЕМЕННЫЙ ОФЛАЙН-ВАРИАНТ ДЛЯ ПРОВЕРКИ ИНТЕРФЕЙСА И ЗВУКА ---
  async function fetchAIResponse(userText) {
    // Имитируем небольшую задержку "мышления" компьютера Старка
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerText = userText.toLowerCase();
    
    // Простая база ответов для проверки
    if (lowerText.includes('привет') || lowerText.includes('здравствуй')) {
      return "Приветствую вас,сэр. Рад,что система функционирует нормально.";
    } else if (lowerText.includes('как дела') || lowerText.includes('статус')) {
      return "Все системы функционируют в штатном режиме. Энергия реактора на уровне ста процентов, сэр.";
    } else if (lowerText.includes('кто ты')) {
      return "Я — Джарвис, ваш виртуальный помощник. Нахожусь в процессе калибровки интерфейса.";
    } else {
      return `Запрос "${userText}" обработан. Локальный протокол активен, сэр.`;
    }
  }
  // --- ОБРАБОТЧИК ОТПРАВКИ ---
  async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    console.log("Отправка сообщения:", text);
    addMessage(text, 'user');
    userInput.value = '';
    
    setSystemState('thinking');
    
    const reply = await fetchAIResponse(text);
    
    setSystemState('standby');
    addMessage(reply, 'bot');
    speak(reply);
  }

  // --- СЛУШАТЕЛИ СОБЫТИЙ ---
  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSend();
    });
  }

  if (userInput) {
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }
  // --- РАСПОЗНАВАНИЕ РЕЧИ (Web Speech API) ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = 'ru-RU'; 

    micBtn.addEventListener('click', () => {
      try {
        setSystemState('listening');
        recognition.start();
      } catch (err) {
        console.error("Ошибка запуска распознавания:", err);
        setSystemState('standby');
      }
    });

    recognition.addEventListener('result', (e) => {
      const transcript = e.results[0][0].transcript;
      userInput.value = transcript;
      handleSend();
    });

    recognition.addEventListener('end', () => {
      setTimeout(() => {
        if (ironCore && !ironCore.classList.contains('thinking')) setSystemState('standby');
      }, 400);
    });

    recognition.addEventListener('error', (e) => {
      console.error("Ошибка распознавания речи:", e.error);
      setSystemState('standby');
    });
  } else if (micBtn) {
    micBtn.style.display = 'none';
  }
});
