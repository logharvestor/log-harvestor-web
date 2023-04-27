import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    splitting: false,
    bundle: true,
    treeshake: true,
    minify: 'terser',
    format: ['cjs', 'esm', 'iife'],
    dts: true,
    terserOptions: {
        compress: {
            drop_console: false,
        },
    }
})