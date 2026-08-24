const fs = require('fs-extra');
const path = require('path');
const Logger = require('./logger');

const logger = new Logger('CommandHandler');

class CommandHandler {
	constructor(prefix = '!') {
		this.prefix = prefix;
		this.commands = new Map();
		this.aliases = new Map();
	}

	loadCommands(commandsDir) {
		try {
			const files = fs.readdirSync(commandsDir);
			
			files.forEach(file => {
				if (file.endsWith('.js')) {
					const commandPath = path.join(commandsDir, file);
					delete require.cache[require.resolve(commandPath)];
					
					try {
						const command = require(commandPath);
						
						if (!command.name || !command.execute) {
							logger.warn(`Command ${file} is missing 'name' or 'execute' property`);
							return;
						}
						
						this.commands.set(command.name.toLowerCase(), command);
						
						if (command.aliases && Array.isArray(command.aliases)) {
							command.aliases.forEach(alias => {
								this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
							});
						}
						
						logger.info(`Loaded command: ${command.name}`);
					} catch (err) {
						logger.error(`Error loading command ${file}:`, err);
					}
				}
			});
			
			logger.success(`Loaded ${this.commands.size} commands`);
		} catch (err) {
			logger.error('Error loading commands:', err);
		}
	}

	getCommand(name) {
		const cmdName = name.toLowerCase();
		
		// Check if it's a direct command
		if (this.commands.has(cmdName)) {
			return this.commands.get(cmdName);
		}
		
		// Check if it's an alias
		if (this.aliases.has(cmdName)) {
			const actualName = this.aliases.get(cmdName);
			return this.commands.get(actualName);
		}
		
		return null;
	}

	handleMessage(message, api) {
		const content = message.body;
		
		if (!content.startsWith(this.prefix)) {
			return false;
		}
		
		const args = content.slice(this.prefix.length).trim().split(/\s+/);
		const commandName = args.shift();
		
		const command = this.getCommand(commandName);
		
		if (!command) {
			return false;
		}
		
		try {
			command.execute(message, args, api);
			return true;
		} catch (err) {
			logger.error(`Error executing command ${commandName}:`, err);
			api.sendMessage(
				`❌ An error occurred while executing the command: ${err.message}`,
				message.threadID
			);
			return true;
		}
	}

	getCommandList() {
		const list = [];
		
		this.commands.forEach((command, name) => {
			list.push({
				name: command.name,
				description: command.description || 'No description',
				usage: command.usage || `${this.prefix}${command.name}`,
				aliases: command.aliases || []
			});
		});
		
		return list;
	}
}

module.exports = CommandHandler;
