/**
 * Redis Connection Management Module
 * Provides a centralized way to interact with Redis
 * with proper connection handling, error recovery, and state management
 */
const Redis = require("ioredis");
require("dotenv").config();

// State variables
let client = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 20;

/**
 * Initialize Redis connection
 * @returns {Promise<Redis|null>} Redis client or null if not configured
 */
const connectRedis = async () => {
  // Don't try to reconnect if we already have a client
  if (client && isConnected) {
    return client;
  }

  if (!process.env.REDIS_HOST) {
    console.warn("⚠️ No Redis Configured, Redis is disabled");
    return null;
  }

  try {
    const redisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      username: process.env.REDIS_USERNAME || undefined,
      db: parseInt(process.env.REDIS_DB, 10) || 0,
      maxRetriesPerRequest: 3,
      enableAutoPipelining: true,
      connectionName: "keep-alive-app",

      // Reconnection strategy
      retryStrategy: (times) => {
        reconnectAttempts = times;

        if (times > maxReconnectAttempts) {
          console.error("🔴 Redis max reconnection attempts reached");
          return null; // Stop trying to reconnect
        }

        const delay = Math.min(times * 100, 3000); // Exponential backoff, max 3 seconds
        console.warn(`⚠️ Redis reconnecting, attempt #${times} in ${delay}ms`);
        return delay;
      },

      // Connection health check
      healthCheck: {
        interval: 30000, // 30 seconds
        maxNumberOfConnections: 10,
      },
    };

    // Handle TLS configuration properly
    if (process.env.REDIS_USE_TLS === "true") {
      redisOptions.tls = {};

      if (process.env.REDIS_REJECT_UNAUTHORIZED === "false") {
        redisOptions.tls.rejectUnauthorized = false;
      }
    }

    // Create a new client
    client = new Redis(redisOptions);

    // Set up event handlers
    _setupEventHandlers();

    // Wait for connection to be established or timeout after 5 seconds
    const connected = await Promise.race([
      ping(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Redis connection timeout")), 5000)
      ),
    ]);

    if (!connected) {
      throw new Error("Redis ping failed");
    }

    return client;
  } catch (error) {
    console.error(`🔴 Failed to initialize Redis connection: ${error.message}`);
    _cleanupClient();
    return null;
  }
};

/**
 * Setup Redis event handlers
 * @private
 */
const _setupEventHandlers = () => {
  if (!client) return;

  client.on("connect", () => {
    isConnected = true;
    reconnectAttempts = 0;
    console.log("🚀 Redis Connected successfully");
  });

  client.on("ready", () => {
    isConnected = true;
    console.log("✅ Redis Ready");
  });

  client.on("error", (error) => {
    console.error(`🔴 Redis Error: ${error.message}`);
    // Don't set isConnected to false here, let the close/end events handle that
  });

  client.on("close", () => {
    isConnected = false;
    console.warn("⚠️ Redis connection closed");
  });

  client.on("reconnecting", (delay) => {
    isConnected = false;
    console.warn(`⚠️ Redis reconnecting in ${delay}ms`);
  });

  client.on("end", () => {
    isConnected = false;
    console.warn("⚠️ Redis connection ended");
    _cleanupClient();
  });
};

/**
 * Clean up client resources
 * @private
 */
const _cleanupClient = () => {
  if (client) {
    // Remove all listeners to prevent memory leaks
    client.removeAllListeners();

    // Set to null to allow garbage collection
    client = null;
    isConnected = false;
  }
};

/**
 * Check if Redis connection is alive
 * @returns {Promise<boolean>} - Connection status
 */
const ping = async () => {
  try {
    if (!client) return false;

    const response = await client.ping();
    isConnected = response === "PONG";
    return isConnected;
  } catch (error) {
    isConnected = false;
    console.error(`🔴 Redis Ping Error: ${error.message}`);
    return false;
  }
};

/**
 * Get Redis client - returns client instance if connected, attempts reconnection if not
 * @param {boolean} autoReconnect - Whether to attempt reconnection if not connected
 * @returns {Redis|null} - Redis client or null if not connected
 */
const getClient = async (autoReconnect = false) => {
  // If we have a connected client, return it immediately
  if (client && isConnected) {
    return client;
  }

  // If we should try to reconnect and connection is configured
  if (autoReconnect && process.env.REDIS_HOST) {
    try {
      // Try to connect
      await connectRedis();
      if (isConnected) {
        return client;
      }
    } catch (error) {
      console.warn(`⚠️ Redis auto-reconnect failed: ${error.message}`);
    }
  } else if (!isConnected) {
    console.warn("⚠️ Attempted to use Redis while not connected");
  }

  return null;
};

/**
 * Get Redis client synchronously - returns client instance if connected, null otherwise
 * @returns {Redis|null} - Redis client or null if not connected
 */
const getClientSync = () => {
  if (client && isConnected) {
    return client;
  }
  console.warn("⚠️ Attempted to use Redis while not connected");
  return null;
};

/**
 * Close Redis connection gracefully
 * @returns {Promise<void>}
 */
const disconnectRedis = async () => {
  if (client) {
    try {
      await client.quit();
      console.log("👋 Redis disconnected gracefully");
    } catch (error) {
      console.error(`🔴 Redis Disconnect Error: ${error.message}`);

      // Force disconnect if quit fails
      if (client) {
        client.disconnect();
      }
    } finally {
      _cleanupClient();
    }
  }
};

/**
 * Get Redis connection status
 * @returns {Object} Redis connection status object
 */
const getStatus = () => {
  return {
    connected: isConnected,
    reconnectAttempts,
    maxReconnectAttempts,
    client: client ? "initialized" : "not initialized",
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };
};

module.exports = {
  connectRedis,
  disconnectRedis,
  ping,
  getClient,
  getClientSync,
  getStatus,
  isConnected: () => isConnected,
};
