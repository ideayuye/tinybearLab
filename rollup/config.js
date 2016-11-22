
import uglify from 'rollup-plugin-uglify';
import alias from 'rollup-plugin-alias';
import path from 'path';

export default {
  entry: 'main.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  plugins: [ 
    alias({
      libs: path.resolve(__dirname, './libs')
    }),
    uglify()
  ],
};

