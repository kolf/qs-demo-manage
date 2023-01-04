import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography } from '@mui/material'
import SearchBar from '../../../components/SearchBar/index'
import Table from '@/components/Table'
import Button from '@mui/material/Button'
import Dialog from '@/components/FormDialog'
import Input from '@/components/Input'
import Message from '@/components/Message'
import { getRoleList, insertOrUpdateRole, delRole, lockRoleById } from '@/api/role'
import moment from 'moment'
import '../style.scss'
import { number } from 'echarts'

interface Params {
  authChar: string
  roleName: string
}

export default function index() {
  const columns = [
    {
      align: 'center',
      title: '角色编号',
      key: 'roleCode',
    },
    {
      align: 'center',
      title: '角色名称',
      key: 'roleName',
    },
    {
      align: 'center',
      title: '权限字符',
      key: 'authChar',
    },
    {
      align: 'center',
      title: '角色描述',
      key: 'roleDesc',
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
  const [visible, setVisible] = useState(false)
  let [consentSubmit, setConsentSubmit] = useState(false)
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<Params>({
    authChar: '',
    roleName: '',
  })
  // 新增或者修改的参数
  let [formParams, setFormParams] = useState<{
    id: string | number
    roleName: string
    roleDesc: string
    lockState: number
    authChar: string
  }>({
    id: '',
    roleName: '',
    roleDesc: '',
    lockState: 0,
    authChar: '',
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

  // 初始化数据
  useEffect(() => {
    handleSubmit(submitParams)
  }, [])

  /* 监听弹出框关闭重置 */
  useEffect(() => {
    if (!visible) {
      setConsentSubmit(false)
    }
  }, [visible])

  /* 表格行内 开关状态 */
  const handleSwitchChange = (e, row, index) => {
    let params = { ...row }
    params.lockState = Boolean(e.target.checked)
    lockRoleById({ ids: [row.id] }).then(({ code }: any) => {
      if (code === 0) {
        Message({ content: `修改角色状态成功`, icon: '' })
        handleSubmit(submitParams)
      }
    })
  }

  // 列表搜索接口
  const handleSubmit = (value, pageNumber?: number) => {
    submitParams = {
      authChar: value.secondInput || '',
      roleName: value.firstInput || '',
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
    getRoleList(params)
      .then(({ code, data }: any) => {
        if (code === 200) {
          page.count = Math.ceil(data.total / page.pageSize)
          page.total = data.total
          setLoading(false)
          setPage({ ...page })
          setListData([...data.records])
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
    setFormParams({ ...formParams })
  }

  // 删除
  const handleDelete = (row, e) => {
    delRole({ ids: [row.id] }).then(() => {
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
    if (formParams.roleName === '') {
      return false
    }
    insertOrUpdateRole(formParams).then(({ code }: any) => {
      if (code === 0) {
        Message({ content: `${isAdd ? '新增' : '修改'}角色成功`, icon: '' })
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

  /* 重置数据 */
  const resetFormParams = () => {
    let params = {
      id: '',
      roleName: '',
      roleDesc: '',
      lockState: 0,
      authChar: '',
    }
    setFormParams({ ...params })
  }

  /* 按钮重置 */
  const handleReset = () => {
    handleSubmit(submitParams)
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
      case 'roleName':
        formParams.roleName = e.target.value
        break
      case 'roleDesc':
        formParams.roleDesc = e.target.value
        break
      case 'authChar':
        formParams.authChar = e.target.value
        break
      case 'lockState':
        console.log(Number(e.target.checked))
        formParams.lockState = Number(e.target.checked)
        break
    }
    setFormParams({ ...formParams })
  }
  return (
    <Box className="system-container">
      <SearchBar
        onReset={handleReset}
        onSubmit={(value) => handleSubmit(value, 1)}
        onAdd={handleAdd}
        input={{
          firstInput: {
            label: '角色名称',
            placeholder: '请输入角色名称',
          },
          secondInput: {
            label: '权限字符',
            placeholder: '请输入权限字符',
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
              角色名称
            </FormLabel>
            <Input
              required
              helperText={!formParams.roleName && consentSubmit ? '不能为空!' : ''}
              id="dataInput"
              size="small"
              placeholder="请输入角色名称"
              value={formParams.roleName}
              onChange={(e) => handleInputChange(e, 'roleName')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              角色描述
            </FormLabel>
            <Input
              required
              id="dataInput"
              size="small"
              placeholder="请输入角色描述"
              value={formParams.roleDesc}
              onChange={(e) => handleInputChange(e, 'roleDesc')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              权限字符
            </FormLabel>
            <Input
              required
              // helperText={submitParams.inputValue ? '' : '不能为空!'}
              id="dataInput"
              size="small"
              placeholder="请输入权限字符"
              value={formParams.authChar}
              onChange={(e) => handleInputChange(e, 'authChar')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          {/* <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              状态
            </FormLabel>
            <Switch checked={Boolean(formParams.lockState)} onChange={(e) => handleInputChange(e, 'lockState')} />
          </Grid> */}
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
