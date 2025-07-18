// index.js

// 1. Загрузка переменных окружения
require('dotenv').config();

// 2. Импорт библиотек
const { Bot, InlineKeyboard, Keyboard } = require('grammy');

// 3. Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

// 4. Логирование всех апдейтов
bot.use(async (ctx, next) => {
  console.log('Update:', JSON.stringify(ctx.update, null, 2));
  await next();
});

// 5. Установка команд (один раз при старте)
;(async () => {
  try {
    await bot.api.setMyCommands([
      { command: 'start', description: 'Запустить бота' },
      { command: 'menu',  description: 'Открыть главное меню' },
      { command: 'help',  description: 'Справка и настройки' },
    ]);
    console.log('Команды установлены');
  } catch (err) {
    if (err.error_code === 429) {
      console.warn('Слишком часто запрашиваем setMyCommands, пропускаем');
    } else {
      console.error('Ошибка установки команд:', err);
    }
  }
})();

// 6. Inline-кнопки для видео и ссылок
const VIDEO_BUTTONS = new InlineKeyboard()
  .url('▶️ Видео в YouTube',       'https://youtu.be/your_video_id')
  .url('📢 Telegram-канал',        'https://t.me/your_channel').row()
  .webApp('🛠 Описание инструментов','https://example.com/tools')
  .webApp('📚 База знаний',          'https://example.com/knowledge').row()
  .url('🆘 Техподдержка',            'https://t.me/your_support');

// 7. Reply-клавиатура главного меню
const MAIN_REPLY = new Keyboard()
  .webApp('👤 Профиль',             'https://example.com/profile').row()
  .text('🤖 GPTs/Claude/Gemini').text('🎙 Аудио с ИИ').row()
  .text('🎨 Дизайн с ИИ').text('🎬 Видео будущего').row()
  .text('📦 Хранитель изображений')
  .resized();

// 8. /start — выбор языка
bot.command('start', async (ctx) => {
  await ctx.reply(
    `Приветствую в aishahriyorbot\n` +
    `Продолжая, вы соглашаетесь с условиями использования сервиса...\n\n` +
    `Пожалуйста, выберите язык:`,
    {
      reply_markup: new InlineKeyboard()
        .text('Русский 🇷🇺', 'lang_ru').row()
        .text('Узбекский 🇺🇿','lang_uz').row()
        .text('English 🇬🇧',   'lang_en').row()
        .text('Türkçe 🇹🇷',     'lang_tr').row()
        .text('Қазақша 🇰🇿',   'lang_kk')
    }
  );
});

// 9. Обработка выбора языка
const LANG_DESCRIPTIONS = {
  lang_ru: `👆 В двух словах об основных инструментах чат-бота.\n\naishahriyorbot предоставляет доступ к более чем 100 ИИ-инструментам.\n\n👇 Подробное видео о том, как пользоваться чат-ботом и описание всех функций.`,
  lang_uz: `👆 Botning asosiy funktsiyalari haqida qisqacha.\n\naishahriyorbot 100+ AI asboblariga kirishni beradi.\n\n👇 Botdan foydalanish bo‘yicha to‘liq video va funksiyalar tavsifi.`,
  lang_en:`👆 A quick overview of the bot tools.\n\naishahriyorbot provides access to 100+ AI tools.\n\n👇 Detailed video on how to use the bot and features.`,
  lang_tr:`👆 Bot araçları hakkında kısa bilgi.\n\naishahriyorbot 100+ AI aracına erişim sağlar.\n\n👇 Botu nasıl kullanacağınız ve işlevleri gösteren detaylı video.`,
  lang_kk:`👆 Негізгі құралдар жайлы қысқаша.\n\naishahriyorbot 100+ AI құралына қол жеткізеді.\n\n👇 Ботты пайдалану және функциялар жайлы толық видео.`,
};

for (const [code, desc] of Object.entries(LANG_DESCRIPTIONS)) {
  bot.callbackQuery(code, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();   
    await ctx.reply(desc, { reply_markup: VIDEO_BUTTONS });
    await ctx.reply('Выберите раздел ниже:', { reply_markup: MAIN_REPLY });
  });
}

// 10. /menu — альтернативное главное меню (inline)
bot.command('menu', async (ctx) => {
  await ctx.reply('📋 Главное меню (inline):', {
    reply_markup: new InlineKeyboard()
      .text('🤖 GPTs/Claude/Gemini', 'menu_gpt')
      .text('🎙 Аудио с ИИ',         'menu_audio').row()
      .text('🎨 Дизайн с ИИ',        'menu_design')
      .text('🎬 Видео будущего',     'menu_video').row()
      .text('📦 Хранитель изображений','menu_images')
  });
});

// 11. Обработка callback-меню
bot.on('callback_query:data', async (ctx) => {
  const d = ctx.callbackQuery.data;
  await ctx.answerCallbackQuery();
  switch (d) {
    case 'menu_gpt':    return ctx.reply('Вы открыли раздел GPTs/Claude/Gemini');
    case 'menu_audio':  return ctx.reply('Вы открыли раздел Аудио с ИИ');
    case 'menu_design': return ctx.reply('Вы открыли раздел Дизайн с ИИ');
    case 'menu_video':  return ctx.reply('Вы открыли раздел Видео будущего');
    case 'menu_images': return ctx.reply('Вы открыли раздел Хранитель изображений');
    default:            return ctx.reply(`Неизвестная кнопка: ${d}`);
  }
});

// 12. Запуск бота
bot.start({
  onStart: info => console.log(`Бот запущен, @${info.username}`)
});
