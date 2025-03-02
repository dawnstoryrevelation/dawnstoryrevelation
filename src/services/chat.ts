import { 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    serverTimestamp, 
    deleteDoc 
  } from 'firebase/firestore';
  import { db } from '../main';
  
  // Define types
  interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp?: any;
  }
  
  interface Chat {
    id: string;
    title: string;
    userId: string;
    messages: Message[];
    createdAt: any;
    updatedAt: any;
  }
  
  export const useChats = () => {
    /**
     * Create a new chat
     */
    const createChat = async (userId: string, initialMessage: string) => {
      try {
        // Create default title based on message content
        const title = initialMessage.slice(0, 30) + (initialMessage.length > 30 ? '...' : '');
        
        // Initial system message
        const systemMessage: Message = {
          role: 'system',
          content: 'You are Dawntasymelodic, a helpful AI assistant with a cosmic theme. You help users with their questions and tasks in a friendly, creative way.',
          timestamp: serverTimestamp()
        };
        
        // User's first message
        const userMessage: Message = {
          role: 'user',
          content: initialMessage,
          timestamp: serverTimestamp()
        };
        
        // Create chat document
        const chatRef = await addDoc(collection(db, 'chats'), {
          userId,
          title,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        // Add messages to subcollection
        const messagesRef = collection(db, 'chats', chatRef.id, 'messages');
        await addDoc(messagesRef, systemMessage);
        await addDoc(messagesRef, userMessage);
        
        return {
          id: chatRef.id,
          title,
          userId,
          messages: [systemMessage, userMessage],
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
      }
    };
  
    /**
     * Get all chats for a user
     */
    const getUserChats = async (userId: string) => {
      try {
        const chatsQuery = query(
          collection(db, 'chats'),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(chatsQuery);
        const chats: Chat[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          chats.push({
            id: doc.id,
            title: data.title,
            userId: data.userId,
            messages: [],
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          });
        });
        
        return chats;
      } catch (error) {
        console.error('Error getting user chats:', error);
        throw error;
      }
    };
  
    /**
     * Get a single chat with all messages
     */
    const getChat = async (chatId: string) => {
      try {
        // Get chat document
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        
        if (!chatDoc.exists()) {
          throw new Error('Chat not found');
        }
        
        const chatData = chatDoc.data();
        
        // Get messages
        const messagesQuery = query(
          collection(db, 'chats', chatId, 'messages'),
          orderBy('timestamp', 'asc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages: Message[] = [];
        
        messagesSnapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            role: data.role,
            content: data.content,
            timestamp: data.timestamp?.toDate()
          });
        });
        
        return {
          id: chatDoc.id,
          title: chatData.title,
          userId: chatData.userId,
          messages,
          createdAt: chatData.createdAt?.toDate(),
          updatedAt: chatData.updatedAt?.toDate()
        };
      } catch (error) {
        console.error('Error getting chat:', error);
        throw error;
      }
    };
  
    /**
     * Add a message to a chat
     */
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
        
        return messageWithTimestamp;
      } catch (error) {
        console.error('Error adding message:', error);
        throw error;
      }
    };
  
    /**
     * Update chat title
     */
    const updateChatTitle = async (chatId: string, title: string) => {
      try {
        await updateDoc(doc(db, 'chats', chatId), {
          title,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error updating chat title:', error);
        throw error;
      }
    };
  
    /**
     * Delete a chat
     */
    const deleteChat = async (chatId: string) => {
      try {
        // Delete all messages in the chat
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const messagesSnapshot = await getDocs(messagesRef);
        
        const deletePromises = messagesSnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        
        await Promise.all(deletePromises);
        
        // Delete the chat document
        await deleteDoc(doc(db, 'chats', chatId));
      } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
      }
    };
  
    return {
      createChat,
      getUserChats,
      getChat,
      addMessage,
      updateChatTitle,
      deleteChat
    };
  };
