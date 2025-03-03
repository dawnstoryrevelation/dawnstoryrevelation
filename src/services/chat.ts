import { callOpenAI } from '../services/openai';

// Inside your useChats function, in the addMessage function:
const addMessage = async (chatId: string, message: Message) => {
  try {
    // Add timestamp to message
    const messageWithTimestamp = {
      ...message,
      timestamp: serverTimestamp()
    };

    // Add message to messages subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, messageWithTimestamp);

    // Update chat's updatedAt timestamp
    await updateDoc(doc(db, 'chats', chatId), {
      updatedAt: serverTimestamp()
    });

    // If the message is from the user, get an AI response and add it
    if (message.role === 'user') {
      // Get AI response
      const aiResponse = await callOpenAI(message.content, messageWithTimestamp);

      // Add AI message
      const aiMessage: Message = {
        content: aiResponse,
        role: 'assistant',
        timestamp: serverTimestamp()
      };

      // Add AI response to Firestore
      await addDoc(messagesRef, aiMessage);

      // Update the chat's title based on the first message
      const title = message.content.length > 30 ? message.content.substring(0, 30) + '...' : message.content;
      await updateDoc(doc(db, 'chats', chatId), { title });
    }

    return messageWithTimestamp;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};