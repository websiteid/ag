const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('7836434671:AAEV8vwNfePDkv51Lp9CWUa7Kpm5ILWGqRE');
const ADMIN_ID = 7598563861;

// ═══════════════════════════════════════
//  HELPER: Buat garis pemisah cantik
// ═══════════════════════════════════════
const LINE = `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`;

// ═══════════════════════════════════════
//  1. COMMAND /start — Sambutan User
// ═══════════════════════════════════════
bot.start(async (ctx) => {
    const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name;

    const welcomeText =
        `╔══════════════════════╗\n` +
        `║   ✨  SELAMAT DATANG  ✨  ║\n` +
        `╚══════════════════════╝\n\n` +
        `Halo, ${username}! 👋\n` +
        `Senang bertemu denganmu 🤝\n\n` +
        `${LINE}\n` +
        `📌 *Apa yang bisa kami bantu?*\n` +
        `${LINE}\n\n` +
        `Silakan pilih menu di bawah ini\n` +
        `atau ketik pesanmu langsung ✍️`;

    await ctx.replyWithMarkdown(
        welcomeText,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('📋 Informasi', 'info'),
                Markup.button.callback('🎬 Tutorial Token', 'tutorial'),
            ],
            [
                Markup.button.callback('💬 Hubungi Admin', 'contact'),
                Markup.button.callback('❓ FAQ', 'faq'),
            ],
        ])
    );
});

// ═══════════════════════════════════════
//  INLINE BUTTON: Info
// ═══════════════════════════════════════
bot.action('info', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(
        `📋 *INFORMASI LAYANAN*\n` +
        `${LINE}\n\n` +
        `🔹 Layanan kami tersedia *24/7*\n` +
        `🔹 Respon admin: *< 1 jam*\n` +
        `🔹 Dukungan via bot ini\n\n` +
        `${LINE}\n` +
        `💡 Ketik pesanmu & admin akan segera membalas!`
    );
});

// ═══════════════════════════════════════
//  INLINE BUTTON: Tutorial
// ═══════════════════════════════════════
bot.action('tutorial', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(
        `🎬 *TUTORIAL TOKEN*\n` +
        `${LINE}\n\n` +
        `Jika token kamu sudah *expired*, tonton\n` +
        `panduan lengkap di video berikut:\n\n` +
        `👇 *Klik tautan di bawah ini*`,
        Markup.inlineKeyboard([
            [Markup.button.url('▶️ Tonton Tutorial', 'https://t.me/Off_Luca/16')],
            [Markup.button.callback('🔙 Kembali', 'back_main')],
        ])
    );
});

// ═══════════════════════════════════════
//  INLINE BUTTON: Hubungi Admin
// ═══════════════════════════════════════
bot.action('contact', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(
        `💬 *HUBUNGI ADMIN*\n` +
        `${LINE}\n\n` +
        `Cukup *ketik pesanmu* di sini dan\n` +
        `admin akan segera merespons! 🚀\n\n` +
        `⏳ Estimasi balasan: *< 1 jam*\n` +
        `${LINE}\n\n` +
        `✍️ Silakan tulis pesanmu sekarang...`
    );
});

// ═══════════════════════════════════════
//  INLINE BUTTON: FAQ
// ═══════════════════════════════════════
bot.action('faq', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(
        `❓ *PERTANYAAN UMUM (FAQ)*\n` +
        `${LINE}\n\n` +
        `*Q: Token saya expired, bagaimana?*\n` +
        `A: Tonton tutorial di menu Tutorial 🎬\n\n` +
        `*Q: Berapa lama admin membalas?*\n` +
        `A: Biasanya kurang dari 1 jam ⏳\n\n` +
        `*Q: Apakah layanan ini gratis?*\n` +
        `A: Silakan tanyakan langsung ke admin 💬\n` +
        `${LINE}`
    );
});

// ═══════════════════════════════════════
//  INLINE BUTTON: Back to Main
// ═══════════════════════════════════════
bot.action('back_main', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(
        `🏠 *Menu Utama*\n${LINE}\n\nSilakan pilih menu:`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('📋 Informasi', 'info'),
                Markup.button.callback('🎬 Tutorial Token', 'tutorial'),
            ],
            [
                Markup.button.callback('💬 Hubungi Admin', 'contact'),
                Markup.button.callback('❓ FAQ', 'faq'),
            ],
        ])
    );
});

