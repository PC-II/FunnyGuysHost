import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';

const app = express();
app.use(express.json());

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

app.post('/event', async (req, res) => {
    try {
        const { userName, action } = req.body;
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);

        if (!channel) return res.status(404).send('Channel not found');

        const message = action === 'upload' 
            ? `🎬 **The Host:** Stop everything! **${userName}** just submitted an entry.` 
            : `🎭 **The Host:** ${userName} is active!`;

        await channel.send(message);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

client.once('ready', () => {
    console.log(`✅ The Host (ESM) is live as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));