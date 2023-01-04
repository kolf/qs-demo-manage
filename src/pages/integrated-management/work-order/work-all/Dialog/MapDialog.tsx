import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { Grid, FormLabel, MenuItem, Box } from '@mui/material'
import Input from '@/components/Input'
import Dialog from '@/components/FormDialog'
import Message from '@/components/Message'
import Map from '@/components/Map'

function index({ onConfirm, data }, ref) {
  const mapRef = useRef(null)
  const rejectInputRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [formParams, setFormParams] = useState({
    lng: '',
    lat: '',
  })
  const [coordinates, setCoordinates] = useState([])

  useImperativeHandle(ref, () => ({
    handleOpen,
    handleClose,
  }))

  useEffect(() => {
    if (visible && data) {
      let list = data.split(',')
      let obj = {
        lng: list[0],
        lat: list[1],
      }
      setFormParams(obj)
    }
  }, [visible])

  useEffect(() => {
    setCoordinates([formParams.lat, formParams.lng])
  }, [JSON.stringify(formParams)])

  /* 打开弹出框 */
  const handleOpen = () => {
    setVisible(true)
  }
  /* 关闭弹出框 */
  const handleClose = () => {
    setFormParams({
      lng: '',
      lat: '',
    })
    setVisible(false)
  }
  /* 确定按钮 */
  const handleSubmit = () => {
    if (!formParams.lng || !formParams.lat) {
      Message({ content: '经纬度不能为空' })
      return
    }
    onConfirm(formParams)
    handleClose()
  }

  const handleInput = (e, type) => {
    formParams[type] = e.target.value
    setFormParams({ ...formParams })
  }

  /* 地图点击事件 */
  const handleMapClick = (e) => {
    formParams.lng = e.latlng.lng
    formParams.lat = e.latlng.lat
    setFormParams({ ...formParams })
  }

  return (
    <Dialog title="选择地址" open={visible} loadingBtn={false} onClose={handleClose} onSubmit={handleSubmit}>
      <Grid
        container
        spacing={{ xs: 1, md: 2, lg: 4 }}
        sx={{
          padding: '20px 0',
        }}
      >
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            经度
          </FormLabel>
          <Input
            value={formParams.lng}
            required
            size="small"
            placeholder="点击地图选择"
            // helperText={!input ? '驳回备注不能为空' : ''}
            autoComplete="off"
            onChange={(e) => handleInput(e, 'lng')}
            sx={{
              width: '80%',
            }}
            disabled
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={{ xs: 1, md: 2, lg: 4 }}
        sx={
          {
            // padding: '20px 0',
          }
        }
      >
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            维度
          </FormLabel>
          <Input
            value={formParams.lat}
            required
            size="small"
            placeholder="点击地图选择"
            // helperText={!input ? '驳回备注不能为空' : ''}
            autoComplete="off"
            onChange={(e) => handleInput(e, 'lat')}
            sx={{
              width: '80%',
            }}
            disabled
          />
        </Grid>
      </Grid>
      <Box
        style={{
          width: '500px',
          height: '400px',
          marginTop: '30px',
          marginBottom: '30px',
        }}
      >
        <Map ref={mapRef} onClick={handleMapClick} coordinates={coordinates} />
      </Box>
    </Dialog>
  )
}

export default forwardRef(index)
