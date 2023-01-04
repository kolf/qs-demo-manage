import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import L from 'leaflet'
import { Box } from '@mui/material'
import { MapContainer, TileLayer, useMap, Polygon, WMSTileLayer, Marker } from 'react-leaflet'
// import WMTSTileLayer from 'react-leaflet-wmts'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
// import * as turf from '@turf/turf'
import { getPolygonData, getCenter } from '@/utils/data'
import 'leaflet/dist/leaflet.css'
import mapImg from '@/assets/image/png/map_icon.png'
import iconImg from '@/assets/image/png/point_default.png'

import './map.scss'

let drawPolygon = null

/* 图标 */
function Icon(iconUrl, iconSize) {
  return L.icon({
    iconUrl: iconUrl,
    // iconSize: [40, 30],
    popupAnchor: [0, -20],
    iconSize: iconSize,
  })
}

/**  map组件  **/
function index(
  {
    geojson,
    onChangeUploadGeometry,
    scaleVisivle = true,
    onDrawSuccess,
    polygon,
    onManualRemove,
    onClick,
    coordinates,
  }: {
    geojson?: any
    onChangeUploadGeometry?: Function
    scaleVisivle?: boolean
    onDrawSuccess?: Function
    polygon?: {
      topLeft: { lon: ''; lat: '' }
      bottomRight: { lon: ''; lat: '' }
    }
    onManualRemove?: Function
    onClick?: Function
    coordinates
  },
  ref
) {
  const map = useRef(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const [optionsData, setOptionsData] = useState({})
  let [geometry, setGeometry] = useState(null)
  let [checkedGeometry, setCheckedGeometry] = useState(null)
  const [center, setCenter] = useState<any>([30.349316023833918, 120.28083281758097])
  // 标尺
  const [scaleValue, setScaleValue] = useState('')
  let [disableBtn, setDisableBtn] = useState(true)
  // let [drawPolygon, setDrawPolygon] = useState(null)
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    // 获取画图的内容
    getRectangles,
    // 添加图层
    addLayer,
    // 删除指定图层
    removeLayer,
    // 清空图层
    clearLayers,
    // 显示隐藏控件
    toggleControls,
    // 自定义启用控件   Clear / Rectangle / Polygon / Edit
    ControlBtn,
    // 删除已上传的多边形
    deleteUploadGeometry,
    // 操控部分
    disableGlobal,
    enableGlobal,
  }))

  /* 初始化  */
  useEffect(() => {
    setTimeout(() => {
      if (map.current) {
        map.current.on('click', (e) => {
          onClick(e)
        })
        // 画图工具
        draw()
        // 标尺
        Scale()
      }
    }, 0)
  }, [])

  /* 监听多边形改变 */
  useEffect(() => {
    if (polygon && polygon.topLeft) {
      clearLayers()
      let left = polygon.topLeft.lon
      let top = polygon.topLeft.lat
      let right = polygon.bottomRight.lon
      let bottom = polygon.bottomRight.lat
      let latlngs = [
        [top, left],
        [top, right],
        [bottom, right],
        [bottom, left],
        [top, left],
      ]
      let polygonLatlngs = L.polygon(latlngs, { color: 'red' }).addTo(map.current)
      map.current.fitBounds(polygonLatlngs.getBounds())
      setCenter(getCenter(polygonLatlngs))
    }
  }, [polygon])

  /* 标尺 */
  function Scale() {
    // 添加标尺控件
    let scale = L.control.scale()
    map.current.addControl(scale)
    scale.getContainer().style.display = 'none'
    setScaleValue(scale.getContainer().childNodes[0].innerText)
    // 监听缩放
    map.current.on('zoomend', (e) => {
      setScaleValue(scale.getContainer().childNodes[0].innerText)
      //获取当前放大或者缩小的等级
      console.log(e.target.getZoom())
    })
    // 监听移动
    map.current.on('move', (e) => {
      setScaleValue(scale.getContainer().childNodes[0].innerText)
    })
  }
  /* 删除图层工具按钮触发 监听删除Polygon (因为做删除事件的时候传入的值始终是初始值) */
  useEffect(() => {
    // 删除
    if (geometry && geometry.length > 0) {
      for (let i = 0; i < geometry.length; i++) {
        if (geometry[i]._leaflet_id === checkedGeometry.layer._leaflet_id) {
          geometry.splice(i, 1)
          break
        }
      }
      setGeometry([...geometry])
      onChangeUploadGeometry(geometry)
    }
  }, [checkedGeometry])

  /* 操控禁用 */
  function disableGlobal() {
    setDisableBtn(false)
    map.current.pm.disableGlobalEditMode()
    map.current.pm.disableGlobalRemovalMode()
  }
  /* 操控启用 */
  function enableGlobal() {
    setDisableBtn(true)
  }
  /* 监听geojson变化 */
  useEffect(() => {
    if (map.current) {
      if (drawPolygon) {
        removeLayer(drawPolygon.layer)
        drawPolygon = null
      }
      deleteUploadGeometry()
      const newUploadGeometry = []
      for (let i = 0; i < geojson.length; i++) {
        const latlngs = getPolygonData(JSON.parse(geojson[i].coordinates), geojson[i].type)
        for (let i = 0; i < latlngs.length; i++) {
          // 添加多边形
          const polygon = addLayer(latlngs[i], '#aebde8')
          // 定位边界位置
          map.current.fitBounds(polygon.getBounds())
          // 存储上传的图形
          newUploadGeometry.push(polygon)
          // 编辑时触发
          polygon.on('pm:edit', (e) => {
            onDrawSuccess('upload')
          })
          // 中心点
          if (i === latlngs.length - 1) {
            setCenter(getCenter(latlngs[i]))
          }
        }
      }
      setGeometry(newUploadGeometry)
      // 绘制成功

      onDrawSuccess('upload')
    }
  }, [geojson])

  /* 删除已上传文件 */
  function deleteUploadGeometry() {
    console.log(111)
    // 移除覆盖上传
    if (geometry && geometry.length > 0) {
      for (let i = 0; i < geometry.length; i++) {
        map.current.removeLayer(geometry[i])
      }
      // 清空
      setGeometry([])
    }
  }

  /* 获取全部多边形的最小矩形 */
  function getRectangles() {
    // const layers = map.current._layers
    // const boundsArray = []
    // const multiPolygon = []
    // for (let i in layers) {
    //   if (layers[i]._latlngs) {
    //     const bounds = layers[i].getBounds()
    //     const newBounds = [bounds.getNorthEast(), bounds.getSouthWest()]
    //     boundsArray.push(newBounds)
    //     const latlng = layers[i]._latlngs[0]
    //     let polygon = []
    //     for (let j = 0; j < latlng.length; j++) {
    //       polygon.push([latlng[j].lat, latlng[j].lng])
    //     }
    //     multiPolygon.push(polygon)
    //   }
    // }
    // // 转为geojson
    // let multiPoly
    // if (multiPolygon.length > 0) {
    //   if (multiPolygon.length > 1) {
    //     multiPoly = turf.multiPolygon([multiPolygon])
    //   } else {
    //     // 一个多边形需要加个结束点
    //     multiPolygon[0].push(multiPolygon[0][0])
    //     multiPoly = turf.polygon(multiPolygon, { name: 'poly1' })
    //   }
    // }
    // // 获取最小矩形
    // let arr = []
    // let topLeft = null
    // let bottomRight = null
    // if (boundsArray.length > 0) {
    //   for (let i = 0; i < boundsArray.length; i++) {
    //     for (let j = 0; j < boundsArray[i].length; j++) {
    //       arr.push([boundsArray[i][j].lat, boundsArray[i][j].lng])
    //     }
    //   }
    //   let line = turf.lineString(arr)
    //   let bbox = turf.bbox(line)
    //   topLeft = {
    //     lat: bbox[2],
    //     lon: bbox[1],
    //   }
    //   bottomRight = {
    //     lat: bbox[0],
    //     lon: bbox[3],
    //   }
    // }
    // // 转经纬度
    // if (multiPoly) {
    //   multiPoly = turf.flip(multiPoly)
    // }
    // return { multiPoly, topLeft, bottomRight }
  }

  /* 绘制多边形 */
  const draw = () => {
    const mapDom = map.current
    // 设置绘制后的线条颜色等
    mapDom.pm.setPathOptions({
      color: '#aebde8',
      fillColor: '#aebde8',
      fillOpacity: 0.6,
      tooltips: false,
    })
    mapDom.pm.tooltips = false

    // 隐藏控件
    // mapDom.pm.addControls({
    //   // position: 'bottomright',
    //   position: 'topleft',
    //   drawMarker: false, // 绘制标记
    //   drawCircle: false, // 绘制圆形
    //   drawPolyline: false, // 绘制折线
    //   drawRectangle: true, // 绘制矩形
    //   drawPolygon: true, // only五级网格绘制
    //   drawCircleMarker: false, // 绘制圆形标记
    //   removalMode: true, // 清除图层
    //   cutPolygon: false, // 删除图层里的部分内容
    //   editMode: true, // 编辑多边形
    //   dragMode: false, // 拖动多边形
    //   rotateMode: false,
    //   drawText: false,
    // })
    // 点击控件时调用
    mapDom.on('pm:drawstart', (e) => {
      console.log(e, '点击控件绘制时调用')
    })
    // 绘制完成时调用
    mapDom.on('pm:create', (e) => {
      // 清空上传的文件
      deleteUploadGeometry()
      // 清空上一次画的矩形
      if (drawPolygon) {
        removeLayer(drawPolygon.layer)
      }
      drawPolygon = e
      // 编辑时触发
      drawPolygon.layer.on('pm:edit', (e) => {
        onDrawSuccess('draw')
      })
      // 绘制成功
      onDrawSuccess('draw')
    })
    // 删除图层时调用
    mapDom.on('pm:remove', (e) => {
      console.log(e, '清除图层时调用')
      setCheckedGeometry(e)
      onManualRemove()
    })
  }

  /* 地图控件按钮自定义启用 */
  function ControlBtn(type) {
    if (map.current) {
      switch (type) {
        case 'Clear':
          if (disableBtn) {
            map.current.pm.enableGlobalRemovalMode()
          }
          break
        case 'Rectangle':
          map.current.pm.enableDraw('Rectangle')
          break
        case 'Polygon':
          map.current.pm.enableDraw('Polygon')
          break
        case 'Edit':
          if (disableBtn) {
            map.current.pm.enableGlobalEditMode()
          }
          break
      }
    }
  }

  /* 添加多边形图层 */
  function addLayer(latlngs, color) {
    let polygon
    polygon = L.polygon(latlngs, {
      color,
    }).addTo(map.current)

    // var southWest = map.current.unproject([0, 10], map.current.getMaxZoom() - 1)
    // var northEast = map.current.unproject([10, 0], map.current.getMaxZoom() - 1)
    // var bounds = new L.LatLngBounds(southWest, northEast)
    // L.imageOverlay(mapImg, bounds).addTo(map)

    console.log(latlngs)
    // let multiPoly = turf.flip(aa)
    // let line = turf.lineString(latlngs)
    // let bbox = turf.bbox(multiPoly)
    // console.log(bbox)
    //  let  topLeft = {
    //     lat: bbox[2],
    //     lon: bbox[1],
    //   }
    // let  bottomRight = {
    //     lat: bbox[0],
    //     lon: bbox[3],
    //   }

    return polygon
  }

  /* 删除多边形图层 */
  function removeLayer(layer) {
    map.current.removeLayer(layer)
  }

  /* 清除所有图层 */
  function clearLayers() {
    const layers = map.current._layers
    console.log(layers)
    for (let i in layers) {
      if (layers[i]._latlngs) {
        map.current.removeLayer(layers[i])
      }
    }
  }

  // 控件是否可见
  const toggleControls = (value) => {
    if (map.current) {
      map.current.pm.toggleControls(value)
    }
  }
  return (
    <>
      <MapContainer
        ref={map}
        // @ts-ignore
        center={center}
        zoom={15}
        minZoom={3}
        maxZoom={18}
        zoomControl={false}
        attributionControl={false}
        className="map-container"
      >
        <TileLayer
          ref={tileLayerRef}
          url="http://t0.tianditu.com/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=5e77b8e24c935ea880079bdede600cf8"
        />

        <TileLayer url="http://t0.tianditu.com/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=5e77b8e24c935ea880079bdede600cf8" />

        <Marker
          // draggable={false}
          // eventHandlers={{
          //   mouseover: handleDangerLevelPointMouseover,
          //   mouseout: handleDangerLevelPointMouseout,
          //   click: (e) => handleMarkerClick(e, 'waterlogging', item),
          // }}
          position={coordinates as any}
          // @ts-ignore
          icon={Icon(iconImg, [25, 20]) as any}
        >
          {/* <Popup minWidth={90} closeButton={false} className="marker_popup">
            <span>{item.title}</span>
          </Popup> */}
        </Marker>
        <Box
          className="scaleplate"
          sx={{
            display: !scaleVisivle ? 'none' : '',
          }}
        >
          <span>{scaleValue}</span>
          <i className="scaleplate-scale"></i>
        </Box>
      </MapContainer>
    </>
  )
}

export default forwardRef(index)
