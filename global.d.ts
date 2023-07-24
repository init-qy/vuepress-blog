type ValueOf<T> = T[keyof T];

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}
interface Window {
  Module: any,
  HEAPU8: any,
  _malloc: Function,
  _free: Function,
  _process_image: Function,
}
