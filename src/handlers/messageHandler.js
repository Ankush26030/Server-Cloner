const ServerCloner = require('../Cloner');
const log = require('../utils/logger');

const pendingOperations = new Map();

function messageHandler(client) {
    client.on('messageCreate', async (message) => {
        // Log all messages from the user for debugging
        const allowedUserIds = process.env.ALLOWED_USER_IDS?.split(',').map(id => id.trim()) || [];
        
        if (message.author.bot && message.author.id !== client.user.id) return;
        
        if (!allowedUserIds.includes(message.author.id)) return;
        
        log.info(`✓ Message from allowed user ${message.author.id}: "${message.content.substring(0, 30)}..."`);
        
        if (pendingOperations.has(message.author.id)) {
            log.info(`✓ Pending operation exists for user ${message.author.id}`);
            await handlePendingOperation(message, client);
            return; 
        }

        if (message.content.startsWith('!clone')) {
            log.info('✓ Clone command detected');
            await handleCloneCommand(message, client);
        }
    });
}

async function handleCloneCommand(message, client) {
    const args = message.content.slice(6).trim().split(/ +/);
    const [sourceGuildId, targetGuildId] = args;

    if (!sourceGuildId || !targetGuildId) {
        return message.channel.send('❌ Usage: `!clone <source server ID> <target server ID>`');
    }
    
    const sourceGuild = client.guilds.cache.get(sourceGuildId);
    const targetGuild = client.guilds.cache.get(targetGuildId);

    if (!sourceGuild) return message.channel.send('❌ Source server not found!');
    if (!targetGuild) return message.channel.send('❌ Target server not found!');

    log.info(`Found source: ${sourceGuild.name}, target: ${targetGuild.name}`);

    await message.channel.send(`📋 **Server Cloning Confirmation**
- Source: **${sourceGuild.name}**
- Target: **${targetGuild.name}**

⚠️ **Warning:** This will delete all existing channels and roles in the target server!

Do you want to proceed?
Type **yes** or **y** to confirm, **no** or **n** to cancel.`);

    pendingOperations.set(message.author.id, {
        step: 'confirmProceed',
        sourceGuildId,
        targetGuildId,
        channelId: message.channel.id,
    });

    log.info(`Waiting for user confirmation (yes/no)... User: ${message.author.id}`);
}

async function handlePendingOperation(message, client) {
    const operation = pendingOperations.get(message.author.id);
    
    log.info(`handlePendingOperation called with message: "${message.content}"`);
    log.info(`Operation channel: ${operation?.channelId}, Message channel: ${message.channel.id}`);
    
    if (!operation) {
        log.warning('No operation found in pendingOperations!');
        return;
    }
    
    if (message.channel.id !== operation.channelId) {
        log.warning(`Channel mismatch! Expected: ${operation.channelId}, Got: ${message.channel.id}`);
        return;
    }

    const response = message.content.toLowerCase().trim();
    
    log.success(`✓ Processing response: "${response}" for step: ${operation.step}`);
    
    if (!['y', 'yes', 'n', 'no'].includes(response)) {
        log.warning(`Invalid response: "${response}" - not in [y, yes, n, no]`);
        return;
    }

    const progressChannel = await client.channels.fetch(operation.channelId).catch(() => null);
    if (!progressChannel) {
        log.error("Failed to fetch progress channel, cancelling operation.");
        pendingOperations.delete(message.author.id);
        return;
    }

    if (operation.step === 'confirmProceed') {
        if (response.startsWith('y')) {
            log.success('✅ User confirmed to proceed!');
            operation.step = 'confirmEmojis';
            pendingOperations.set(message.author.id, operation);
            await progressChannel.send('❓ Do you want to clone emojis as well? (Type **yes** or **no**)');
            log.info('Sent emoji confirmation prompt');
        } else {
            log.info('❌ User cancelled operation');
            pendingOperations.delete(message.author.id);
            await progressChannel.send('❌ Operation cancelled.');
        }
    } else if (operation.step === 'confirmEmojis') {
        const cloneEmojis = response.startsWith('y');
        pendingOperations.delete(message.author.id);
        
        log.success(`🚀 STARTING CLONE PROCESS! Emojis: ${cloneEmojis}`);
        await progressChannel.send(`🚀 Starting server cloning process...${cloneEmojis ? ' (including emojis)' : ' (without emojis)'}`);
        
        try {
            const cloner = new ServerCloner(client);
            log.info('ServerCloner instance created, calling cloneServer...');
            await cloner.cloneServer(operation.sourceGuildId, operation.targetGuildId, cloneEmojis, progressChannel);
            log.success('✅ Clone process completed successfully!');
        } catch (error) {
            log.error(`Cloning error: ${error.message}`);
            log.error(error.stack);
            await progressChannel.send(`❌ An error occurred while cloning: ${error.message}`);
        }
    }
}

module.exports = messageHandler;