import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { List, ListItem, ListItemIcon, ListItemText, Box, Collapse, Toolbar, Drawer } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { menuRouter, Router } from '@/router'
import { drawerWidth, barHeight } from '@/config'
import { getUserInfo } from '@/utils/auth'
import './side.scss'

// 自定义Drawer样式
const MyDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    bacgroundColor: '#1A1C25',
    border: 'none',
  },
}))

export default function index() {
  const location = useLocation()
  // 菜单路由
  const [routers, setRouters] = useState<Router[]>(menuRouter)
  // 当前选中的路由
  const [activeRouter, setActiveRouter] = useState<number>(0)

  // 初始化用户路由权限
  useEffect(() => {
    // if (getUserInfo()) {
    //   const menuDTOS = getUserInfo().menuDTOS

    //   for (let i = 0; i < menuDTOS.length; i++) {
    //     for (let j = 0; j < routers.length; j++) {
    //       if (menuDTOS[i]['menuUrl'] === routers[j]['path']) {
    //         routers[j].show = true
    //         if (menuDTOS[i].childrenMenu) {
    //           menuDTOS[i].childrenMenu.forEach((menuDTO: { [x: string]: string }) => {
    //             if (routers[j].children) {
    //               routers[j].children.forEach((router) => {
    //                 if (menuDTO['menuUrl'] === routers[j]['path'] + '/' + router['path']) {
    //                   router.show = true
    //                 }
    //               })
    //             }
    //           })
    //         }
    //       }
    //     }
    //   }
    // }

    menuRouter.forEach((router: Router) => {
      router['open'] = false
    })

    console.log(menuRouter)
    setRouters([...routers])
  }, [])

  // 侧边栏点击事件
  function handleClick(index: number) {
    routers[index].open = !routers[index].open
    setRouters([...routers])
  }

  // 监听路由 获取当前选中的路由
  useEffect(() => {
    let routerName = location.pathname.split('/')[1]
    routers.forEach((router: Router, index) => {
      if ('/' + routerName === router.path) {
        setActiveRouter(index)
      }
    })
  }, [location.pathname])

  return (
    <>
      <MyDrawer variant="permanent">
        <Toolbar
          sx={{
            height: barHeight,
          }}
        />
        <Box className="menu">
          <List className="menuList">
            {routers.map((prop, index) => {
              // 显示只有一级路由的路由
              if (!prop.children) {
                return (
                  <NavLink to={prop.path} key={index}>
                    <ListItem button key={prop.path} disablePadding className="list-item">
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        {prop.icon}
                      </ListItemIcon>
                      <ListItemText primary={prop.name} className="item-text" />
                    </ListItem>
                  </NavLink>
                )
                // 显示有二级路由的路由
              } else if (prop.children) {
                let child = prop.children
                const nav = (
                  <Box className="item">
                    {child.map((item, childrenIndex) => {
                      const key = childrenIndex + '_child'
                      return (
                        <NavLink to={prop.path + '/' + item.path} key={key}>
                          <Collapse in={prop.open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className="btn">
                              <ListItem button>
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                  }}
                                >
                                  {item.icon}
                                </ListItemIcon>
                                <ListItemText disableTypography={true} primary={item.name} className="second-text" />
                              </ListItem>
                            </List>
                          </Collapse>
                        </NavLink>
                      )
                    })}
                  </Box>
                )
                return (
                  <Box
                    sx={{
                      background: activeRouter === index ? '#2E3343' : '',
                    }}
                  >
                    <ListItem button onClick={() => handleClick(index)}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        {prop.icon}
                      </ListItemIcon>
                      <ListItemText disableTypography={true} primary={prop.name} className="item-text" />
                    </ListItem>
                    {nav}
                  </Box>
                )
              }
            })}
          </List>
        </Box>
      </MyDrawer>
    </>
  )
}
