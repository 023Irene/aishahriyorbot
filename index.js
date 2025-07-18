// Загрузка переменных окружения
require('dotenv').config();

// Импорт библиотек
const { Bot, InlineKeyboard, Keyboard } = require('grammy');

// Инициализация бота
const bot = new Bot(process.env.BOT_TOKEN);

// Логирование апдейтов
bot.use(async (ctx, next) => {
  console.log('Update:', JSON.stringify(ctx.update, null, 2));
  await next();
});

// Установка команд
(async () => {
  try {
    await bot.api.setMyCommands([
      { command: 'start', description: 'Запустить бота' },
      { command: 'menu',  description: 'Открыть главное меню' },
      { command: 'help',  description: 'Справка и настройки' },
    ]);
    console.log('Команды установлены');
  } catch (err) {
    console.error('Ошибка установки команд:', err);
  }
})();

// Inline-кнопки видео и ссылки
const VIDEO_BUTTONS = new InlineKeyboard()
  .url('▶️ Видео в YouTube', 'https://youtu.be/your_video_id')
  .url('📢 Telegram-канал',  'https://t.me/your_channel').row()
  .webApp('🛠 Описание инструментов', 'https://example.com/tools')
  .webApp('📚 База знаний',         'https://example.com/knowledge').row()
  .url('🆘 Техподдержка',         'https://t.me/your_support');

// Reply-клавиатура главного меню
const MAIN_REPLY = new Keyboard()
  .webApp('👤 Профиль',         'https://example.com/profile').row()
  .text('🤖 GPTs/Claude/Gemini').text('🎙 Аудио с ИИ').row()
  .text('🎨 Дизайн с ИИ').text('🎬 Видео будущего').row()
  .text('📦 Хранитель изображений')
  .resized();

// /start — выбор языка
bot.command('start', async (ctx) => {
  await ctx.reply(
    `Приветствую в aishahriyorbot\n` +
    `Продолжая, вы соглашаетесь с условиями использования сервиса...\n\n` +
    `Пожалуйста, выберите язык:`,
    {
      reply_markup: new InlineKeyboard()
        .text('Русский 🇷🇺', 'lang_ru').row()
        .text('Узбекский 🇺🇿', 'lang_uz').row()
        .text('English 🇬🇧',   'lang_en').row()
        .text('Türkçe 🇹🇷',     'lang_tr').row()
        .text('Қазақша 🇰🇿',   'lang_kk')
    }
  );
});
