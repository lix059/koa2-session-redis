const Store = require('./libs/RedisStore.js');

module.exports = (opts = {}) => {
    const { key = "koa:sid", resave = false } = opts;
    const store = new Store(opts.redisCofig)

    return async (ctx, next) => {
        let id = ctx.cookies.get(key, opts);

        if(!id) {
            ctx.session = {};
        } else {
            ctx.session = await store.get(id);
            // check session must be a no-null object
            if(typeof ctx.session !== "object" || ctx.session == null) {
                ctx.session = {};
            }
        }

        const old = JSON.stringify(ctx.session);

        await next();

        if(!resave) {
            // if not changed
            if(old === JSON.stringify(ctx.session)) return;
        }

        // if is an empty object
        if(ctx.session instanceof Object && !Object.keys(ctx.session).length) {
            ctx.session = null;
        } 

        // need clear old session
        if(id && !ctx.session) {
            await store.destroy(id);
            return;
        }

        let sid;
        if(resave) {
            if(id) {
                await store.destroy(id)
            }
            sid = await store.set(ctx.session, opts);
        } else {
            // set/update session
            if(id) {
                sid = await store.setOld(ctx.session, id);
                if(!sid) {
                   sid = await store.set(ctx.session, opts);
                }
            } else {
                sid = await store.set(ctx.session, opts);
            }
        }
        if(!sid) {
            ctx.cookies.set(key, '', opts);
        } else {
            ctx.cookies.set(key, sid, opts);
        }
        
    }
}

// Reeexport Store to not use reference to internal files
module.exports.Store = Store;
