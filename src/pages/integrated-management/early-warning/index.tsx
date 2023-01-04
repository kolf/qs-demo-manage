import React, { useEffect, useState } from 'react'
// import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography, MenuItem, Checkbox } from '@mui/material'
import { Grid, Box, Divider } from '@mui/material'
import DataBox from '@/components/DataBox'
import { getWarningStatistics, getWarningList } from '@/api/warning'
import { earlyWarningType } from '../data'
import SearchBar, { FormParams } from './SearchBar'
import Table from '@/components/Table'
import box1 from '@/assets/image/png/box1.png'
import box2 from '@/assets/image/png/box2.png'
import box3 from '@/assets/image/png/box3.png'
import box4 from '@/assets/image/png/box4.png'

export default function index() {
  const columns = [
    {
      align: 'center',
      title: '预警编号',
      key: 'warningCode',
    },
    {
      align: 'center',
      title: '预警内容',
      key: 'context',
    },
    {
      align: 'center',
      title: '当前处理人',
      key: 'currentId',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>{row.currentUser && row.currentUser.userName}</span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '预警等级',
      key: 'warningLeve',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>{row.warningLeve === 0 ? '一般' : row.warningLeve === 1 ? '紧急' : '非常紧急'}</span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '预警状态',
      key: 'warningState',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>{row.warningState === 0 ? '未指派' : row.warningLeve === 1 ? '指派中' : '非常紧急'}</span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '创建时间',
      key: 'createTime',
    },
  ]

  // 定时器
  let timer: NodeJS.Timeout | null | undefined = null
  // 统计数据
  const [warningType, setWarningType] = useState(earlyWarningType)
  // 背景图片
  const [imgArr, setImgArr] = useState<Array<string>>([box1, box2, box3, box4])
  // 分页
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
    count: 0,
    total: 0,
  })
  const [listData, setListData] = useState([])
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<FormParams>({
    warningCode: '',
    currentName: '',
    startTime: null,
    endTime: null,
    warningLeve: 0,
    warningState: 0,
  })
  const [loading, setLoading] = useState<boolean>(false)
  /* 初始化数据 */
  useEffect(() => {
    // 获取预警统计数据
    getWarningStatisticsData()
    // 初始化列表
    handleSubmit(submitParams)
  }, [])

  /* 获取预警统计数据 */
  const getWarningStatisticsData = () => {
    getWarningStatistics().then((item) => {
      warningType.forEach((warning) => {
        warning.count = item[warning.key]
      })
      setWarningType([...warningType])
    })
  }

  /* 获取预警列表 */
  const handleSubmit = (value, pageNumber?: number) => {
    submitParams = {
      warningCode: value.warningCode,
      currentName: value.currentName,
      startTime: value.startTime,
      endTime: value.endTime,
      warningLeve: value.warningLeve,
      warningState: value.warningState,
    }
    setSubmitParams(submitParams)
    if (pageNumber) {
      page.pageNumber = 1
      setPage({ ...page })
    }
    const params = {
      ...page,
      ...submitParams,
      starTime: value.startTime,
    }
    setLoading(true)
    getWarningList(params)
      .then(({ code, data }: any) => {
        if (code === 200) {
          page.count = Math.ceil(data.total / page.pageSize)
          page.total = data.total
          setPage({ ...page })
          setListData(data.records)
          setLoading(false)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // 页面改变事件
  const handlePageChange = (e: any, value: number) => {
    page.pageNumber = value
    setPage({ ...page })
    const params = {
      ...page,
      ...submitParams,
    }
    // 请求
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      handleSubmit(params)
      clearTimeout(timer as NodeJS.Timeout)
    }, 500)
  }
  return (
    <>
      <Grid
        sx={{
          marginTop: '35px',
          paddingLeft: '30px',
        }}
        container
        spacing={2}
      >
        {warningType.map((item, index) => {
          return (
            <>
              <Grid lg={3} sm={6} md={4}>
                <DataBox warning={item} bg={imgArr[index]}></DataBox>
              </Grid>
            </>
          )
        })}
      </Grid>
      <Box
        style={{
          padding: '0 56px',
          marginTop: '40px',
        }}
      >
        <SearchBar onSubmit={(value) => handleSubmit(value, 1)}></SearchBar>
        <Divider
          style={{
            marginTop: '16px',
            marginBottom: '20px',
            borderColor: 'rgba(174,189,216,0.2)',
          }}
        />
        <Table
          data={listData}
          columns={columns as any}
          pagination={page}
          onPageChange={handlePageChange}
          loading={loading}
        ></Table>
      </Box>
    </>
  )
}
