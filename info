const os = require('os');
const pidusage = require('pidusage');

module.exports = {
	name: 'info',
	description: 'Show bot information',
	aliases: ['botinfo', 'status'],
	usage: '!info',

	async execute(message, args, api) {
		try {
			const stats = await pidusage(process.pid);
			const uptime = process.uptime();
			const hours = Math.floor(uptime / 3600);
			const minutes = Math.floor((uptime % 3600) / 60);
			const seconds = Math.floor(uptime % 60);

			const infoText = `
╔════════════════════════════════════════╗
║         🤖 AkashBot Information 🤖     ║
╚════════════════════════════════════════╝

📛 Name: AkashBot
📊 Version: 31.7.2
👨‍💻 Author: Akash Chowdhury
📝 Description: Facebook Messenger Bot

📈 System Stats:
• CPU Usage: ${stats.cpu.toFixed(2)}%
• Memory Usage: ${(stats.memory / 1024 / 1024).toFixed(2)} MB
• Uptime: ${hours}h ${minutes}m ${seconds}s

🖥️  Server Info:
• Platform: ${os.platform()}
• Architecture: ${os.arch()}
• CPU Cores: ${os.cpus().length}
• Total Memory: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB

🔗 Repository: https://github.com/Akash7392/AkashBot
📄 License: GPL-3.0
			`;

			api.sendMessage(infoText.trim(), message.threadID);
		} catch (err) {
			api.sendMessage(`❌ Error: ${err.message}`, message.threadID);
		}
	}
};
