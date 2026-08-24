#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const chalk = require('chalk');
const login = require('fca-unofficial');
const express = require('express');
const bodyParser = require('body-parser');

const Logger = require('./utils/logger');
const CommandHandler = require('./utils/commandHandler');
const config = require('./config/config');

const logger = new Logger('AkashBot');
const commandHandler = new CommandHandler(config.bot.prefix);

// Initialize Express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'online', bot: config.bot.name, version: config.bot.version });
});

app.get('/', (req, res) => {
	res.json({ 
		message: `${config.bot.name} is running!`,
		version: config.bot.version,
		author: config.bot.author
	});
});

// Start HTTP server
const server = app.listen(config.server.port, config.server.host, () => {
	logger.success(`HTTP Server running on http://${config.server.host}:${config.server.port}`);
});

// Main bot function
async function startBot() {
	try {
		if (!config.facebook.email || !config.facebook.password) {
			logger.error('Facebook email and password are required!');
			logger.info('Please set FACEBOOK_EMAIL and FACEBOOK_PASSWORD in .env file');
			process.exit(1);
		}

		logger.info('Attempting to login to Facebook...');

		login(
			{
				email: config.facebook.email,
				password: config.facebook.password
			},
			config.facebook.options,
			(err, api) => {
				if (err) {
					logger.error('Login failed:', err);
					logger.info('Make sure your email and password are correct');
					process.exit(1);
				}

				logger.success(`${config.bot.name} logged in successfully! ✅`);
				logger.info(`Bot is ready to use with prefix: ${config.bot.prefix}`);

				// Load commands
				const commandsDir = path.join(__dirname, 'commands');
				commandHandler.loadCommands(commandsDir);

				// Listen to messages
				api.listen((err, message) => {
					if (err) {
						logger.error('Listen error:', err);
						return;
					}

					try {
						// Handle commands
						if (message.body && message.body.startsWith(config.bot.prefix)) {
							const handled = commandHandler.handleMessage(message, api);
							
							if (handled) {
								logger.info(`Command executed by ${message.senderID}: ${message.body}`);
							}
						}

						// Handle mentions
						if (message.mentions && message.mentions[api.getCurrentUserID()]) {
							api.sendMessage(
								`👋 Hi ${message.senderName}! I'm ${config.bot.name}. Use ${config.bot.prefix}help to see my commands.`,
								message.threadID
							);
						}
					} catch (err) {
						logger.error('Error handling message:', err);
					}
				});

				// Handle process termination
				process.on('SIGINT', () => {
					logger.warn('Received SIGINT, shutting down gracefully...');
					api.logout((err) => {
						if (err) {
							logger.error('Logout error:', err);
						} else {
							logger.success('Bot logged out successfully');
						}
						server.close(() => {
							logger.success('Server closed');
							process.exit(0);
						});
					});
				});

				process.on('SIGTERM', () => {
					logger.warn('Received SIGTERM, shutting down gracefully...');
					api.logout((err) => {
						if (err) {
							logger.error('Logout error:', err);
						} else {
							logger.success('Bot logged out successfully');
						}
						server.close(() => {
							logger.success('Server closed');
							process.exit(0);
						});
					});
				});
			}
		);
	} catch (err) {
		logger.error('Fatal error:', err);
		process.exit(1);
	}
}

// Start the bot
startBot();

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
	logger.error('Uncaught Exception:', err);
	process.exit(1);
});
