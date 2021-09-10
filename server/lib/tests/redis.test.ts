import { describe, expect, it, afterAll } from "@jest/globals"
import path from 'path'
import Redis from '../databases/redis'

const redis = new Redis(path.resolve('./configs/db'))

describe('Redis', () => {
  describe('#connect()', () => {
    it('should connect succeed, no exception throw out', async () => {
      await expect(redis.connect()).resolves.not.toThrow()
    })
  })

  describe('#use()', () => {
    it('should use succeed, no exception throw out', async () => {
      await expect(redis.use('0')).resolves.not.toThrow()
    })
  })

  describe('#set(key, value, options)', () => {
    it('should set succeed, and will get success at next test block', async () => {
      const res = await redis.set('test', { abcd: 1234 })
      expect(res.abcd).toBe(1234)
    })
  })

  describe('#has(key)', () => {
    it('should has succeed, and will return true', async () => {
      const res = await redis.has('test')
      expect(res).toBeTruthy()
    })
  })

  describe('#get(key)', () => {
    it('should get succeed, and will return value that set at former block', async () => {
      const res = await redis.get('test')
      expect(parseInt(res.abcd)).toBe(1234)
    })
  })

  describe('#len()', () => {
    it('should access succeed, and will return length 1', async () => {
      const res = await redis.len()
      expect(res).toBe(1)
    })
  })

  describe('#set(key, value, { expSeconds: 3 }); setTimeout(has, 3000)', () => {
    it('should set succeed, then wait 3 seconds and will find key disappeared', async () => {
      await redis.set('test-expire', { abc: true }, { expSeconds: 3 })
      setTimeout(async () => {
        await expect(redis.has('test-expire')).resolves.toBeFalsy()
      }, 3100)
    })
  })
})

afterAll(async () => {

})
