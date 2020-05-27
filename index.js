const Koa = require("koa")
const {getLogger, configure} = require("log4js")
const app = new Koa()
const logger = getLogger("http")
logger.level = 'info'

app.use(async (ctx, next) => {
    try {
        const start = Date.now();
        logger.info(`<-- ${ctx.method} ${ctx.url}`);
        await next();
        logger.info(`--> ${ctx.method} ${ctx.url} ${ctx.status} ${Date.now() - start}ms`);
    } catch (e) {
        throw e;
    }
})

app.use((ctx) => ctx.body = { error : "nothing odd occurs" })

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        ctx.status = e.status || 500;
        ctx.body = { error: e.message };
        if (e.expose) {
            ctx.body = e;
        }
        ctx.app.emit("error", e, ctx);
    }
})

app.on("error", (e) => {
    getLogger("error").error(e);
});

module.exports = app
