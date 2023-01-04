import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, FormLabel, Grid, Switch, Popover, Typography, MenuItem, Checkbox } from '@mui/material'
import SearchBar, { FormParams } from './SearchBar/index'
import Table from '@/components/Table'
import Button from '@mui/material/Button'
import Dialog from '@/components/FormDialog'
import Input from '@/components/Input'
import Message from '@/components/Message'
import Tag from '@/components/Tag'
import { getAreaList } from '@/api/area'
import { addOrUpdateByWork } from '@/api/workOrder'
import { getListWord } from '@/api/workOrder'
import { getUserList } from '@/api/user'
import { getByWarning } from '@/api/warning'
import { workLevelList, workStateList } from './SearchBar/data'
import CheckDialog from './Dialog'
import MapDialog from './Dialog/MapDialog'
import { getUserInfo } from '@/utils/auth'
// import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import '../style.scss'
import moment from 'moment'

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

// 紧急程度列表
let urgencyLeveList = [1, 2, 3, 4]

export default function index({ onBack }) {
  const columns = [
    {
      align: 'center',
      title: '工单编号',
      key: 'workCode',
    },
    {
      align: 'center',
      title: '工单名称',
      key: 'workName',
    },
    // {
    //   align: 'center',
    //   title: '工单内容',
    //   key: 'context',
    // },
    {
      align: 'center',
      title: '创建人',
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
      title: '当前状态',
      key: 'workState',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>
              {row.workState === 0
                ? '待分发'
                : row.workState === 1
                ? '待处理'
                : row.workState === 2
                ? ' 审核中'
                : '已办结'}
            </span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '工单类型',
      key: 'workLeve',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>{row.workLeve === 0 ? '内涝工单' : row.workLeve === 1 ? '沉降工单' : '垃圾处理工单'}</span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '派发类型',
      key: 'distributeType',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>{row.distributeType === 1 ? '自动派发' : '手动派发'}</span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '紧急程度',
      key: 'urgencyLeve',
    },
    {
      align: 'center',
      title: '创建时间',
      key: 'createTime',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            <span>{moment(row.createTime).format('YYYY-MM-DD hh:mm')}</span>
          </>
        )
      },
    },
    {
      align: 'center',
      title: '操作',
      key: 'operate',
      slot: function ({ row }: { row: any }) {
        return (
          <>
            {row.workState === 0 && (
              <Button
                onClick={() => handleEdit(row)}
                style={{
                  fontSize: '12px',
                }}
              >
                编辑
              </Button>
            )}
            <Button
              onClick={(e) => handleCheck(row)}
              style={{
                fontSize: '12px',
              }}
            >
              {row.workState === 0 ? '分发' : row.workState === 1 ? '处理' : row.workState === 2 ? ' 审核' : '查看'}
            </Button>
          </>
        )
      },
    },
  ]
  const searchBarRef = useRef(null)
  // 定时器
  let timer: NodeJS.Timeout | null | undefined = null
  // 状态变量
  let checkDialogRef = useRef(null)
  let MapDialogRef = useRef(null)
  let [areaList, setAreaList] = useState([])
  let [userList, setUserList] = useState([])
  let [warningList, setWarningList] = useState([])
  const [listData, setListData] = useState([])
  const [visible, setVisible] = useState(false)
  let [consentSubmit, setConsentSubmit] = useState(false)
  // 搜索的参数
  let [submitParams, setSubmitParams] = useState<FormParams>({
    workCode: '',
    currentName: '',
    createName: '',
    startTime: null,
    endTime: null,
    workLeve: -1,
    workState: -1,
    startTimeLong: null,
    endTimeLong: null,
  })
  // 新增或者修改的参数
  let [formParams, setFormParams] = useState<any>({
    id: '',
    workCode: '',
    currentId: null,
    createName: '',
    startTime: null,
    endTime: null,
    workLeve: 0,
    workState: 0,
    context: '',
    executeId: null,
    warningMessageCode: '',
    areaId: null,
    remark: '',
    executeUser: {},
    rejectText: '',
    rejectId: '',
    rejecUser: {},
    imageBase64: '',
    localCoord: '',
    workName: '',
    rejectEntities: [],
    contextEntities: [],
    urgencyLeve: 1,
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
    //  获取区域列表
    getAreaList({ pageNumber: 1, pageSize: 100 }).then(({ data, code }: any) => {
      if (code === 200) {
        setAreaList(data.records)
      }
    })

    //  获取预警列表
    getByWarning().then(({ data, code }: any) => {
      if (code === 200) {
        setWarningList(data)
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
      workCode: value.workCode,
      currentName: value.currentName,
      createName: value.createName,
      startTime: value.startTime,
      endTime: value.endTime,
      workLeve: value.workLeve,
      workState: value.workState,
      startTimeLong: new Date(value.startTime).getTime(),
      endTimeLong: new Date(value.endTime).getTime(),
    }
    submitParams.startTime = new Date(new Date(value.startTime).getTime())
    setSubmitParams({ ...submitParams })
    if (pageNumber) {
      page.pageNumber = 1
      setPage({ ...page })
    }
    const params = {
      ...page,
      ...submitParams,
    }
    setLoading(true)
    getListWord(params)
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
    resetFormParams()
    setIsAdd(true)
    setVisible(true)
  }

  /* 按钮重置 */
  const handleReset = (params) => {
    handleSubmit(params)
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

  /* 弹出框提交数据 新增/修改*/
  const handleDialogSubmit = () => {
    setConsentSubmit(true)

    if (!formParams.context || !formParams.areaId || !formParams.workName) {
      return false
    }
    if (!formParams.localCoord) {
      Message({ content: '经纬度未选择' })
      return false
    }
    let params = { ...formParams }
    // 新增状态
    if (isAdd) {
      const uuid = uuidv4().replace(/-/g, '')
      params.workCode = uuid
      params.distributeType = 2
    }
    // TODO:暂时存放当前用户Id
    params.currentId = getUserInfo() && getUserInfo().id
    params.createId = getUserInfo() && getUserInfo().id
    // 用户列表数据处理
    // let list = []
    // formParams.userEntities.forEach((id) => {
    //   let user = userList.find((user) => {
    //     return user.id === id
    //   })
    //   list.push(user)
    // })
    // params.userEntities = list
    addOrUpdateByWork(params).then(({ code }: any) => {
      if (code === 0) {
        if (isAdd) {
          searchBarRef.current.handleReset()
        }
        Message({ content: `${isAdd ? '新增' : '修改'}工单成功`, icon: '' })
        handleSubmit(submitParams)
        resetFormParams()
        setVisible(false)
      }
    })
  }

  /* 弹出框关闭 */
  const handleDialogClose = () => {
    setVisible(false)
    resetFormParams()
  }

  /* 重置数据 */
  const resetFormParams = () => {
    let params = {
      id: '',
      workCode: '',
      currentId: null,
      createName: '',
      startTime: null,
      endTime: null,
      workLeve: 0,
      workState: 0,
      context: '',
      executeId: null,
      warningMessageCode: '',
      areaId: null,
      remark: '',
      executeUser: {},
      rejectText: '',
      rejectId: '',
      rejecUser: {},
      imageBase64: '',
      localCoord: '',
      workName: '',
      rejectEntities: [],
      contextEntities: [],
      urgencyLeve: 1,
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
    // 请求
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
    formParams[type] = e.target.value
    setFormParams({ ...formParams })
  }

  // 返回
  const handleBack = () => {
    onBack()
  }

  /* 查看 */
  const handleCheck = (row) => {
    checkDialogRef.current.handleOpen()
    Object.keys(formParams).forEach((item) => {
      formParams[item] = row[item]
    })
    setFormParams({ ...formParams })
  }

  /* 重新获取数据列表 */
  const handleAfreshGetList = () => {
    handleSubmit(submitParams)
  }

  /* 获取经纬度列表 */
  const handleGetLonAndLan = () => {
    MapDialogRef.current.handleOpen()
  }

  /* 地图弹出框中确认按钮 */
  const handleMapConfirm = (data) => {
    formParams.localCoord = `${data.lng},${data.lat}`
    setFormParams({ ...formParams })
  }

  return (
    <Box className="main-container">
      <SearchBar
        onSubmit={(value) => handleSubmit(value, 1)}
        onAdd={handleAdd}
        onBack={handleBack}
        onReset={handleReset}
        ref={searchBarRef}
      ></SearchBar>
      <Divider className="divider" />
      <Table
        data={listData}
        columns={columns as any}
        pagination={page}
        onPageChange={handlePageChange}
        loading={loading}
      ></Table>

      {/* 新增修改弹出框 */}
      <Dialog
        title={isAdd ? '新增工单' : '编辑工单'}
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
              工单名称
            </FormLabel>
            <Input
              required
              helperText={!formParams.workName && consentSubmit ? '不能为空!' : ''}
              size="small"
              placeholder="请输入工单名称"
              value={formParams.workName}
              onChange={(e) => handleInputChange(e, 'workName')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              工单内容
            </FormLabel>
            <Input
              required
              helperText={!formParams.context && consentSubmit ? '不能为空!' : ''}
              size="small"
              placeholder="请输入工单内容"
              value={formParams.context}
              onChange={(e) => handleInputChange(e, 'context')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            />
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              工单类型
            </FormLabel>
            <Input
              id="outlined-select-currency"
              select
              // helperText={formParams.workLeve !== '' && consentSubmit ? '不能为空!' : ''}
              placeholder="请选择工单类型"
              value={formParams.workLeve}
              onChange={(e) => handleInputChange(e, 'workLeve')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
              size="small"
              // SelectProps={{
              //   multiple: true,
              //   renderValue: (selected) => {
              //     let name = ''
              //     selected.forEach((id) => {
              //       let user = userList.find((user) => {
              //         return id == user.id
              //       })
              //       name += user.userName + '，'
              //     })
              //     return name
              //   },
              // }}
            >
              {workLevelList.map((workLeve, index) => (
                <MenuItem key={index} value={index}>
                  {workLeve}
                </MenuItem>
              ))}
            </Input>
          </Grid>
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              所属区域
            </FormLabel>
            <Input
              id="outlined-select-currency"
              placeholder="请输入所属区域"
              value={formParams.areaId}
              helperText={formParams.areaId == null && consentSubmit ? '不能为空!' : ''}
              onChange={(e) => handleInputChange(e, 'areaId')}
              autoComplete="off"
              sx={{
                width: '70%',
              }}
              size="small"
            ></Input>
            <Button
              style={{
                marginLeft: '15px',
                fontSize: '14px',
              }}
              onClick={handleGetLonAndLan}
            >
              选择地址
            </Button>
          </Grid>

          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              紧急程度
            </FormLabel>
            <Input
              required
              select
              size="small"
              placeholder="紧急程度"
              value={formParams.urgencyLeve}
              onChange={(e) => handleInputChange(e, 'urgencyLeve')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            >
              {urgencyLeveList.map((urgencyLeve, index) => (
                <MenuItem key={urgencyLeve} value={urgencyLeve}>
                  {urgencyLeve}
                </MenuItem>
              ))}
            </Input>
          </Grid>

          {/* <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              关联预警
            </FormLabel>
            <Input
              required
              select
              size="small"
              placeholder="请输入关联预警"
              value={formParams.warningMessageCode}
              onChange={(e) => handleInputChange(e, 'warningMessageCode')}
              autoComplete="off"
              sx={{
                width: '80%',
              }}
            >
              {warningList.map((warning, index) => (
                <MenuItem key={warning.warningCode} value={warning.warningCode}>
                  {warning.context}
                </MenuItem>
              ))}
            </Input>
          </Grid> */}
          {/* {!isAdd && (
            <Grid item xs={12} className="from-item">
              <FormLabel component="span" className="label">
                备注信息
              </FormLabel>
              <Input
                required
                size="small"
                placeholder="请输入备注信息"
                value={formParams.remark}
                onChange={(e) => handleInputChange(e, 'remark')}
                autoComplete="off"
                sx={{
                  width: '80%',
                }}
              />
            </Grid>
          )} */}
        </Grid>
      </Dialog>

      {/* 查看弹出框 */}
      <CheckDialog ref={checkDialogRef} row={formParams} afreshGetList={handleAfreshGetList}></CheckDialog>

      {/* 地图弹出框 */}
      <MapDialog ref={MapDialogRef} onConfirm={handleMapConfirm} data={formParams.localCoord}></MapDialog>
    </Box>
  )
}
