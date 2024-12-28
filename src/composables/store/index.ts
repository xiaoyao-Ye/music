// import { store } from './store'

// export function useElectronStore<T>(key: string, defaultValue: T): Ref<T> {
//   const defaultVal = store.get(key) ?? defaultValue
//   // 创建响应式引用
//   const value = ref<T>(defaultVal) as Ref<T>

//   // 监听值的变化并同步到 electron-store
//   watchEffect(() => {
//     store.set(key, JSON.parse(JSON.stringify(value.value)))
//   })

//   return value
// }
