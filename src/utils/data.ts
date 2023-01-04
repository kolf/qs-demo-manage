// 云量数据
export function getCloudage() {
  const arr = []
  for (let i = 15; i >= 0; i--) {
    arr.push(i + '%')
  }
  return arr
}

// 获取geojson文件中多个多边形数据
export function getPolygonData(data, type = 'MultiPolygon') {
  let coordinatesArr
  if (type === 'MultiPolygon') {
    coordinatesArr = data[0]
  } else {
    coordinatesArr = [data]
  }
  console.log(coordinatesArr)
  const newCoordinatesArr = []
  for (let i = 0; i < coordinatesArr.length; i++) {
    console.log(coordinatesArr[i])
    newCoordinatesArr.push(reverseArray(coordinatesArr[i]))
  }
  return newCoordinatesArr
}

export function getPolygon(data, type = 'MultiPolygon') {
  let coordinatesArr
  if (type === 'MultiPolygon') {
    coordinatesArr = data[0]
  } else {
    coordinatesArr = data
  }
  console.log(coordinatesArr)
  const newCoordinatesArr = []
  for (let i = 0; i < coordinatesArr.length; i++) {
    console.log(coordinatesArr[i])
    newCoordinatesArr.push(reverseArray(coordinatesArr[i]))
  }
  return newCoordinatesArr
}

// 反转数组
function reverseArray(data) {
  console.log(data)
  const arr = []
  for (let i = 0; i < data.length; i++) {
    let newData
    if (data[i].length > 2) {
      newData = data[i].slice(0, 2)
    } else {
      newData = data[i]
    }
    arr.push(newData.reverse())
  }
  return arr
}

// 获取多边形的中心点
export function getCenter(pList) {
  let area = 0
  let x = 0
  let y = 0
  for (let i = 1; i <= pList.length; i++) {
    let lat = pList[i % pList.length][0]
    let lng = pList[i % pList.length][1]
    let nextLat = pList[i - 1][0]
    let nextLng = pList[i - 1][1]
    let temp = (lat * nextLng - lng * nextLat) / 2
    area += temp
    x += (temp * (lat + nextLat)) / 3
    y += (temp * (lng + nextLng)) / 3
  }
  x = x / area
  y = y / area
  return [x, y]
}
