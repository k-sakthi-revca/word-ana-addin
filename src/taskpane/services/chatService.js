import tokenManager from '../utils/tokenManager';
import axios from 'axios';

// API endpoints
const PROXY_API_ENDPOINT = 'https://localhost:3000';
const AI_MODEL_API_ENDPOINT = `${PROXY_API_ENDPOINT}/ai-model`;
const DIRECT_API_ENDPOINT = PROXY_API_ENDPOINT; // For endpoints that don't need the /ai-model prefix

/**
 * Get authentication headers for API requests
 * @returns {Object|null} - Headers object or null if no token
 */
export function getAuthHeaders() {
  const token = tokenManager.getAccessToken();
  if (!token) {
    console.log("getAuthHeaders: Missing token");
    return null;
  }

  try {
    // Try to get user data from localStorage directly first
    const userDataRaw = localStorage.getItem('user');
    let user = null;
    
    if (userDataRaw) {
      // Try to parse it as JSON
      try {
        user = JSON.parse(userDataRaw);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }
    
    // Simple headers - backend extracts trial data from JWT
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Add user/org headers if available
    if (user) {
      headers['x-user-id'] = user.user_id?.toString() || '';
      headers['x-org-id'] = user.org_names_list?.[0] || user.email || '';
    }

    return headers;
  } catch (err) {
    console.error('Error in getAuthHeaders:', err);
    // Return basic auth header as fallback
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}

/**
 * Chat Service for the Word Add-in
 * Handles chat sessions and messages
 */
class ChatService {
  /**
   * Get authentication headers for API requests
   * @returns {Object|null} - Headers object or null if no token
   */
  static getAuthHeaders() {
    return getAuthHeaders();
  }

  /**
   * Create a new chat session or return existing one
   * @param {string} messageName - Name for the session (usually first message)
   * @returns {Promise<string>} - Session ID
   */
  static async ensureSession(messageName) {
    try {
      // Check if we have a current session in localStorage
      const currentSession = localStorage.getItem('currentChatSession');
      if (currentSession) {
        return currentSession;
      }

      // Get auth headers
      const headers = this.getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      // Create a new session - using direct endpoint without /ai-model prefix
      const sessionResponse = await axios.post(
        `${DIRECT_API_ENDPOINT}/api/chat/v2/session`,
        { name: messageName.slice(0, 50) }, // Use first 50 chars of message as session name
        { headers }
      );

      const newSession = sessionResponse.data;
      
      // Store the session ID in localStorage
      localStorage.setItem('currentChatSession', newSession.id);
      
      return newSession.id;
    } catch (error) {
      console.error('Error ensuring chat session:', error);
      throw error;
    }
  }

  /**
   * Save a chat message
   * @param {string} sessionId - Session ID
   * @param {string} message - Message content
   * @param {string} type - Message type ('user' or 'assistant')
   * @param {string|null} files - Optional file IDs
   * @returns {Promise<Object>} - Saved message
   */
  static async saveMessage(sessionId, message, type, files = null) {
    try {
      // Get auth headers
      const headers = this.getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      // Save the message
      const response = await axios.post(
        `${DIRECT_API_ENDPOINT}/api/chat/v2/message`,
        {
          session_id: sessionId,
          message: message,
          type: type,
          files: files
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  /**
   * Stream chat with AI model
   * @param {string} userId - User ID
   * @param {string} message - User message
   * @param {Array} history - Chat history
   * @param {string} context - Document context
   * @param {Function} onChunk - Callback for each chunk of the response
   * @returns {Promise<void>}
   */
  static async streamChat(userId, message, history, context, onChunk) {
    try {
      // Get auth headers
      const headers = this.getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      // Prepare the request payload
      const payload = {
        user_id: userId || "word_addin_user",
        message: message,
        history: history || [],
        context: context
      };

      // Make the API request
      const response = await fetch(`${DIRECT_API_ENDPOINT}/security/api/chatbot/stream`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to read error response from stream.' }));
        const error = new Error(errorData.error || `Request failed with status ${response.status}`);
        error.response = { data: errorData };
        throw error;
      }

      // Process the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last, possibly incomplete, line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (!data.finished && data.content) {
                // Extract the content if it's a string
                const chunkContent = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
                
                // Append to the full response
                fullResponse += chunkContent;
                
                console.log("New chunk:", chunkContent);
                console.log("Full response so far:", fullResponse);
                
                // Pass only the new chunk to the callback
                onChunk(chunkContent);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Error in chat stream:', error);
      throw error;
    }
  }

  /**
   * Get messages for a session
   * @param {string} sessionId - Session ID
   * @param {number} limit - Number of messages to retrieve
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} - Messages
   */
  static async getMessages(sessionId, limit = 10, offset = 0) {
    try {
      // Get auth headers
      const headers = this.getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      // Get messages
      const response = await axios.get(
        `${DIRECT_API_ENDPOINT}/api/chat/v2/message`,
        {
          params: { 
            session_id: sessionId,
            limit: limit,
            offset: offset
          },
          headers
        }
      );

      return response.data.messages;
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  /**
   * Get all chat sessions
   * @param {number} limit - Number of sessions to retrieve
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Object>} - Sessions and total count
   */
  static async getSessions(limit = 10, offset = 0) {
    try {
      // Get auth headers
      const headers = this.getAuthHeaders();
      if (!headers) {
        throw new Error('No authentication token found');
      }

      // Get sessions
      const response = await axios.get(
        `${DIRECT_API_ENDPOINT}/api/chat/v2/session`,
        {
          params: {
            limit,
            offset
          },
          headers
        }
      );
      
      return {
        sessions: response.data.sessions,
        total: response.data.total
      };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  /**
   * Clear the current session
   */
  static clearCurrentSession() {
    localStorage.removeItem('currentChatSession');
  }

  /**
   * Get the current session ID
   * @returns {string|null} - Current session ID or null
   */
  static getCurrentSession() {
    return localStorage.getItem('currentChatSession');
  }
}

export default ChatService;
