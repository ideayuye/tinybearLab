
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'main.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  plugins: [ uglify() ]
};

