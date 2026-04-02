export function readFileSync() {
  return ''
}

export function writeFileSync() {}

export function existsSync() {
  return false
}

export function createReadStream() {
  return null
}

export function createWriteStream() {
  return null
}

export default {
  readFileSync,
  writeFileSync,
  existsSync,
  createReadStream,
  createWriteStream,
}
