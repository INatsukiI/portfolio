import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// globals: false のとき RTL は afterEach を自動検出できないので明示的に呼ぶ
afterEach(() => {
  cleanup()
})
