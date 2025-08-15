import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import getDbPromise from '../config/firestore-enhanced.js';

/**
 * Real-time WebSocket Manager for live activity feeds and notifications
 */
class WebSocketManager extends EventEmitter {
  constructor() {
    super();
    this.wss = null;
    this.clients = new Map();
    this.rooms = new Map(); // For room-based broadcasting
    this.activityQueue = [];
    this.isStarted = false;
    this.heartbeatInterval = null;
  }

  /**
   * Initialize WebSocket server
   * @param {object} server - HTTP server instance
   */
  initialize(server) {
    if (this.isStarted) {
      console.log('♻️ WebSocket server already running');
      return;
    }

    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      perMessageDeflate: {
        // Enable compression for better performance
        zlibDeflateOptions: {
          chunkSize: 1024,
          windowBits: 13,
          level: 3,
        },
        clientMaxWindow: 13,
        zlibInflateOptions: {
          chunkSize: 1024,
        },
      },
    });

    this.setupWebSocketHandlers();
    this.startHeartbeat();
    this.setupFirestoreListeners();

    this.isStarted = true;
    console.log('🚀 WebSocket server initialized on path /ws');
  }

  /**
   * Setup WebSocket connection handlers
   */
  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      const clientInfo = {
        id: clientId,
        ws,
        ip: request.socket.remoteAddress,
        userAgent: request.headers['user-agent'],
        connectedAt: new Date(),
        lastPing: new Date(),
        subscriptions: new Set(),
      };

      this.clients.set(clientId, clientInfo);
      console.log(`📱 Client connected: ${clientId} (${this.clients.size} total)`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection',
        message: 'Connected to wedding website real-time updates',
        clientId,
        timestamp: new Date().toISOString(),
      });

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error(`❌ Invalid message from ${clientId}:`, error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for client ${clientId}:`, error);
        this.handleClientDisconnect(clientId);
      });

      // Handle pong responses for heartbeat
      ws.on('pong', () => {
        if (this.clients.has(clientId)) {
          this.clients.get(clientId).lastPing = new Date();
        }
      });
    });

    this.wss.on('error', (error) => {
      console.error('❌ WebSocket server error:', error);
    });
  }

  /**
   * Handle messages from clients
   */
  handleClientMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        this.handleSubscription(clientId, message.channel);
        break;
      case 'unsubscribe':
        this.handleUnsubscription(clientId, message.channel);
        break;
      case 'ping':
        this.sendToClient(clientId, { type: 'pong', timestamp: new Date().toISOString() });
        break;
      case 'activity':
        this.handleActivityFromClient(clientId, message);
        break;
      default:
        console.warn(`⚠️ Unknown message type from ${clientId}:`, message.type);
    }
  }

  /**
   * Handle client subscriptions to channels
   */
  handleSubscription(clientId, channel) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.add(channel);

    // Add client to room
    if (!this.rooms.has(channel)) {
      this.rooms.set(channel, new Set());
    }
    this.rooms.get(channel).add(clientId);

    console.log(`📢 Client ${clientId} subscribed to ${channel}`);

    // Send confirmation
    this.sendToClient(clientId, {
      type: 'subscribed',
      channel,
      timestamp: new Date().toISOString(),
    });

    // Send recent activity for this channel
    this.sendRecentActivityToClient(clientId, channel);
  }

  /**
   * Handle client unsubscriptions
   */
  handleUnsubscription(clientId, channel) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.delete(channel);

    // Remove client from room
    if (this.rooms.has(channel)) {
      this.rooms.get(channel).delete(clientId);
      if (this.rooms.get(channel).size === 0) {
        this.rooms.delete(channel);
      }
    }

    console.log(`📢 Client ${clientId} unsubscribed from ${channel}`);

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      channel,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle activity posted by clients
   */
  async handleActivityFromClient(clientId, message) {
    try {
      // Validate activity data
      if (!message.data || !message.data.type || !message.data.description) {
        this.sendToClient(clientId, {
          type: 'error',
          message: 'Invalid activity data',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Store activity in Firestore
      const db = await getDbPromise();
      const activityData = {
        ...message.data,
        clientId,
        timestamp: new Date(),
        source: 'websocket',
      };

      const docRef = await db.collection('activities').add(activityData);

      // Broadcast to all subscribed clients
      this.broadcastActivity({
        id: docRef.id,
        ...activityData,
      });

      console.log(`📝 Activity created by ${clientId}: ${message.data.type}`);
    } catch (error) {
      console.error(`❌ Error handling activity from ${clientId}:`, error);
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Failed to process activity',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle client disconnection
   */
  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Remove from all rooms
    client.subscriptions.forEach((channel) => {
      if (this.rooms.has(channel)) {
        this.rooms.get(channel).delete(clientId);
        if (this.rooms.get(channel).size === 0) {
          this.rooms.delete(channel);
        }
      }
    });

    this.clients.delete(clientId);
    console.log(`📱 Client disconnected: ${clientId} (${this.clients.size} remaining)`);
  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== client.ws.OPEN) {
      return false;
    }

    try {
      client.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`❌ Error sending to client ${clientId}:`, error);
      this.handleClientDisconnect(clientId);
      return false;
    }
  }

  /**
   * Broadcast message to all clients in a channel
   */
  broadcastToChannel(channel, message) {
    const room = this.rooms.get(channel);
    if (!room) return 0;

    let sentCount = 0;
    room.forEach((clientId) => {
      if (this.sendToClient(clientId, message)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  /**
   * Broadcast activity to all subscribed clients
   */
  broadcastActivity(activity) {
    const message = {
      type: 'activity',
      data: activity,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to activity channel
    const sentCount = this.broadcastToChannel('activities', message);
    console.log(`📡 Activity broadcasted to ${sentCount} clients`);

    // Emit event for other parts of the application
    this.emit('activity', activity);
  }

  /**
   * Broadcast general updates
   */
  broadcastUpdate(type, data) {
    const message = {
      type: 'update',
      updateType: type,
      data,
      timestamp: new Date().toISOString(),
    };

    let totalSent = 0;
    this.clients.forEach((client, clientId) => {
      if (this.sendToClient(clientId, message)) {
        totalSent++;
      }
    });

    console.log(`📡 Update (${type}) broadcasted to ${totalSent} clients`);
  }

  /**
   * Send recent activity to newly subscribed client
   */
  async sendRecentActivityToClient(clientId, channel) {
    if (channel !== 'activities') return;

    try {
      const db = await getDbPromise();
      const snapshot = await db
        .collection('activities')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

      const activities = [];
      snapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      this.sendToClient(clientId, {
        type: 'recent_activities',
        data: activities,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`❌ Error sending recent activities to ${clientId}:`, error);
    }
  }

  /**
   * Setup Firestore listeners for real-time updates
   */
  setupFirestoreListeners() {
    // Listen for new activities
    this.listenToCollection('activities', (change) => {
      if (change.type === 'added') {
        const activity = {
          id: change.doc.id,
          ...change.doc.data(),
        };
        this.broadcastActivity(activity);
      }
    });

    // Listen for new guestbook entries
    this.listenToCollection('guestbook_entries', (change) => {
      if (change.type === 'added') {
        this.broadcastUpdate('guestbook_entry', {
          id: change.doc.id,
          ...change.doc.data(),
        });
      }
    });

    // Listen for new reactions
    this.listenToCollection('reactions', (change) => {
      if (change.type === 'added') {
        this.broadcastUpdate('reaction', {
          id: change.doc.id,
          ...change.doc.data(),
        });
      }
    });
  }

  /**
   * Listen to Firestore collection changes
   */
  async listenToCollection(collectionName, callback) {
    try {
      const db = await getDbPromise();
      const unsubscribe = db.collection(collectionName).onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach(callback);
        },
        (error) => {
          console.error(`❌ Error listening to ${collectionName}:`, error);
        }
      );

      console.log(`👂 Listening to Firestore collection: ${collectionName}`);
      return unsubscribe;
    } catch (error) {
      console.error(`❌ Failed to setup listener for ${collectionName}:`, error);
    }
  }

  /**
   * Start heartbeat to detect disconnected clients
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      const staleTimeout = 60000; // 60 seconds

      this.clients.forEach((client, clientId) => {
        // Check if client is stale
        if (now - client.lastPing > staleTimeout) {
          console.log(`💔 Removing stale client: ${clientId}`);
          this.handleClientDisconnect(clientId);
          return;
        }

        // Send ping
        if (client.ws.readyState === client.ws.OPEN) {
          client.ws.ping();
        }
      });
    }, 30000); // Check every 30 seconds

    console.log('💓 WebSocket heartbeat started');
  }

  /**
   * Generate unique client ID
   */
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const roomStats = {};
    this.rooms.forEach((clients, channel) => {
      roomStats[channel] = clients.size;
    });

    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      roomStats,
      uptime: this.isStarted ? Date.now() - this.startTime : 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Graceful shutdown
   */
  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all client connections
    this.clients.forEach((client) => {
      client.ws.close(1000, 'Server shutting down');
    });

    // Close WebSocket server
    if (this.wss) {
      this.wss.close(() => {
        console.log('🛑 WebSocket server closed');
      });
    }

    this.isStarted = false;
  }
}

// Create singleton instance
const wsManager = new WebSocketManager();

export default wsManager;
