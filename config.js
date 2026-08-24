require('dotenv').config();

module.exports = {
	// Facebook Configuration
	facebook: {
		email: process.env.FACEBOOK_EMAIL || '',
		password: process.env.FACEBOOK_PASSWORD || '',
		options: {
			logLevel: 'silent',
			selfListen: false,
			listenEvents: true
		}
	},

	// Bot Configuration
	bot: {
		name: process.env.BOT_NAME || 'AkashBot',
		prefix: process.env.PREFIX || '!',
		version: '31.7.2',
		author: 'Akash Chowdhury'
	},

	// Server Configuration
	server: {
		port: process.env.PORT || 3000,
		host: process.env.HOST || 'localhost'
	},

	// Database Configuration
	database: {
		type: process.env.DB_TYPE || 'sqlite',
		path: process.env.DB_PATH || './database.db',
		logging: false
	},

	// Logging Configuration
	logging: {
		level: process.env.LOG_LEVEL || 'info',
		format: '[%(date)s] [%(level)s] %(message)s'
	},

	// API Keys
	apis: {
		youtube: process.env.YOUTUBE_API_KEY || '',
		discord: process.env.DISCORD_WEBHOOK || '',
		wikipedia: process.env.WIKIPEDIA_LANGUAGE || 'en'
	},

	// Features
	features: {
		autoReply: true,
		commandPrefix: true,
		eventListener: true,
		logging: true
	},

	// Timeouts (in milliseconds)
	timeouts: {
		messageReply: 2000,
		typing: 1000,
		reconnect: 5000
	}
};
