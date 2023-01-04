import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography, Stack, MenuItem } from '@mui/material'
import SearchBar from './SearchBar'
import Table from '@/components/Table'
import Button from '@mui/material/Button'
import Dialog from '@/components/FormDialog'
import Input from '@/components/Input'
import Message from '@/components/Message'
import { getListByPageAnalyse } from '@/api/analyse'
import moment from 'moment'

interface Params {
  fileCode: string
  fileName: string
  starTime: string | null
  endTime: string | null
}

export default function index() {
  const columns = [
    {
      align: 'center',
      title: '报表编号',
      key: 'fileCode',
    },
    {
      align: 'center',
      title: '报表名称',
      key: 'fileName',
    },
    {
      align: 'center',
      title: '生成时间',
      key: 'updateTime',
    },
    {
      align: 'center',
      title: '操作',
      key: 'operate',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            {/* <Button onClick={() => handlePreview(row)} className="btn">
              预览
            </Button> */}
            <Button onClick={(e) => handleDownLoad(row, e)} className="btn">
              下载
            </Button>
          </>
        )
      },
    },
  ]
  // 定时器
  let timer: NodeJS.Timeout | null | undefined = null
  // 状态变量
  const [listData, setListData] = useState([])
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<Params>({
    fileCode: '',
    fileName: '',
    starTime: null,
    endTime: null,
  })
  // 新增或者修改的参数
  let [formParams, setFormParams] = useState<{
    id: string | number
    userName: string
    password: string
    phone: string
    areaId: string
    roleId: string
    sex: number
  }>({
    id: '',
    userName: '',
    password: '',
    phone: '',
    areaId: '',
    roleId: '',
    sex: 0,
  })
  // 分页
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
    count: 0,
    total: 0,
  })
  const [loading, setLoading] = useState<boolean>(false)

  /* 初始化数据 */
  useEffect(() => {
    handleSubmit(submitParams)
  }, [])

  // 列表搜索接口
  const handleSubmit = (value, pageNumber?: number) => {
    console.log(value.startTime)
    submitParams = {
      fileCode: value.firstInput || '',
      fileName: value.secondInput || '',
      starTime: value.startTime ? moment(value.startTime).format('YYYY-MM-DD') : null,
      endTime: value.startTime ? moment(value.endTime).format('YYYY-MM-DD') : null,
    }
    setSubmitParams(submitParams)
    if (pageNumber) {
      page.pageNumber = 1
      setPage({ ...page })
    }
    const params = {
      ...page,
      ...submitParams,
    }
    setLoading(true)
    getListByPageAnalyse(params)
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

  // 预览
  const handlePreview = (row: any) => {}

  // 下载
  const handleDownLoad = (row, e) => {
    row.fileUrl && (window.location.href = row.fileUrl)
  }

  // 页面改变事件
  const handlePageChange = (e: any, value: number) => {
    page.pageNumber = value
    setPage({ ...page })
    const params = {
      ...page,
      ...submitParams,
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      handleSubmit(params)
      clearTimeout(timer as NodeJS.Timeout)
    }, 500)
  }

  return (
    <Box className="system-container">
      <SearchBar
        onSubmit={(value) => handleSubmit(value, 1)}
        input={{
          firstInput: {
            label: '报表编号',
            placeholder: '请输入报表编号',
          },
          secondInput: {
            label: '报表标题',
            placeholder: '请输入报表标题',
          },
        }}
      ></SearchBar>
      <Divider className="divider" />
      <Table
        data={listData}
        columns={columns as any}
        pagination={page}
        onPageChange={handlePageChange}
        loading={loading}
      ></Table>
    </Box>
  )
}
