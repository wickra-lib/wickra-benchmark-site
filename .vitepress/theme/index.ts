import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import Layout from './Layout.vue'
import InstallTabs from '../components/InstallTabs.vue'

// No WasmDemo and no BenchmarkBar. The sibling sites register both; this one
// has neither, because wickra-benchmark-wasm is not published yet (so a live
// demo would import nothing) and the benchmark page reports one measurement
// series rather than a field of competing libraries.
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('InstallTabs', InstallTabs)
  },
} satisfies Theme
