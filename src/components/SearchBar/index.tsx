import React, { useEffect, useState, useRef, RefObject } from 'react'
import { TextField, MenuItem, Stack, Grid, FormLabel, Box, Menu } from '@mui/material'
import Button, { LoadingButton } from '@/components/Button'
import Input from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import { styled } from '@mui/material/styles'
import './style.scss'

interface FormParams {
  firstInput: string
  secondInput: string
}

export default function SearchBar({
  onSubmit,
  onAdd,
  input,
  addState = true,
  onReset,
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
  addState?: boolean
  onReset?: Function
}) {
  const [formParams, setFormParams] = useState<FormParams>({
    firstInput: '',
    secondInput: '',
  })

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
    })
    onReset()
  }

  // 新增按钮
  const handleAdd = () => {
    onAdd()
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
        <Grid item xs={4} className="from-item">
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

        <Grid item xs={4} className="from-item">
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
        <Grid item xs={4} className="from-item" sx={{ justifyContent: 'end' }}>
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
            {addState && (
              <Button onClick={() => handleAdd()} startIcon={<SvgIcon svgName="search_icon" svgClass="icon"></SvgIcon>}>
                新增
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
