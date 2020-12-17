const { T elegraf } = require('telegraf')
const BOT_TOKEN = '1483774003:AAEwdBHg4cIOG_EiivpOG0t8G3R8I8iCzNM';
const bot = new Telegraf(BOT_TOKEN)
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const menuTemplate = new MenuTemplate(ctx => `Hey ${ctx.from.first_name}!`)



// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('modern', ({ reply }) => reply('Yo'))
// bot.command('hipster', Telegraf.reply('λ'))


menuTemplate.interact('I am excited!', 'a', {
  do: async ctx => ctx.reply('As am I!')
})

const menuMiddleware = new MenuMiddleware('/', menuTemplate)
bot.command('start', ctx => menuMiddleware.replyToContext(ctx))
bot.use(menuMiddleware)




bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})
bot.start((ctx) => {
  throw new Error('Example error')
})

bot.launch()

