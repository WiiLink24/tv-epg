const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

const file = {}

file.list = function (pattern) {
  return new Promise(resolve => {
    glob(pattern, function (err, files) {
      resolve(files)
    })
  })
}

file.getFilename = function (filepath) {
  return path.parse(filepath).name
}

file.createDir = async function (dir) {
  if (await file.exists(dir)) return

  return fs.mkdir(dir, { recursive: true }).catch(console.error)
}

file.exists = function (filepath) {
  return fs.exists(path.resolve(filepath))
}

file.existsSync = function (filepath) {
  return fs.existsSync(path.resolve(filepath))
}

file.read = function (filepath) {
  return fs.readFile(path.resolve(filepath), { encoding: 'utf8' }).catch(console.error)
}

file.append = function (filepath, data) {
  return fs.appendFile(path.resolve(filepath), data).catch(console.error)
}

file.create = function (filepath, data = '') {
  filepath = path.resolve(filepath)
  const dir = path.dirname(filepath)

  return file
    .createDir(dir)
    .then(() => file.write(filepath, data))
    .catch(console.error)
}

file.write = function (filepath, data = '') {
  return fs.writeFile(path.resolve(filepath), data, { encoding: 'utf8' }).catch(console.error)
}

file.writeSync = function (filepath, data = '') {
  return fs.writeFileSync(path.resolve(filepath), data, { encoding: 'utf8' })
}

file.clear = async function (filepath) {
  if (await file.exists(filepath)) return file.write(filepath, '')
  return true
}

file.resolve = function (filepath) {
  return path.resolve(filepath)
}

file.dirname = function (filepath) {
  return path.dirname(filepath)
}

file.basename = function (filepath) {
  return path.basename(filepath)
}

module.exports = file
