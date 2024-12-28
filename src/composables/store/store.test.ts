// import { beforeEach, describe, expect, it, vi } from 'vitest'
// import { useElectronStore } from './index'
// import { store } from './store'

// vi.mock('./store', () => {
//   return { store: { get: vi.fn(), set: vi.fn() } }
// })

// describe('useElectronStore', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('should return default value when no stored value exists', () => {
//     const defaultValue = 'default'

//     const value = useElectronStore('testKey', defaultValue)
//     expect(value.value).toBe(defaultValue)
//   })

//   it('should return stored value when it exists', () => {
//     const storedValue = 'stored'
//     vi.mocked(store.get).mockReturnValue(storedValue)

//     const value = useElectronStore('testKey', 'default')
//     expect(value.value).toBe(storedValue)
//   })

//   it('should update store when value changes', async () => {
//     const newValue = 'new value'
//     const value = useElectronStore('testKey', 'default')

//     value.value = newValue

//     // 由于watchEffect是异步的，需要等待下一个tick
//     await nextTick()
//     expect(store.set).toHaveBeenCalledWith('testKey', newValue)
//   })
// })
