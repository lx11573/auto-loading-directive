<!--
 * @Author: lyu
 * @Date: 2022-08-10 16:57:21
-->
<h1 align="center"><samp>Auto Loading Directive</samp></h1>

<p align="center">
  <samp>一个 vue3的 点击事件防重指令</samp>
</p>

## 安装

```bash
# npm
npm i auto-loading-directive
# pnpm
pnpm add auto-loading-directive
```

## 使用

```ts
// 在 main.js 中引入并使用
import { autoLoadingDirective } from 'auto-loading-directive'

autoLoadingDirective(app: App, directiveName?: string)

```
> 所有组件、原生按钮以及标签等都可以使用此指令进行点击防重
```html
<!-- 组件内 -->
<script setup lang='ts'>
function handleClick(e: MouseEvent): Promise<boolean>{
	return api.request().then(response => {
		...something
		// 返回 true 结束防重
		return true
	})
}
function handleClick(e: MouseEvent): boolean {
	...something
	// 返回 true 结束防重
	return true
}
function handleClick(e: MouseEvent, close: () => void): void {
	...something
	// 调用回调函数结束防重
	close()
}
</script>
<template>
	<!-- element-plus -->
	<el-button v-auto-loading="handleClick">提交</el-button>
	<!-- naive-ui -->
	<n-button v-auto-loading="handleClick">提交</n-button>
	<!-- 自定义按钮 -->
	<custom-button v-auto-loading="handleClick">提交</custom-button>
	<!-- 原生按钮 -->
	<button v-auto-loading="handleClick">提交</button>
	<!-- input 按钮 -->
	<input v-auto-loading="handleClick" type="button" value="提交"	/>
	<!-- 标签 -->
	<div v-auto-loading="handleClick">提交</div>
</template>
```
## 自定义组件
- 当使用自定义组件时，组件需实现 disabled/loading 逻辑，同时需提供 disabled/loading 任其一 props，以供指令使用

## 自动防重
- 指令会根据传入函数的返回值以及回调函数来自动停止防重
- 如果返回值不为 true， 或者 Promise.resolve() 不为 true，则需要自行调用回调函数来停止防重


> 当使用该指令时，原始 click 事件将无法触发
## License

[MIT](./LICENSE) License © 2022 [Owner](https://github.com/lx11573)