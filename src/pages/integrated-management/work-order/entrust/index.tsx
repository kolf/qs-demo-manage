import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography, Stack, MenuItem } from '@mui/material'
import SearchBar from './SearchBar'
import Table from '@/components/Table'
import Button from '@mui/material/Button'
import Dialog from '@/components/FormDialog'
import Input from '@/components/Input'
import Message from '@/components/Message'
import { insertOrUpdateUser, getUserList, delUser } from '@/api/user'
import { getAreaList } from '@/api/area'
import { getRoleList } from '@/api/role'
import { findWorkListByPage } from '@/api/workOrder'
import { workLevelList, workStateList } from '../work-all/SearchBar/data'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
import '../style.scss'
import { number } from 'echarts'

interface Params {
  workCode: string
  workLeve: number | null
}

export default function index({ onBack }) {
  const columns = [
    {
      align: 'center',
      title: '工单编号',
      key: 'workCode',
    },
    {
      align: 'center',
      title: '工单内容',
      key: 'context',
    },
    {
      align: 'center',
      title: '当前状态',
      slot: function ({ row }: { row: any }) {
        return <span>{row.workState !== null ? workStateList[row.workState] : ''}</span>
      },
    },
    {
      align: 'center',
      title: '创建时间',
      key: 'createTime',
    },
    {
      align: 'center',
      title: '当前处理人',
      slot: function ({ row }: { row: any }) {
        return <span>{row.currentUser && row.currentUser.userName}</span>
      },
    },
    {
      align: 'center',
      title: '所属区域',
      key: 'areaName',
      slot: function ({ row }: { row: any }) {
        return <span>{row.area && row.area.areaName}</span>
      },
    },
    {
      align: 'center',
      title: '创建时间',
      key: 'createTime',
    },
    {
      align: 'center',
      title: '操作',
      key: 'operate',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <Button
              onClick={() => handleVerify(row)}
              className="btn"
              sx={{
                display:
                  getUserInfo() &&
                  (getUserInfo().roleEntitie.authChar === 'root' || getUserInfo().roleEntitie.authChar === 'check')
                    ? ''
                    : 'none',
              }}
            >
              审核
            </Button>
            <Button
              onClick={() => handleRecheck(row)}
              className="btn"
              sx={{
                display:
                  getUserInfo() &&
                  (getUserInfo().roleEntitie.authChar === 'root' || getUserInfo().roleEntitie.authChar === 'reCheck')
                    ? ''
                    : 'none',
              }}
            >
              复核
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
  let [roleList, setRoleList] = useState([])
  let [areaList, setAreaList] = useState([])
  let [userList, setUserList] = useState([])
  const [visible, setVisible] = useState(false)
  let [consentSubmit, setConsentSubmit] = useState(false)
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<Params>({
    workCode: '',
    workLeve: 0,
  })
  // 新增或者修改的参数
  // let [formParams, setFormParams] = useState<{
  //   id: string | number
  //   userName: string
  //   password: string
  //   phone: string
  //   areaId: string
  //   roleId: string
  //   sex: number
  // }>({
  //   id: '',
  //   userName: '',
  //   password: '',
  //   phone: '',
  //   areaId: '',
  //   roleId: '',
  //   sex: 0,
  // })
  // 分页
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
    count: 0,
    total: 0,
  })
  const [loading, setLoading] = useState<boolean>(false)
  let [isAdd, setIsAdd] = useState(false)

  /* 初始化数据 */
  useEffect(() => {
    // 获取用户列表
    getUserList({ pageNumber: 1, pageSize: 100 }).then(({ data, code }: any) => {
      if (code === 200) {
        setUserList(data.records)
        handleSubmit(submitParams)
      }
    })
  }, [])

  /* 监听弹出框关闭重置 */
  useEffect(() => {
    if (!visible) {
      setConsentSubmit(false)
    }
  }, [visible])

  /* 审核 */
  const handleVerify = (row) => {
    setVisible(true)
  }

  /* 复核 */
  const handleRecheck = (row) => {
    setVisible(true)
  }

  // 列表搜索接口
  const handleSubmit = (value, pageNumber?: number) => {
    submitParams = {
      workCode: value.workCode || '',
      workLeve: value.workLeve || 0,
    }
    setSubmitParams(submitParams)
    if (pageNumber) {
      page.pageNumber = 1
      setPage({ ...page })
    }
    const params = {
      ...page,
      ...submitParams,
      // TODO:后续修改
      // workState:,
      userId: 4,
    }
    setLoading(true)
    findWorkListByPage(params)
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

  /* 返回 */
  const handleBack = () => {
    onBack()
  }

  /* 确认按钮弹出框 */
  const handleDialogSubmit = () => {
    setVisible(false)
  }

  /* 取消按钮弹出框 */
  const handleDialogClose = () => {
    setVisible(false)
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
    <Box className="main-container">
      <SearchBar onSubmit={(value) => handleSubmit(value, 1)} onBack={handleBack}></SearchBar>
      <Divider className="divider" />
      <Table
        data={listData}
        columns={columns as any}
        pagination={page}
        onPageChange={handlePageChange}
        loading={loading}
      ></Table>

      <Dialog
        title={isAdd ? '审核' : '复核'}
        open={visible}
        onSubmit={handleDialogSubmit}
        onClose={handleDialogClose}
        loadingBtn={false}
        closeText="拒绝"
        submitText="通过"
      >
        是否通过审核
      </Dialog>
      {/* <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleDeleteClose}
        sx={{
          top: position.top,
          left: position.left,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover> */}
    </Box>
  )
}
