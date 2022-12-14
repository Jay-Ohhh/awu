
// 转换时间中一位至两位
function coverEachUnit(val: number) {
  return val < 10 ? '0' + val : val
}

// 获取当前时间
function getCurrentTime() {
  const date = new Date
  const yyyy = date.getFullYear()
  const MM = coverEachUnit(date.getMonth() + 1)
  const dd = coverEachUnit(date.getDate())
  const HH = coverEachUnit(date.getHours())
  const mm = coverEachUnit(date.getMinutes())
  const ss = coverEachUnit(date.getSeconds())
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}

export { getCurrentTime }

