import React, { useEffect, useState, useRef, RefObject, useImperativeHandle, forwardRef } from 'react'
import { TextField, MenuItem, Stack, Grid, FormLabel, Box, Menu } from '@mui/material'
import Button, { LoadingButton } from '@/components/Button'
import Input from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import DatePicker from '@/components/DatePicker'
import { workLevelList, workStateList } from './data'
import { getUserInfo } from '@/utils/auth'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import '@/components/SearchBar/style.scss'

export interface FormParams {
  workCode: string
  currentName: string
  startTime: Date | null
  endTime: Date | null
  createName: string
  workLeve: number | null
  workState: number | null
  startTimeLong?: number | null
  endTimeLong?: number | null
}

function SearchBar(
  {
    onSubmit,
    onAdd,
    onBack,
    onReset,
  }: {
    onSubmit?: Function
    onAdd?: Function
    onBack?: Function
    onReset?: Function
  },
  ref
) {
  const [formParams, setFormParams] = useState<FormParams>({
    workCode: '',
    currentName: '',
    createName: '',
    startTime: null,
    endTime: null,
    workLeve: -1,
    workState: -1,
  })
  const [open, setOpen] = useState<{ start: boolean; end: boolean }>({ start: false, end: false })
  // 初始化
  useEffect(() => {}, [])

  useImperativeHandle(ref, () => ({
    handleReset,
  }))

  const handleInputChange = (e, type) => {
    formParams[type] = e.target.value

    setFormParams({ ...formParams })
  }

  // 提交按钮
  const handleSubmit = () => {
    ;(onSubmit as Function)(formParams)
  }

  // 新增按钮
  const handleAdd = () => {
    onAdd()
  }

  // 返回按钮
  const handleBack = () => {
    onBack()
  }

  //重置按钮
  const handleReset = () => {
    setFormParams({
      workCode: '',
      currentName: '',
      startTime: null,
      endTime: null,
      createName: '',
      workLeve: -1,
      workState: -1,
    })
    onReset({
      workCode: '',
      currentName: '',
      startTime: null,
      endTime: null,
      createName: '',
      workLeve: -1,
      workState: -1,
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
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 工单编号
          </FormLabel>
          <Input
            required
            id="dataInput"
            size="small"
            placeholder="请输入工单编号"
            value={formParams.workCode}
            onChange={(e) => handleInputChange(e, 'workCode')}
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
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 工单类型
          </FormLabel>
          <Input
            select
            placeholder="工单类型"
            autoComplete="off"
            value={formParams.workLeve}
            onChange={(e) => handleInputChange(e, 'workLeve')}
            size="small"
            sx={{
              width: '40%',
            }}
          >
            <MenuItem key={-1} value={-1}>
              {'全部'}
            </MenuItem>
            {workLevelList.map((level, index) => (
              <MenuItem key={index} value={index}>
                {level}
              </MenuItem>
            ))}
          </Input>
        </Grid>

        <Grid item xs={3} className="from-item">
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 状态
          </FormLabel>
          <Input
            select
            placeholder="状态"
            autoComplete="off"
            value={formParams.workState}
            onChange={(e) => handleInputChange(e, 'workState')}
            size="small"
            sx={{
              width: '40%',
            }}
          >
            <MenuItem key={-1} value={-1}>
              {'全部'}
            </MenuItem>
            {workStateList.map((state, index) => (
              <MenuItem key={index} value={index}>
                {state}
              </MenuItem>
            ))}
          </Input>
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
        <Grid item xs={4} className="from-item" sx={{ justifyContent: 'end' }}>
          <Stack
            direction="row"
            className="btn-bar"
            sx={{
              maxWidth: '350px !important',
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
            {getUserInfo() && getUserInfo().roleEntitie && getUserInfo().roleEntitie.authChar === 'root' && (
              <Button onClick={() => handleAdd()} startIcon={<SvgIcon svgName="search_icon" svgClass="icon"></SvgIcon>}>
                新增
              </Button>
            )}

            <Button onClick={() => handleBack()} startIcon={<SvgIcon svgName="search_icon" svgClass="icon"></SvgIcon>}>
              返回
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default forwardRef(SearchBar)
