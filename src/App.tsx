import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams, useRoutes, useNavigate } from 'react-router-dom'
import { Box, Grid } from '@mui/material'
import router, { whiteList } from './router'
import { getToken, getUserInfo } from '@/utils/auth'
import './App.scss'

function App() {
  let location = useLocation()
  let navigate = useNavigate()
  let [routers, setRouters] = useState(router)
  // 路由守卫
  useEffect(() => {
    // getToken() &&
    if (getUserInfo()) {
      if (location.pathname === '/login') {
        navigate('/')
      }
    } else {
      if (!whiteList.includes(location.pathname)) {
        navigate('/login')
      }
    }
  }, [location.pathname])

  return <Box className="app">{useRoutes(router)}</Box>
}

export default App
