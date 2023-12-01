import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        character_creation: resolve(
          __dirname,
          'src/character_creation/index.html',
        ),
        shop: resolve(__dirname, 'src/shop/index.html'),
        world_map: resolve(__dirname, 'src/world_map/index.html'),
        battle: resolve(__dirname, 'src/battle/index.html'),
        game_over: resolve(__dirname, 'src/game_over/index.html'),
      },
    },
  },
});
