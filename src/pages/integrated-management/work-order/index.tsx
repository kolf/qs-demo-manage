import React, { useEffect, useState } from 'react'
import { Grid, Box, Typography } from '@mui/material'
import DataBox from '@/components/DataBox'
import SvgIcon from '@/components/SvgIcon'
import WorkAll from './work-all'
import Entrust from './entrust'
import { getWorkStatistics } from '@/api/workOrder'
import { workOrderType, workOrderTabs } from '../data'
import { getUserInfo } from '@/utils/auth'
import box1 from '@/assets/image/png/box1.png'
import box2 from '@/assets/image/png/box2.png'
import box3 from '@/assets/image/png/box3.png'
import box4 from '@/assets/image/png/box4.png'
import './style.scss'

export default function index() {
  // tabs切换
  const [tabs, setTabs] = useState(0)
  // 统计数据
  const [workType, setWorkType] = useState(workOrderType)
  // 背景图片
  const [imgArr, setImgArr] = useState<Array<string>>([box1, box2, box3, box4])

  /* 初始化数据 */
  useEffect(() => {
    // 获取预警统计数据
    getWarningStatisticsData()

    // 测试用户登录
    // login({ password: '123456', userName: '临平区测试用户' }).then(({ data }) => {
    //   setUserInfo(data)
    // })
  }, [])

  /* 获取预警统计数据 */
  const getWarningStatisticsData = () => {
    getWorkStatistics({ userId: getUserInfo().id || '' }).then((item) => {
      workType.forEach((work) => {
        work.count = item[work.key]
      })
      console.log(workType)
      setWorkType([...workType])
    })
  }

  /* 标签切换事件 */
  const handleTabsChange = (tab) => {
    setTabs(tab)
  }

  /* 点击统计总数跳转 */
  const handleDataBox = () => {
    setTabs(1)
  }
  return (
    <>
      {tabs === 0 ? (
        <>
          <Box className="work_order-bar">
            {workOrderTabs.map((item, i) => {
              return (
                <Box className={'select'} onClick={() => handleTabsChange(item.key)}>
                  <SvgIcon svgName={item.icon} svgClass="tab_icon"></SvgIcon>
                  <Typography
                    className="name"
                    sx={{
                      color: '#AEBDD8',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              )
            })}
          </Box>
          <Grid
            sx={{
              marginTop: '20px',
              paddingLeft: '30px',
            }}
            container
            spacing={2}
          >
            {workType.map((item, index) => {
              return (
                <>
                  <Grid lg={3} sm={6} md={4}>
                    <DataBox warning={item} bg={imgArr[index]} onClick={handleDataBox}></DataBox>
                  </Grid>
                </>
              )
            })}
          </Grid>
        </>
      ) : (
        <Box>
          {/* <p onClick={() => setTabs(0)} className="back">
            返回
          </p> */}
          {tabs === 1 ? (
            <WorkAll
              onBack={() => {
                setTabs(0)
              }}
            ></WorkAll>
          ) : (
            <Entrust
              onBack={() => {
                setTabs(0)
              }}
            ></Entrust>
          )}
        </Box>
      )}
    </>
  )
}
