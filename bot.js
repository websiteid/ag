const { Telegraf } = require('telegraf');

const bot = new Telegraf('7836434671:AAEV8vwNfePDkv51Lp9CWUa7Kpm5ILWGqRE');
const ADMIN_ID = 7598563861; 

// 1. Sambutan Selamat Datang
bot.start((ctx, next) => {
    const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
    ctx.reply(`Selamat datang ${username}. Ada yang bisa kami bantu? 👋`);
    return next(); // Lanjut teruskan command /start ke admin
});

// 2. Semua Chat User & Fitur Forward ke Admin
bot.on('message', async (ctx) => {
    const userId = ctx.from.id;

    // JIKA YANG CHAT ADALAH USER BIASA
    if (userId !== ADMIN_ID) {
        try {
            const pesanUser = ctx.message.text || "";
            
            // Auto respon selalu muncul untuk chat apapun 
            // (Kecuali command /start agar sapaannya tidak numpuk/dobel)
            if (pesanUser !== '/start') {
                await ctx.reply(
                    `Halo senang bertemu dengan kamu. Silahkan baca informasi dibawah ini 𓂃⋆.˚\n\n` +
                    `ᯓ𑣲 Jika token exp lihat video ini : https://t.me/Off_Luca/16\n\n` +
                    `#admin akan segera merespon pesan anda.....`
                );
            }

            // Forward pesan ke admin
            await ctx.forwardMessage(ADMIN_ID);
            // Kirim ID ke admin sebagai penanda untuk dibalas
            await ctx.telegram.sendMessage(ADMIN_ID, `ID User: ${userId}\n⚠️ Admin, silakan **Balas (Reply)** pesan ini untuk mengirim jawaban ke user.`, { parse_mode: "Markdown" });
            
        } catch (error) {
            console.error("Gagal meneruskan pesan ke admin.");
        }
    } 
    
    // 3. JIKA ADMIN MEMBALAS (REPLY) PESAN USER
    else if (userId === ADMIN_ID && ctx.message.reply_to_message) {
        try {
            const adminReplyText = ctx.message.text;
            const repliedMessageText = ctx.message.reply_to_message.text;

            // Membaca ID dari pesan bot "ID User: xxxx"
            if (repliedMessageText && repliedMessageText.includes("ID User:")) {
                const targetUserId = repliedMessageText.split('\n')[0].replace('ID User: ', '').trim();
                
                // Kirim balasan admin ke DM User
                await ctx.telegram.sendMessage(targetUserId, `👨‍💻 **Balasan Admin:**\n\n${adminReplyText}`, { parse_mode: 'Markdown' });
                await ctx.reply("✅ Pesan balasanmu sukses dikirim ke user tersebut.");
            } 
            // Alternatif jika admin me-reply langsung pesan forward asli user
            else if (ctx.message.reply_to_message.forward_from) {
                const targetUserId = ctx.message.reply_to_message.forward_from.id;
                
                await ctx.telegram.sendMessage(targetUserId, `👨‍💻 **Balasan Admin:**\n\n${adminReplyText}`, { parse_mode: 'Markdown' });
                await ctx.reply("✅ Pesan balasanmu sukses dikirim ke user tersebut.");
            } 
            else {
                await ctx.reply("❌ Gagal. Pastikan kamu membalas (reply) pada pesan yang ada tulisan 'ID User: ...'");
            }
        } catch (err) {
            console.error(err);
            ctx.reply("❌ Gagal mengirim pesan. Kemungkinan user telah memblokir bot ini.");
        }
    }
});

bot.launch().then(() => {
    console.log("Bot sudah berjalan sempurna, siap menerima pesan...");
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Tambahkan ini di paling bawah kode kamu
const http = require('http');

http.createServer((req, res) => {
    res.write('Bot is Running!');
    res.end();
}).listen(process.env.PORT || 3000);