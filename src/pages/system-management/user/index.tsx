import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography, Stack, MenuItem } from '@mui/material'
import SearchBar from '../../../components/SearchBar/index'
import Table from '@/components/Table'
import Button from '@mui/material/Button'
import Dialog from '@/components/FormDialog'
import Input from '@/components/Input'
import Message from '@/components/Message'
import { insertOrUpdateUser, getUserList, delUser } from '@/api/user'
import { getAreaList } from '@/api/area'
import { getRoleList } from '@/api/role'
import moment from 'moment'
import '../style.scss'
import { number } from 'echarts'

interface Params {
  userName: string
  phone: string
}

export default function index() {
  const columns = [
    {
      align: 'center',
      title: '编号',
      key: 'userCode',
    },
    {
      align: 'center',
      title: '用户名称',
      key: 'userName',
    },
    {
      align: 'center',
      title: '用户角色',
      slot: function ({ row }: { row: any }) {
        return <span>{row.roleEntities && row.roleEntities.roleName}</span>
      },
    },
    {
      align: 'center',
      title: '性别',
      key: 'sex',
      slot: function ({ row }: { row: any }) {
        return <span>{row.sex === 0 ? '男' : '女'}</span>
      },
    },
    {
      align: 'center',
      title: '电话',
      key: 'phone',
    },
    {
      align: 'center',
      title: '所属区域',
      key: 'areaName',
      slot: function ({ row }: { row: any }) {
        return <span>{row.areaEntity && row.areaEntity.areaName}</span>
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
            <Button onClick={() => handleEdit(row)} className="btn">
              编辑
            </Button>
            <Button onClick={(e) => handleDelete(row, e)} className="btn">
              删除
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
  const [visible, setVisible] = useState(false)
  let [consentSubmit, setConsentSubmit] = useState(false)
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<Params>({
    userName: '',
    phone: '',
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
  let [isAdd, setIsAdd] = useState(false)
  // const [position, setPosition] = useState({
  //   top: '',
  //   left: '',
  // })
  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  // const open = Boolean(anchorEl)
  // const id = open ? 'simple-popover' : undefined

  /* 初始化数据 */
  useEffect(() => {
    handleSubmit(submitParams)

    // 获取角色列表
    getRoleList({ pageNumber: 1, pageSize: 100 }).then(({ data, code }: any) => {
      if (code === 200) {
        setRoleList(data.records)
      }
    })
    //  获取区域列表
    getAreaList({ pageNumber: 1, pageSize: 100 }).then(({ data, code }: any) => {
      if (code === 200) {
        setAreaList(data.records)
      }
    })
  }, [])

  /* 监听弹出框关闭重置 */
  useEffect(() => {
    if (!visible) {
      setConsentSubmit(false)
    }
  }, [visible])

  // 列表搜索接口
  const handleSubmit = (value, pageNumber?: number) => {
    submitParams = {
      userName: value.firstInput || '',
      phone: value.secondInput || '',
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
    getUserList(params)
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

  /* 新增 */
  const handleAdd = () => {
    setIsAdd(true)
    setVisible(true)
  }

  // 编辑
  const handleEdit = (row: any) => {
    setIsAdd(false)
    setVisible(true)
    Object.keys(formParams).forEach((item) => {
      formParams[item] = row[item]
    })
    formParams.areaId = row.areaEntity ? row.areaEntity.id : ''
    formParams.roleId = row.roleEntities ? row.roleEntities.id : ''
    setFormParams({ ...formParams })
    console.log(formParams)
  }

  // 删除
  const handleDelete = (row, e) => {
    delUser({ id: row.id }).then(() => {
      Message({ content: '删除成功' })
      handleSubmit(submitParams)
    })
    // setPosition({
    //   top: e.pageX,
    //   left: e.pageY,
    // })
    // setAnchorEl(e.target)
  }

  // const handleDeleteClose = () => {
  //   setAnchorEl(null)
  //   setPosition({
  //     top: '',
  //     left: '',
  //   })
  // }

  /* 弹出框提交数据 */
  const handleDialogSubmit = () => {
    setConsentSubmit(true)
    if (formParams.userName === '') {
      return false
    }
    // return false
    if (isAdd) {
      return false
    }
    insertOrUpdateUser(formParams).then(({ code }: any) => {
      if (code === 0) {
        Message({ content: `${isAdd ? '新增' : '修改'}用户成功`, icon: '' })
        setVisible(false)
        resetFormParams()
        handleSubmit(submitParams)
      }
    })
  }

  /* 弹出框关闭 */
  const handleDialogClose = () => {
    resetFormParams()
    setVisible(false)
  }

  /* 按钮重置 */
  const handleReset = () => {
    handleSubmit(submitParams)
  }
  /* 重置数据 */
  const resetFormParams = () => {
    let params = {
      id: '',
      userName: '',
      password: '',
      phone: '',
      areaId: '',
      roleId: '',
      sex: 0,
    }
    setFormParams({ ...params })
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

  // 输入框内容改变事件
  const handleInputChange = (e, type) => {
    switch (type) {
      case 'userName':
        formParams.userName = e.target.value
        break
      case 'password':
        formParams.password = e.target.value
        break
      case 'phone':
        formParams.phone = e.target.value
        break
      case 'areaId':
        formParams.areaId = e.target.value
        break
      case 'roleId':
        formParams.roleId = e.target.value
        break
      case 'sex':
        console.log(Number(e.target.checked))
        formParams.sex = Number(e.target.checked)
        break
    }
    setFormParams({ ...formParams })
  }
  return (
    <Box className="system-container">
      <SearchBar
        onSubmit={(value) => handleSubmit(value, 1)}
        // onSubmit={}
        onAdd={handleAdd}
        onReset={handleReset}
        input={{
          firstInput: {
            label: '用户名称',
            placeholder: '请输入用户名称',
          },
          secondInput: {
            label: '手机号码',
            placeholder: '请输入手机号码',
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

      <Dialog
        title={isAdd ? '新增角色' : '编辑角色'}
        open={visible}
        onSubmit={handleDialogSubmit}
        onClose={handleDialogClose}
        loadingBtn={false}
      >
        <Grid
          container
          spacing={{ xs: 1, md: 2, lg: 4 }}
          sx={{
            padding: '20px 0',
          }}
        >
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              用户名称
            </FormLabel>
            <Input
              required
              helperText={!formParams.userName && consentSubmit ? '不能为空!' : ''}
              id="dataInput"
              size="small"
              placeholder="请输入角色名称"
              value={formParams.userName}
              onChange={(e) => handleInputChange(e, 'userName')}
              autoComplete="off"
              sx={{
                width: '85%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              登录密码
            </FormLabel>
            <Input
              required
              id="dataInput"
              size="small"
              placeholder="请输入登录密码"
              value={formParams.password}
              helperText={!formParams.password && consentSubmit ? '不能为空!' : ''}
              onChange={(e) => handleInputChange(e, 'password')}
              autoComplete="off"
              sx={{
                width: '85%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              角色名称
            </FormLabel>
            <Input
              select
              helperText={!formParams.roleId && consentSubmit ? '不能为空!' : ''}
              placeholder="请输入区域名称"
              value={formParams.roleId}
              onChange={(e) => handleInputChange(e, 'roleId')}
              autoComplete="off"
              sx={{
                width: '85%',
              }}
              size="small"
              // SelectProps={{
              //   renderValue: (selected) => selected.join(', '),
              // }}
              // MenuProps={MenuProps}
            >
              {roleList.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Input>
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              区域名称
            </FormLabel>
            <Input
              select
              helperText={!formParams.areaId && consentSubmit ? '不能为空!' : ''}
              placeholder="请输入区域名称"
              value={formParams.areaId}
              onChange={(e) => handleInputChange(e, 'areaId')}
              autoComplete="off"
              sx={{
                width: '85%',
              }}
              size="small"
              // SelectProps={{
              //   renderValue: (selected) => selected.join(', '),
              // }}
              // MenuProps={MenuProps}
            >
              {areaList.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.areaName}
                </MenuItem>
              ))}
            </Input>
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              电话号码
            </FormLabel>
            <Input
              required
              // helperText={submitParams.inputValue ? '' : '不能为空!'}
              id="dataInput"
              size="small"
              placeholder="请输入电话号码"
              value={formParams.phone}
              onChange={(e) => handleInputChange(e, 'phone')}
              autoComplete="off"
              sx={{
                width: '85%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              性别
            </FormLabel>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                marginLeft: '30px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                }}
              >
                男
              </Typography>
              <Switch checked={Boolean(formParams.sex)} onChange={(e) => handleInputChange(e, 'sex')} />
              <Typography
                sx={{
                  fontSize: '12px',
                }}
              >
                女
              </Typography>
            </Stack>
          </Grid>
        </Grid>
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
