import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import QRCodeCanvas from 'qrcode.react'
import { setToken, setUserInfo } from '@/utils/auth'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, FormLabel } from '@mui/material'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useTranslation } from 'react-i18next'
import { Login } from '@/api/user'
import './style.scss'

function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [qrUrl, setQrUrl] = useState('')
  const [QRCodeState, setQRCodeState] = useState(false)
  const [openMessage, setOpenMessage] = useState(false)
  const [params, setParams] = useState({
    userName: '城建科刘安',
    password: '123456',
  })

  /* 登录 */
  const handleLogin = () => {
    Login(params).then(({ data }) => {
      // setToken()
      setUserInfo(data)
      navigate('/')
      console.log(111)
    })
  }

  /* 设置账户密码 */
  const handleUsernameChange = (e) => {
    params.userName = e.target.value
    setParams({ ...params })
  }
  const handlePhoneNumberChange = (e) => {
    params.password = e.target.value
    setParams({ ...params })
  }
  return (
    <Box className="login-container">
      <h1>乔司街道智慧护民保障平台</h1>
      <Grid
        container
        spacing={{ xs: 4 }}
        sx={{
          padding: '20px 0',
          width: '400px !important',
        }}
      >
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            账户：
          </FormLabel>
          <Input
            required
            id="dataInput"
            size="small"
            placeholder="请输入账户"
            // value={formParams.firstInput}
            onChange={handleUsernameChange}
            autoComplete="off"
            sx={{
              width: '80%',
            }}
          />
        </Grid>

        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            密码：
          </FormLabel>
          <Input
            required
            id="phoneInput"
            size="small"
            placeholder="请输入密码"
            // value={formParams.secondInput}
            onChange={handlePhoneNumberChange}
            autoComplete="off"
            sx={{
              width: '80%',
            }}
          />
        </Grid>
        <Grid item xs={12} className="from-item">
          <Button
            variant="outlined"
            onClick={handleLogin}
            // startIcon={<SvgIcon svgName="reset_icon" svgClass="icon"></SvgIcon>}
            sx={{
              width: '90%',
            }}
          >
            登录
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
