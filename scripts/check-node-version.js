const major = parseInt(process.versions.node.split('.')[0], 10)

if (major > 20) {
  console.error('')
  console.error(`当前 Node ${process.version} 无法运行 Vue CLI 4（缺少 http_parser 模块）。`)
  console.error('请在 ad-admin-web 目录执行：')
  console.error('')
  console.error('  nvm use 18')
  console.error('  npm run serve')
  console.error('')
  process.exit(1)
}
