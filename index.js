import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

app.post('/event', async (req, res) => {
    try {
        const { userName, action } = req.body;
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);

        if (!channel) return res.status(404).send('Channel not found');

        // Logic for different actions
        let message = '';
        if (action === 'poke') {
            message = `👉 **The Host:** Stop that! **${userName}** is poking me!`;
        } else {
            message = `🎬 **The Host:** **${userName}** just sent an update!`;
        }

        await channel.send(message);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

client.once('clientReady', (c) => {
    console.log(`✅ The Host is live as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));