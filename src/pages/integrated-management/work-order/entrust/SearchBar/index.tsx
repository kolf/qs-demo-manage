import React, { useEffect, useState, useRef, RefObject } from 'react'
import { TextField, MenuItem, Stack, Grid, FormLabel, Box, Menu } from '@mui/material'
import Button, { LoadingButton } from '@/components/Button'
import Input from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import DatePicker from '@/components/DatePicker'
import { workLevelList, workStateList } from '../../work-all/SearchBar/data'
import { styled } from '@mui/material/styles'
import '@/components/SearchBar/style.scss'

export interface FormParams {
  workCode: string
  workLeve: number | null
}

export default function SearchBar({ onSubmit, onBack }: { onSubmit?: Function; onBack?: Function }) {
  const [formParams, setFormParams] = useState<FormParams>({
    workCode: '',
    workLeve: 0,
  })
  const [open, setOpen] = useState<{ start: boolean; end: boolean }>({ start: false, end: false })
  // 初始化
  useEffect(() => {}, [])

  const handleInputChange = (e, type) => {
    switch (type) {
      case 'workCode':
        formParams.workCode = e.target.value
        break
      case 'workLeve':
        formParams.workLeve = e.target.value
        break
    }
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
      workCode: '',
      workLeve: 0,
    })
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
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 工单标题
          </FormLabel>
          <Input
            required
            id="phoneInput"
            size="small"
            placeholder="工单标题"
            value={formParams.workCode}
            onChange={(e) => handleInputChange(e, 'workCode')}
            autoComplete="off"
            sx={{
              width: '40%',
            }}
          />
        </Grid>
        <Grid item xs={4} className="from-item">
          <FormLabel component="span" className="label">
            <SvgIcon svgName="data_icon" svgClass="icon"></SvgIcon> 优先级
          </FormLabel>
          <Input
            select
            placeholder="优先级"
            autoComplete="off"
            value={formParams.workLeve}
            onChange={(e) => handleInputChange(e, 'workLeve')}
            size="small"
            sx={{
              width: '40%',
            }}
          >
            {workLevelList.map((level, index) => (
              <MenuItem key={index} value={index}>
                {level}
              </MenuItem>
            ))}
          </Input>
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

            <Button onClick={() => handleBack()} startIcon={<SvgIcon svgName="search_icon" svgClass="icon"></SvgIcon>}>
              返回
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
