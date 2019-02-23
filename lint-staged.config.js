module.exports = {
  linters: {
    '**/*.+(js|json|less|css|ts|tsx|md)': ['prettier --write', 'git add'],
  },
}
