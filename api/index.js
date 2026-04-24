const { Telegraf } = require('telegraf');

const bot = new Telegraf('8528805758:AAEH2kolgFXSVKakBsreZ9N2iGX1yBAYglQ');
const ADMIN_ID = 7598563861;

// 1. Sambutan Selamat Datang
bot.start(async (ctx) => {
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
    await ctx.reply(`Selamat datang ${username}. Ada yang bisa kami bantu? 👋`);
});

// 2. Logika Utama (Auto-Respon & Forward ke Admin)
bot.on('message', async (ctx) => {
    const userId = ctx.from.id;

    // JIKA YANG CHAT ADALAH USER BIASA
    if (userId !== ADMIN_ID) {
        try {
            const pesanUser = ctx.message.text || "";
            
            // Auto respon (Kecuali command /start agar tidak dobel)
            if (pesanUser !== '/start') {
                await ctx.reply(
                    `Halo senang bertemu dengan kamu. Silahkan baca informasi dibawah ini 𓂃⋆.˚\n\n` +
                    `ᯓ𑣲 Jika token exp lihat video ini : https://t.me/Off_Luca/16\n\n` +
                    `#admin akan segera merespon pesan anda.....`
                );
            }

            // Forward pesan ke admin
            await ctx.forwardMessage(ADMIN_ID);
            // Penanda ID untuk dibalas admin
            await ctx.telegram.sendMessage(ADMIN_ID, `ID User: ${userId}\n⚠️ Balas (Reply) pesan ini untuk merespon.`);
            
        } catch (error) {
            console.error("Gagal meneruskan pesan.");
        }
    } 
    
    // 3. JIKA ADMIN MEMBALAS (REPLY)
    else if (userId === ADMIN_ID && ctx.message.reply_to_message) {
        try {
            const adminReplyText = ctx.message.text;
            const repliedMessageText = ctx.message.reply_to_message.text;

            if (repliedMessageText && repliedMessageText.includes("ID User:")) {
                const targetUserId = repliedMessageText.split('\n')[0].replace('ID User: ', '').trim();
                await ctx.telegram.sendMessage(targetUserId, `👨‍💻 **Balasan Admin:**\n\n${adminReplyText}`, { parse_mode: 'Markdown' });
                await ctx.reply("✅ Terkirim!");
            } 
        } catch (err) {
            ctx.reply("❌ Gagal kirim. Mungkin user blokir bot.");
        }
    }
});

// EKSPORT UNTUK VERCEL (Penting!)
module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
        }
        res.status(200).send('Bot is online');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
};
