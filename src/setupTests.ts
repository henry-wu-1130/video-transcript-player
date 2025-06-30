import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/test'

beforeAll(() => {
  // 啟動 MSW 服務器
  server.listen()
})

afterEach(() => {
  // 每次測試後重置處理程序，這樣它們就不會影響其他測試
  server.resetHandlers()
})

afterAll(() => {
  // 清理
  server.close()
})
