import React, { useEffect, useState, useRef, RefObject } from 'react'
import { TextField, MenuItem, Stack, Grid, FormLabel, Box, Menu } from '@mui/material'
import Button, { LoadingButton } from '@/components/Button'
import Input from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import DatePicker from '@/components/DatePicker'
import { styled } from '@mui/material/styles'
import '@/components/SearchBar/style.scss'

interface FormParams {
  firstInput: string
  secondInput: string
  startTime: Date | null
  endTime: Date | null
}

export default function SearchBar({
  onSubmit,
  onAdd,
  input,
}: {
  onSubmit?: Function
  onAdd?: Function
  input: {
    firstInput: {
      label: string
      icon?: string
      placeholder?: string
    }
    secondInput: {
      label: string
      icon?: string
      placeholder?: string
    }
  }
}) {
  const [formParams, setFormParams] = useState<FormParams>({
    firstInput: '',
    secondInput: '',
    startTime: null,
    endTime: null,
  })
  const [open, setOpen] = useState<{ start: boolean; end: boolean }>({ start: false, end: false })
  // 初始化
  useEffect(() => {}, [])

  // 名称输入框事件
  const handleUsernameChange = (e) => {
    formParams.firstInput = e.target.value
    setFormParams({ ...formParams })
  }

  // 号码输入框事件
  const handlePhoneNumberChange = (e) => {
    formParams.secondInput = e.target.value
    setFormParams({ ...formParams })
  }

  // 提交按钮
  const handleSubmit = () => {
    ;(onSubmit as Function)(formParams)
  }

  //重置按钮
  const handleReset = () => {
    setFormParams({
      firstInput: '',
      secondInput: '',
      startTime: null,
      endTime: null,
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
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> {input.firstInput.label}
          </FormLabel>
          <Input
            required
            id="dataInput"
            size="small"
            placeholder={input.firstInput.placeholder}
            value={formParams.firstInput}
            onChange={handleUsernameChange}
            autoComplete="off"
            sx={{
              width: '40%',
            }}
          />
        </Grid>

        <Grid item xs={3} className="from-item">
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> {input.secondInput.label}
          </FormLabel>
          <Input
            required
            id="phoneInput"
            size="small"
            placeholder={input.secondInput.placeholder}
            value={formParams.secondInput}
            onChange={handlePhoneNumberChange}
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
            <SvgIcon svgName="gather_date" svgClass="icon"></SvgIcon> 采集时间
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
        <Grid item xs={3} className="from-item" sx={{ justifyContent: 'end' }}>
          <Stack direction="row" className="btn-bar">
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
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
