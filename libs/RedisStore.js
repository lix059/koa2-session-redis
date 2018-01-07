const Redis = require('ioredis')
const { randomBytes } = require('crypto');

class RedisStore {
  constructor (redisConfig) {
    this.redis = new Redis(redisConfig)
  }

  getID(length) {
      return randomBytes(length).toString('hex');
  }

  async get (sid) {
    let data = await this.redis.get(`SESSION:${sid}`)
    return JSON.parse(data)
  }

  async set (session, { sid = this.getID(24), maxAge = 1000000 } = {}) {
    try {
        // Use redis set EX to automatically drop expired sessions
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000)
    } catch (e) {}
    return sid
  }

  async setOld (session, sid) {
    try {
      let ttl = await this.redis.ttl(`SESSION:${sid}`)
      if(ttl === -2) {
        return ''
      }
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', ttl)
    } catch (e) {}
    return sid
  }

  async destroy (sid) {
    return await this.redis.del(`SESSION:${sid}`)
  }
}

module.exports = RedisStore
