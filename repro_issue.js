
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

console.log("0 bytes:", formatSize(0));
try {
    console.log("Very large bytes (TB):", formatSize(1024 * 1024 * 1024 * 1024));
} catch (e) {
    console.log("Error TB:", e.message);
}

console.log("Undefined check:", formatSize(1024 * 1024 * 1024 * 1024)); 
