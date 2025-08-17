module.exports = {
  process(src, filename, config, options) {
    return `
// a jest transform begin
require.extensions = {'.js': function() {}, '.ts': function() {}};
// end jest transform
${src}
    `
  },
}