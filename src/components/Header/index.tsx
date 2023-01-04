import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/api/user'
import { getToken, removeUserInfo, getUserInfo } from '@/utils/auth'
import { styled } from '@mui/material/styles'
import { Toolbar, Divider, Typography, Box, Tooltip, IconButton, Avatar, Menu, MenuItem, AppBar } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { removeToken } from '@/utils/auth'
import { barHeight } from '@/config'
import stardust from '@/assets/image/png/stardust.png'
import avatar from '@/assets/image/png/avatar.png'
import './header.scss'

// 自定义Header占位框
export const DrawerHeader = styled('div')(({ theme }) => ({
  height: barHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

// 自定义menu
export const MyMenu = styled(Menu)({
  '& .MuiPaper-root': {
    background: 'linear-gradient(180deg, #AEBDD8 0%, #7E98C8 85%, #8499BF 100%)',
    boxShadow: '0px 0px 8px 0px rgba(43,48,63,0.5000)',
    '& .MuiMenu-list': {
      padding: '3px 0',
    },
  },
})

export default function Header() {
  const settings = ['退出']
  const navigate = useNavigate()

  // 绑定点击头像按钮，用于（打开/关闭）弹出框
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  // 隐藏弹出框
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  // 显示弹出框
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  // 退出登录事件
  const handleLogout = () => {
    // logout({ clientId: 0, uuid: getToken() }).then((res: any) => {
    //   if (res.code === 0) {
    //     removeUserInfo()
    //     removeToken()
    //     navigate('/login')
    //     handleCloseUserMenu()
    //   }
    // })
    removeUserInfo()
    navigate('/login')
  }

  return (
    <AppBar
      position="fixed"
      className="header"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        className="bar"
        sx={{
          height: barHeight,
        }}
      >
        {/* <img src={stardust} /> */}
        <Typography sx={{ display: { xs: 'none', md: 'flex' } }} className="title">
          乔司街道智慧护民保障平台
        </Typography>

        <Box className="user">
          <Divider orientation="vertical" variant="middle" flexItem className="divider" />

          {/* s 头像 */}
          <ClickAwayListener onClickAway={handleCloseUserMenu}>
            <Tooltip title="" arrow>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={avatar} />
              </IconButton>
            </Tooltip>
          </ClickAwayListener>
          {/* e 头像 */}

          {/* s 基本信息 */}
          <Box className="user-info">
            <Typography className="name">{getUserInfo() ? getUserInfo().userName : ''} </Typography>
            <Typography className="department">
              {getUserInfo() && getUserInfo().roleEntitie ? getUserInfo().roleEntitie.roleName : '无职务'}
            </Typography>
          </Box>
          {/* e 基本信息 */}

          {/* s 弹出框 */}
          <MyMenu
            sx={{ mt: '45px', ml: '20px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={handleLogout}
                sx={{
                  color: '#ffffff99',
                  ':hover': {
                    background: 'none',
                    color: '#fff',
                  },
                }}
              >
                <Typography textAlign="center" sx={{ fontSize: '12px' }}>
                  {setting}
                </Typography>
              </MenuItem>
            ))}
          </MyMenu>
          {/* e 弹出框 */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