// ═══════════════════════════════════════
//  2. LOGIKA UTAMA — Pesan dari User
// ═══════════════════════════════════════
bot.on('message', async (ctx) => {
    const userId   = ctx.from.id;
    const username = ctx.from.username
        ? `@${ctx.from.username}`
        : ctx.from.first_name;

    // ── USER BIASA ──────────────────────
    if (userId !== ADMIN_ID) {
        try {
            const pesanUser = ctx.message.text || '[Media / File]';

            // Auto-respon (kecuali /start agar tidak dobel)
            if (pesanUser !== '/start') {
                await ctx.replyWithMarkdown(
                    `╔═══════════════════╗\n` +
                    `║  📨  PESAN DITERIMA  ║\n` +
                    `╚═══════════════════╝\n\n` +
                    `Halo *${ctx.from.first_name}*! 👋\n\n` +
                    `Pesan kamu sudah kami terima dan\n` +
                    `akan segera direspons oleh admin 🚀\n\n` +
                    `${LINE}\n` +
                    `🎬 *Token Expired?*\n` +
                    `Tonton panduan: [Klik di sini](https://t.me/Off_Luca/16)\n` +
                    `${LINE}\n\n` +
                    `⏳ _Mohon tunggu, #admin sedang memproses..._`
                );
            }

            // Forward pesan ke Admin
            await ctx.forwardMessage(ADMIN_ID);

            // Kirim notifikasi ke admin dengan tombol
            await ctx.telegram.sendMessage(
                ADMIN_ID,
                `╔═══════════════════════╗\n` +
                `║  🔔  PESAN BARU MASUK  ║\n` +
                `╚═══════════════════════╝\n\n` +
                `👤 *Nama:* ${ctx.from.first_name}\n` +
                `🆔 *User ID:* \`${userId}\`\n` +
                `📛 *Username:* ${ctx.from.username ? '@' + ctx.from.username : '_(tanpa username)_'}\n\n` +
                `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
                `⚠️ *Reply pesan ini* untuk membalas user.\n` +
                `ID User: ${userId}`,
                { parse_mode: 'Markdown' }
            );

        } catch (error) {
            console.error('❌ Gagal meneruskan pesan:', error.message);
        }
    }

    // ── ADMIN MEMBALAS (REPLY) ──────────
    else if (userId === ADMIN_ID && ctx.message.reply_to_message) {
        try {
            const adminReplyText   = ctx.message.text;
            const repliedText      = ctx.message.reply_to_message.text || '';

            if (repliedText.includes('ID User:')) {
                // Ambil ID user dari baris notifikasi
                const targetUserId = repliedText
                    .split('\n')
                    .find(line => line.startsWith('ID User:'))
                    ?.replace('ID User:', '')
                    .trim();

                if (!targetUserId) {
                    return ctx.reply('⚠️ Tidak dapat menemukan ID user.');
                }

                await ctx.telegram.sendMessage(
                    targetUserId,
                    `╔══════════════════════╗\n` +
                    `║  👨‍💻  BALASAN ADMIN  ║\n` +
                    `╚══════════════════════╝\n\n` +
                    `${adminReplyText}\n\n` +
                    `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n` +
                    `_Balas pesan ini jika ada pertanyaan lagi_ 💬`,
                    { parse_mode: 'Markdown' }
                );

                // Konfirmasi ke admin
                await ctx.replyWithMarkdown(
                    `✅ *Pesan berhasil terkirim!*\n` +
                    `${LINE}\n` +
                    `📤 Dikirim ke ID: \`${targetUserId}\``
                );
            }

        } catch (err) {
            console.error('❌ Gagal kirim balasan admin:', err.message);
            await ctx.replyWithMarkdown(
                `❌ *Gagal mengirim pesan.*\n` +
                `${LINE}\n` +
                `_Kemungkinan user telah memblokir bot._`
            );
        }
    }
});

// ═══════════════════════════════════════
//  EXPORT UNTUK VERCEL
// ═══════════════════════════════════════
module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.handleUpdate(req.body);
        }
        res.status(200).send('✅ Bot is online');
    } catch (err) {
        console.error('❌ Webhook error:', err);
        res.status(500).send('Internal Server Error');
    }
};
