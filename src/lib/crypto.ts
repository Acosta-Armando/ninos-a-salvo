import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from 'crypto'

const STRING_PREFIX = 'enc:v1:'
const PHOTO_MAGIC = Buffer.from('NAS1')
const ALGO = 'aes-256-gcm'
const IV_LEN = 12
const KEY_SALT = 'ninos-a-salvo-data-v1'

function getKey(): Buffer {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('Configura AUTH_SECRET para cifrar datos sensibles')
  }
  return scryptSync(secret, KEY_SALT, 32)
}

export function isEncryptedString(value: string): boolean {
  return value.startsWith(STRING_PREFIX)
}

/** Cifra texto con AES-256-GCM. Valores vacíos se guardan como null. */
export function encryptString(plain: string | null | undefined): string | null {
  if (plain == null) return null
  const trimmed = plain.trim()
  if (!trimmed) return null
  if (isEncryptedString(trimmed)) return trimmed

  const key = getKey()
  const iv = randomBytes(IV_LEN)
  const cipher = createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(trimmed, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const payload = Buffer.concat([iv, encrypted, tag])
  return `${STRING_PREFIX}${payload.toString('base64url')}`
}

/** Descifra texto; datos legacy en claro se devuelven tal cual. */
export function decryptString(stored: string | null | undefined): string | null {
  if (stored == null) return null
  const trimmed = stored.trim()
  if (!trimmed) return null
  if (!isEncryptedString(trimmed)) return stored

  const raw = Buffer.from(trimmed.slice(STRING_PREFIX.length), 'base64url')
  const iv = raw.subarray(0, IV_LEN)
  const tag = raw.subarray(raw.length - 16)
  const ciphertext = raw.subarray(IV_LEN, raw.length - 16)

  const key = getKey()
  const decipher = createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return decrypted.toString('utf8')
}

/** Cifra binario (fotos) con prefijo NAS1. */
export function encryptBuffer(data: Buffer): Buffer {
  const key = getKey()
  const iv = randomBytes(IV_LEN)
  const cipher = createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([PHOTO_MAGIC, iv, tag, encrypted])
}

/** Descifra binario; si no tiene prefijo NAS1, asume foto legacy sin cifrar. */
export function decryptBuffer(data: Buffer): Buffer {
  if (data.length < PHOTO_MAGIC.length + IV_LEN + 16 + 1) {
    return data
  }
  if (!data.subarray(0, PHOTO_MAGIC.length).equals(PHOTO_MAGIC)) {
    return data
  }

  let offset = PHOTO_MAGIC.length
  const iv = data.subarray(offset, offset + IV_LEN)
  offset += IV_LEN
  const tag = data.subarray(offset, offset + 16)
  offset += 16
  const ciphertext = data.subarray(offset)

  const key = getKey()
  const decipher = createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()])
}

function normalizeSearchWords(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((word) => word.length >= 2)
}

function searchToken(word: string): string {
  return createHmac('sha256', getKey()).update(`search:${word}`).digest('hex')
}

/** Tokens HMAC para búsqueda por nombre sin guardar texto en claro indexable. */
export function buildIdentitySearchTokens(fields: (string | null | undefined)[]): string[] {
  const tokens = new Set<string>()
  for (const field of fields) {
    if (!field?.trim()) continue
    for (const word of normalizeSearchWords(field)) {
      tokens.add(searchToken(word))
    }
  }
  return [...tokens]
}

export function queryToSearchTokens(query: string): string[] {
  return normalizeSearchWords(query).map(searchToken)
}

/** Hash del token de gestión del dispositivo (cerrar registro en mis-registros). */
export function hashManageToken(token: string): string {
  return createHmac('sha256', getKey()).update(`manage:${token}`).digest('hex')
}

export function verifyManageToken(token: string, storedHash: string | null | undefined): boolean {
  if (!token?.trim() || !storedHash) return false
  return hashManageToken(token.trim()) === storedHash
}
