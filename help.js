module.exports = {
	name: 'help',
	description: 'Shows all available commands',
	aliases: ['h', 'commands'],
	usage: '!help [command]',

	execute(message, args, api) {
		if (args.length === 0) {
			// Show all commands
			const helpText = `
╔════════════════════════════════════════╗
║         🤖 AkashBot Help Menu 🤖        ║
╚════════════════════════════════════════╝

Available Commands:

!ping - Check if bot is online
!help - Show this message
!echo <text> - Repeat your message
!joke - Get a random joke
!info - Bot information
!time - Current time
!calc <expression> - Calculate math expressions

Use: !help <command> for more info

Prefix: !
			`;
			api.sendMessage(helpText.trim(), message.threadID);
		} else {
			// Show specific command help
			const commandName = args[0].toLowerCase();
			const commands = {
				ping: 'Check if the bot is online\nUsage: !ping',
				help: 'Show available commands\nUsage: !help [command]',
				echo: 'Repeat your message\nUsage: !echo <your message>',
				joke: 'Get a random joke\nUsage: !joke',
				info: 'Show bot information\nUsage: !info',
				time: 'Show current time\nUsage: !time',
				calc: 'Calculate math expressions\nUsage: !calc <expression>'
			};

			if (commands[commandName]) {
				api.sendMessage(`📖 Command: ${commandName}\n\n${commands[commandName]}`, message.threadID);
			} else {
				api.sendMessage(`❌ Command '${commandName}' not found!`, message.threadID);
			}
		}
	}
};
