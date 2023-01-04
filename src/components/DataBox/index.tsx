import React from 'react'
import s from './styles.module.scss'
import { Box, Typography, SvgIcon, Popover } from '@mui/material'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'

export interface warning {
  key: string
  count: number
  title: string
}

export default function DataBox({ warning, bg, onClick }: { warning: warning; bg: string; onClick?: Function }) {
  const handleDataBoxClick = () => {
    onClick()
  }
  return (
    <Box
      className={s.container}
      sx={{
        backgroundImage: `url(${bg})`,
      }}
      onClick={handleDataBoxClick}
    >
      <Box>
        <Typography component="p" className={s.title}>
          {warning.title}
        </Typography>
        <Typography component="p" className={s.count}>
          {warning.count}
        </Typography>
      </Box>
    </Box>
  )
}
