import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography, MenuItem, Checkbox } from '@mui/material'
import SearchBar from '../../../components/SearchBar/index'
import Table from '@/components/Table'
import Button from '@mui/material/Button'
import Dialog from '@/components/FormDialog'
import Input from '@/components/Input'
import Message from '@/components/Message'
import Tag from '@/components/Tag'
import { getAreaList, insertOrUpdateArea, delArea, getAreaById } from '@/api/area'
import { getUserList } from '@/api/user'
import moment from 'moment'
import '../style.scss'
import { number } from 'echarts'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

interface Params {
  areaCode: string
  areaName: string
}

export default function index() {
  const columns = [
    {
      align: 'center',
      title: '区域编号',
      key: 'areaCode',
    },
    {
      align: 'center',
      title: '区域名称',
      key: 'areaName',
    },
    {
      align: 'center',
      title: '空间信息',
      key: 'spaceInfo',
    },
    {
      align: 'center',
      title: '区域人员',
      // key: 'roleDesc',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            {row.userEntities &&
              row.userEntities.map((item) => {
                return <Tag content={item.userName}></Tag>
              })}
          </>
        )
      },
    },
    {
      align: 'center',
      title: '创建时间',
      key: 'updateTime',
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
  let [userList, setUserList] = useState([])
  const [listData, setListData] = useState([])
  const [visible, setVisible] = useState(false)
  let [consentSubmit, setConsentSubmit] = useState(false)
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<Params>({
    areaCode: '',
    areaName: '',
  })
  // 新增或者修改的参数
  let [formParams, setFormParams] = useState<{
    id: string | number
    areaCode: string
    areaName: string
    spaceInfo: string
    userEntities: Array<number>
  }>({
    id: '',
    areaCode: '',
    areaName: '',
    spaceInfo: '',
    userEntities: [],
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

  // 初始化数据
  useEffect(() => {
    handleSubmit(submitParams)
    // 获取用户列表
    getUserList({ pageNumber: 1, pageSize: 100 }).then(({ data, code }: any) => {
      if (code === 200) {
        setUserList(data.records)
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
      areaName: value.secondInput || '',
      areaCode: value.firstInput || '',
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
    getAreaList(params)
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
    if (row.userEntities) {
      let ids = row.userEntities.map((item) => {
        return item.id
      })
      console.log(ids)
      formParams.userEntities = ids
    } else {
      formParams.userEntities = []
    }

    setFormParams({ ...formParams })
  }

  // 删除
  const handleDelete = (row, e) => {
    delArea({ ids: [row.id] }).then(() => {
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
    if (formParams.areaName === '' || formParams.spaceInfo === '') {
      return false
    }
    let params = { ...formParams }
    // 用户列表数据处理
    let list = []
    formParams.userEntities.forEach((id) => {
      let user = userList.find((user) => {
        return user.id === id
      })
      list.push(user)
    })
    params.userEntities = list
    insertOrUpdateArea(params).then(({ code }: any) => {
      if (code === 0) {
        Message({ content: `${isAdd ? '新增' : '修改'}区域成功`, icon: '' })
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
      areaCode: '',
      areaName: '',
      spaceInfo: '',
      userEntities: [],
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
      case 'areaName':
        formParams.areaName = e.target.value
        break
      case 'spaceInfo':
        formParams.spaceInfo = e.target.value
        break
      case 'userList':
        const {
          target: { value },
        } = e
        formParams.userEntities = typeof value === 'string' ? value.split(',') : value
    }
    setFormParams({ ...formParams })
  }
  return (
    <Box className="system-container">
      <SearchBar
        onSubmit={(value) => handleSubmit(value, 1)}
        onAdd={handleAdd}
        input={{
          firstInput: {
            label: '区域编号',
            placeholder: '请输入区域编号',
          },
          secondInput: {
            label: '区域名称',
            placeholder: '请输入区域名称',
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
        title={isAdd ? '新增区域' : '编辑区域'}
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
              区域名称
            </FormLabel>
            <Input
              required
              helperText={!formParams.areaName && consentSubmit ? '不能为空!' : ''}
              id="dataInput"
              size="small"
              placeholder="请输入区域名称"
              value={formParams.areaName}
              onChange={(e) => handleInputChange(e, 'areaName')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              空间信息
            </FormLabel>
            <Input
              required
              helperText={!formParams.spaceInfo && consentSubmit ? '不能为空!' : ''}
              id="dataInput"
              size="small"
              placeholder="请输入空间信息"
              value={formParams.spaceInfo}
              onChange={(e) => handleInputChange(e, 'spaceInfo')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              区域人员
            </FormLabel>
            <Input
              id="outlined-select-currency"
              select
              placeholder="请输入权限字符"
              value={formParams.userEntities}
              onChange={(e) => handleInputChange(e, 'userList')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
              size="small"
              SelectProps={{
                multiple: true,
                renderValue: (selected) => {
                  let name = ''
                  // @ts-ignore
                  selected.forEach((id) => {
                    let user = userList.find((user) => {
                      return id == user.id
                    })
                    name += user.userName + '，'
                  })
                  return name
                },
              }}
            >
              {userList.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={formParams.userEntities.indexOf(user.id) > -1} />
                  {user.userName}
                </MenuItem>
              ))}
            </Input>
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
