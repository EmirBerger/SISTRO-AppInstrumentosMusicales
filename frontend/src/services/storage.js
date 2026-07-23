const STORAGE_URL = import.meta.env.VITE_STORAGE_URL

export function storageUrl(path) {
  if (!path) return null
  return `${STORAGE_URL}/${path}`
}
