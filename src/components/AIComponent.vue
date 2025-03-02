<template>
  <div class="ai-component">
    <div class="starfield"></div>
    <div class="content-wrapper">
      <h1 class="title">DawntasyAI Cosmic Assistant</h1>
      <div class="chat-container">
        <div class="messages" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message', message.sender, {'fade-in': message.animate}]">
            <div class="message-content">{{ message.text }}</div>
          </div>
        </div>
        <div class="input-area">
          <input v-model="userInput" @keyup.enter="sendMessage" 
                 placeholder="Ask the cosmos..." class="user-input" />
          <button @click="sendMessage" class="send-button">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIComponent',
  data() {
    return {
      messages: [],
      userInput: '',
    }
  },
  methods: {
    sendMessage() {
      if (this.userInput.trim()) {
        this.addMessage('user', this.userInput);
        this.generateAIResponse(this.userInput);
        this.userInput = '';
      }
    },
    addMessage(sender, text) {
      this.messages.push({ sender, text, animate: true });
      this.$nextTick(() => {
        this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
      });
    },
    generateAIResponse(userInput) {
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const aiResponse = `Cosmic wisdom: ${userInput.split('').reverse().join('')}`;
        this.addMessage('ai', aiResponse);
      }, 1000);
    }
  },
  mounted() {
    this.addMessage('ai', 'Greetings, cosmic traveler! How may I assist you on your celestial journey?');
  }
}
</script>

<style scoped>
.ai-component {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  font-family: 'Orbitron', sans-serif;
}

.starfield {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: -1;
}

.starfield::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: zoom 5s infinite;
  opacity: 0.3;
}

@keyframes zoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}

.content-wrapper {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 20px;
  padding: 2rem;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 0 20px rgba(66, 220, 219, 0.2);
}

.title {
  color: #42dcdb;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(66, 220, 219, 0.5);
}

.chat-container {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  overflow: hidden;
}

.messages {
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  max-width: 80%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.message.fade-in {
  opacity: 1;
}

.user {
  background: rgba(66, 220, 219, 0.2);
  color: #fff;
  align-self: flex-end;
  margin-left: auto;
}

.ai {
  background: rgba(199, 210, 254, 0.2);
  color: #fff;
}

.input-area {
  display: flex;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.6);
}

.user-input {
  flex-grow: 1;
  background: rgba(51, 65, 85, 0.6);
  border: none;
  padding: 0.75rem;
  color: #fff;
  border-radius: 10px 0 0 10px;
}

.send-button {
  background: #42dcdb;
  color: #1e293b;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 0 10px 10px 0;
}

.send-button:hover {
  background: #2cc9c8;
}

/* Add some custom scrollbar styles */
.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.4);
}

.messages::-webkit-scrollbar-thumb {
  background: #42dcdb;
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #2cc9c8;
}
</style>
