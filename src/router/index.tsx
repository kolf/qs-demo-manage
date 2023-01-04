import { lazy, Suspense, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'
// 组件
import Layout from '@/components/Layout'
import Error from '@/pages/error/404'
const Login = lazy(() => import('@/pages/login'))
const User = lazy(() => import('@/pages/system-management/user'))
const Role = lazy(() => import('@/pages/system-management/role'))
const Area = lazy(() => import('@/pages/system-management/area'))
const Analyse = lazy(() => import('@/pages/integrated-management/analyse'))
const EarlyWarning = lazy(() => import('@/pages/integrated-management/early-warning'))
const WorkOrder = lazy(() => import('@/pages/integrated-management/work-order'))

// 组件懒加载
const lazyload = (children: ReactNode): ReactNode => {
  return <Suspense>{children}</Suspense>
}

// 免登录名单
export const whiteList = ['/login']

export interface Router {
  show?: boolean
  path: string
  element: JSX.Element
  name: string
  open?: boolean
  icon?: JSX.Element | string
  children?: Array<{
    index?: boolean
    path: string
    element: ReactNode
    name: string
    icon?: JSX.Element | string
    show?: boolean
  }>
}

// 菜单
export const menuRouter: Router[] = [
  {
    path: '/integrated-management',
    element: <Layout />,
    name: '综合管理',
    icon: <SvgIcon svgName="data_management" />,
    children: [
      {
        index: true,
        path: 'work-order',
        element: lazyload(<WorkOrder />),
        name: '工单管理',
        icon: <SvgIcon svgName="data_statistic" />,
      },
      // {
      //   path: 'early-warning',
      //   element: lazyload(<EarlyWarning />),
      //   name: '预警管理',
      //   icon: <SvgIcon svgName="data_list" />,
      // },
      // {
      //   path: 'analyse',
      //   element: lazyload(<Analyse />),
      //   name: '文档管理',
      //   icon: <SvgIcon svgName="data_list" />,
      // },
    ],
  },
  {
    path: '/system-management',
    element: <Layout />,
    name: '系统管理',
    icon: <SvgIcon svgName="algorithm_icon" />,
    children: [
      {
        path: 'user',
        element: lazyload(<User />),
        name: '用户管理',
        icon: <SvgIcon svgName="original_data" />,
      },
      {
        path: 'role',
        element: lazyload(<Role />),
        name: '角色管理',
        icon: <SvgIcon svgName="label_data" />,
      },
      // {
      //   path: 'area',
      //   element: lazyload(<Area />),
      //   name: '区域管理',
      //   icon: <SvgIcon svgName="label_data" />,
      // },
    ],
  },
]

// 一般路由
const router = [
  {
    path: '/',
    element: <Navigate to="/integrated-management/work-order"></Navigate>,
  },
  {
    path: '/login',
    element: lazyload(<Login />),
  },
  {
    path: '*',
    element: lazyload(<Error />),
  },
]

export default router.concat(menuRouter)
