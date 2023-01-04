import React, { useEffect, useState, useRef, RefObject } from 'react'
import { TextField, MenuItem, Stack, Grid, FormLabel, Box, Menu } from '@mui/material'
import Button, { LoadingButton } from '@/components/Button'
import Input from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import DatePicker from '@/components/DatePicker'
// import { workLevelList, workStateList } from '../../work-all/SearchBar/data'
import { styled } from '@mui/material/styles'
import '@/components/SearchBar/style.scss'

export interface FormParams {
  warningCode: string
  currentName: string
  startTime: Date | null
  endTime: Date | null
  warningState: number
  warningLeve: number
}

// 预警等级
let warningLevelList = ['一般', '紧急', '非常紧急']
// 预警状态
let warningStateList = ['未指派', '处理中', '已关闭']

export default function SearchBar({ onSubmit, onBack }: { onSubmit?: Function; onBack?: Function }) {
  const [formParams, setFormParams] = useState<FormParams>({
    warningCode: '',
    currentName: '',
    startTime: null,
    endTime: null,
    warningState: 0,
    warningLeve: 0,
  })
  const [open, setOpen] = useState<{ start: boolean; end: boolean }>({ start: false, end: false })
  // 初始化
  useEffect(() => {}, [])

  const handleInputChange = (e, type) => {
    formParams[type] = e.target.value
    setFormParams({ ...formParams })
  }

  // 提交按钮
  const handleSubmit = () => {
    ;(onSubmit as Function)(formParams)
  }

  // 返回按钮
  const handleBack = () => {
    onBack()
  }

  //重置按钮
  const handleReset = () => {
    setFormParams({
      warningCode: '',
      currentName: '',
      startTime: null,
      endTime: null,
      warningState: 0,
      warningLeve: 0,
    })
  }

  // 时间选择器
  const handleDate = (value: Date, type: number) => {
    if (type === 1) {
      formParams.startTime = value
    } else {
      formParams.endTime = value
    }
    setFormParams({ ...formParams })
  }

  // 时间选择器获取焦点事件
  const handleFocus = (type: number) => {
    if (type === 1) {
      setOpen({ start: true, end: false })
    } else {
      setOpen({ start: false, end: true })
    }
  }
  return (
    <>
      <Grid
        container
        spacing={{ xs: 1, md: 2, lg: 4 }}
        sx={{
          padding: '20px 0',
        }}
      >
        <Grid item xs={3} className="from-item">
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 预警编号
          </FormLabel>
          <Input
            required
            id="phoneInput"
            size="small"
            placeholder="预警标题"
            value={formParams.warningCode}
            onChange={(e) => handleInputChange(e, 'warningCode')}
            autoComplete="off"
            sx={{
              width: '40%',
            }}
          />
        </Grid>
        <Grid item xs={3} className="from-item">
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 当前处理人
          </FormLabel>
          <Input
            required
            id="phoneInput"
            size="small"
            placeholder="当前处理人"
            value={formParams.currentName}
            onChange={(e) => handleInputChange(e, 'currentName')}
            autoComplete="off"
            sx={{
              width: '40%',
            }}
          />
        </Grid>
        <Grid item xs={3} className="from-item">
          <FormLabel
            component="span"
            className="label"
            sx={{
              minWidth: '100px',
            }}
          >
            <SvgIcon svgName="gather_date" svgClass="icon"></SvgIcon> 创建时间
          </FormLabel>
          <Stack direction="row" className="data-box">
            <DatePicker
              open={open.start}
              value={formParams.startTime}
              onChange={(value: Date) => handleDate(value as Date, 1)}
              maxDate={formParams.endTime ? new Date(formParams.endTime) : ''}
              onFocus={() => handleFocus(1)}
              placeholder="起始时间"
              className="hidden-icon"
              onClose={() => {
                setOpen({ start: false, end: false })
              }}
            ></DatePicker>
            <SvgIcon svgName="date_icon" svgClass="icon"></SvgIcon>
            <DatePicker
              open={open.end}
              value={formParams.endTime}
              onChange={(value: Date) => handleDate(value as Date, 2)}
              minDate={formParams.startTime ? new Date(formParams.startTime) : ''}
              onFocus={() => handleFocus(2)}
              placeholder="截止时间"
              className="end hidden-icon"
              onClose={() => {
                setOpen({ start: false, end: false })
              }}
            ></DatePicker>
          </Stack>
        </Grid>

        <Grid item xs={3} className="from-item">
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 预警状态
          </FormLabel>
          <Input
            select
            placeholder="预警状态"
            autoComplete="off"
            value={formParams.warningState}
            onChange={(e) => handleInputChange(e, 'warningState')}
            size="small"
            sx={{
              width: '40%',
            }}
          >
            {warningStateList.map((state, index) => (
              <MenuItem key={index} value={index}>
                {state}
              </MenuItem>
            ))}
          </Input>
        </Grid>
        {/* <Grid item xs={3} className="from-item"></Grid> */}
        <Grid item xs={3} className="from-item">
          <Stack
            direction="row"
            className="btn-bar"
            sx={{
              maxWidth: '250px !important',
            }}
            spacing={1}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<SvgIcon svgName="reset_icon" svgClass="icon"></SvgIcon>}
            >
              重置
            </Button>
            <Button
              onClick={() => handleSubmit()}
              startIcon={<SvgIcon svgName="search_icon" svgClass="icon"></SvgIcon>}
            >
              搜索
            </Button>

            <Button onClick={() => handleBack()} startIcon={<SvgIcon svgName="search_icon" svgClass="icon"></SvgIcon>}>
              返回
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
