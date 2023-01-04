import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { Grid, FormLabel, MenuItem, Box } from '@mui/material'
import Input from '@/components/Input'
import Dialog from '@/components/FormDialog'
import { workLevelList, workStateList } from '../SearchBar/data'
import { getUserList } from '@/api/user'
import { getAreaList } from '@/api/area'
import { getByWarning } from '@/api/warning'
import { addOrUpdateByWork, saveRejectByWork, saveWorkData } from '@/api/workOrder'
import { getUserInfo } from '@/utils/auth'
import Message from '@/components/Message'
import Button, { LoadingButton } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import Upload from '@/components/Upload'
import RejectDialog from './reject'
import s from './style.module.scss'

function index({ row, afreshGetList }, ref) {
  let [imageBase64Data, setImageBase64Data] = useState('')
  const rejectDialogRef = useRef(null)
  const [visible, setVisible] = useState(false)
  let [consentSubmit, setConsentSubmit] = useState(false)
  let [userList, setUserList] = useState([])
  let [areaList, setAreaList] = useState([])
  let [warningLis, setWarningList] = useState([])
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
    executeUser: { userName: '' },
    warningMessageCode: '',
    areaId: null,
    remark: '',
    rejectText: '',
    rejectId: '',
    rejecUser: {},
    imageBase64: '',
    workName: '',
    rejectEntities: [],
    contextEntities: [],
  })

  useImperativeHandle(ref, () => ({
    handleOpen,
    handleClose,
  }))

  useEffect(() => {
    Object.keys(formParams).forEach((item) => {
      formParams[item] = row[item]
    })
    setFormParams({ ...formParams })
    console.log(formParams)
  }, [row])

  // 初始化数据
  useEffect(() => {
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
  }, [])

  /* 打开弹出框 */
  const handleOpen = () => {
    setVisible(true)
  }
  /* 关闭弹出框 */
  const handleClose = () => {
    resetFormParams()
    setVisible(false)
  }

  // 输入框内容改变事件
  const handleInputChange = (e, type) => {
    formParams[type] = e.target.value
    setFormParams({ ...formParams })
  }

  /* 保存工单数据 */
  const handleSaveWorkData = () => {
    setConsentSubmit(true)
    let param = {
      imageBase64: imageBase64Data,
      userId: getUserInfo() && getUserInfo().id,
      workId: formParams.id,
      workText: formParams.remark,
    }
    console.log(formParams)
    if (!formParams.remark || !imageBase64Data) {
      Message({ content: '执行任务信息和图片不能为空' })
      return false
    }
    saveWorkData(param)
      .then(({ code }: any) => {
        if (code === 0) {
          Message({ content: '处理成功' })
          setVisible(false)

          resetFormParams()
          afreshGetList()
        }
      })
      .finally(() => {
        setConsentSubmit(false)
      })
  }

  /* 弹出框提交数据 */
  const handleDialogSubmit = () => {
    setConsentSubmit(true)
    if (
      !formParams.context ||
      formParams.executeId === null ||
      formParams.workLeve === null ||
      formParams.areaId === null
    ) {
      return false
    }
    let params = { ...formParams }
    params.workState++

    addOrUpdateByWork(params)
      .then(({ code }: any) => {
        if (code === 0) {
          Message({
            content: `${params.workState === 1 ? '分发' : params.workState === 2 ? '处理' : '完成处理'}成功`,
            icon: '',
          })
          setVisible(false)
          resetFormParams()
          afreshGetList()
        }
      })
      .finally(() => {
        setConsentSubmit(false)
      })
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
      executeUser: { userName: '' },
      rejectText: '',
      rejectId: '',
      rejecUser: {},
      imageBase64: '',
      workName: '',
      rejectEntities: [],
      contextEntities: [],
    }
    setFormParams({ ...(params as any) })
    setImageBase64Data('')
  }

  /* 确定按钮 */
  const handleSubmit = () => {
    if (formParams.workState === 1) {
      handleSaveWorkData()
    } else {
      handleDialogSubmit()
    }
  }

  /* 驳回按钮 */
  const handleRejectBtn = () => {
    rejectDialogRef.current.handleOpen()
  }

  /* 上传成功 */
  const handleUploadSuccess = (data) => {
    // formParams.imageBase64 = data
    // setFormParams({ ...formParams })
    setImageBase64Data(data)
  }

  /* 删除已上传图片 */
  const handleDeleteImage = () => {
    if (formParams.workState === 1) {
      // formParams.imageBase64 = ''
      // setFormParams({ ...formParams })
      setImageBase64Data('')
    }
  }

  /* 驳回弹出框按钮 */
  const handleReject = (rejectText) => {
    if (!rejectText) {
      return false
    }
    let params = {
      rejectId: getUserInfo() && getUserInfo().id,
      userId: getUserInfo() && getUserInfo().id,
      workId: formParams.id,
      rejectText: rejectText,
    }
    saveRejectByWork(params).then(({ code }: any) => {
      if (code === 0) {
        Message({
          content: `驳回成功`,
          icon: '',
        })
        setVisible(false)
        resetFormParams()
        afreshGetList()
      }
    })
  }

  useEffect(() => {
    console.log(formParams)
  }, [JSON.stringify(formParams)])
  return (
    <Dialog
      title="工单"
      open={visible}
      loadingBtn={false}
      onClose={handleClose}
      action={
        <>
          {formParams.workState === 2 && <Button>撤回提交</Button>}
          {formParams.workState === 2 && <Button onClick={handleRejectBtn}>驳回</Button>}

          {formParams.workState < 3 && (
            <Button onClick={handleSubmit}>
              {formParams.workState === 0 ? '分发' : formParams.workState === 1 ? '处理' : '完成'}
            </Button>
          )}
        </>
      }
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
            工单编号:
          </FormLabel>
          <span className={s.font}>{formParams.workCode}</span>
        </Grid>
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            工单名称:
          </FormLabel>
          <span className={s.font}>{formParams.workName}</span>
        </Grid>
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            工单内容:
          </FormLabel>
          <span className={s.font}>{formParams.context}</span>
        </Grid>
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            工单类型:
          </FormLabel>
          <span className={s.font}>{workLevelList[formParams.workLeve]}</span>
        </Grid>
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            所属区域:
          </FormLabel>
          <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#427df3' }} className={s.font}>
            {formParams.areaId}
          </span>
        </Grid>

        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            工单状态:
          </FormLabel>
          <span className={s.font}>{workStateList[formParams.workState]}</span>
        </Grid>
        <Grid
          item
          xs={12}
          className="from-item"
          style={{
            position: 'relative',
          }}
        >
          <FormLabel component="span" className="label">
            执行人员:
          </FormLabel>
          {formParams.workState === 0 ? (
            <Input
              id="outlined-select-currency"
              select
              placeholder="请选择执行人员"
              value={formParams.executeId}
              helperText={!formParams.executeId && consentSubmit ? '不能为空!' : ''}
              onChange={(e) => handleInputChange(e, 'executeId')}
              autoComplete="off"
              sx={{
                width: '70%',
              }}
              size="small"
              disabled={formParams.workState != 0}
            >
              {userList.map((user, index) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.userName}
                </MenuItem>
              ))}
            </Input>
          ) : (
            <span className={s.font}>{formParams.executeUser && formParams.executeUser.userName}</span>
          )}
          {formParams.workState === 1 && (
            <div
              style={{
                position: 'absolute',
                right: 0,
              }}
            >
              <Button>追加分配</Button>
            </div>
          )}
        </Grid>

        {formParams.workState > 0 &&
          formParams.rejectEntities.length > 0 &&
          formParams.rejectEntities.map((item, index) => (
            <>
              <Grid item xs={4} className="from-item">
                <FormLabel component="span" className="label">
                  驳回人{index + 1}:
                </FormLabel>
                <span className={s.font}>{item.rejectUser.userName}</span>
              </Grid>
              <Grid item xs={8} className="from-item">
                <FormLabel component="span" className="label">
                  驳回信息{index + 1}:
                </FormLabel>
                <span className={s.font}>{item.rejectText}</span>
              </Grid>
            </>
          ))}

        {formParams.workState > 0 &&
          formParams.contextEntities.length > 0 &&
          formParams.contextEntities.map((item, index) => (
            <>
              <Grid item xs={6} className="from-item">
                <FormLabel component="span" className="label">
                  执行任务信息{index + 1}:
                </FormLabel>
                <span className={s.font}>{item.workText}</span>
              </Grid>
              <Grid item xs={6} className="from-item">
                <FormLabel component="span" className="label">
                  提交时间{index + 1}:{item.createTime}
                </FormLabel>
              </Grid>
              <Grid
                item
                xs={12}
                className="from-item"
                style={{
                  paddingTop: '5px',
                }}
              >
                <FormLabel component="span" className="label">
                  图片文件{index + 1}:
                </FormLabel>
                <Box style={{ width: '100px', height: '100px', overflow: 'auto', position: 'relative' }}>
                  <img
                    src={item.imageBase64}
                    style={
                      {
                        width: '90%',
                        '&:hover': {
                          opacity: 0.6,
                        },
                      } as any
                    }
                    onClick={handleDeleteImage}
                  ></img>
                </Box>
              </Grid>
            </>
          ))}

        {formParams.workState == 1 && (
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              执行任务信息:
            </FormLabel>
            {formParams.workState === 1 ? (
              <Input
                id="remark"
                required
                size="small"
                placeholder="请输入执行任务信息"
                value={formParams.remark}
                onChange={(e) => handleInputChange(e, 'remark')}
                autoComplete="off"
                sx={{
                  width: '80%',
                }}
              />
            ) : (
              <span className={s.font}>{formParams.remark}</span>
            )}
          </Grid>
        )}

        {formParams.workState == 1 && (
          <Grid item xs={12} className="from-item">
            <FormLabel component="span" className="label">
              图片文件:
            </FormLabel>
            {formParams.workState === 1 && !imageBase64Data ? (
              <Upload onSuccess={handleUploadSuccess}></Upload>
            ) : (
              <Box style={{ width: '100px', height: '100px', overflow: 'auto', position: 'relative' }}>
                <img
                  src={imageBase64Data}
                  style={
                    {
                      width: '90%',
                      '&:hover': {
                        opacity: 0.6,
                      },
                    } as any
                  }
                  onClick={handleDeleteImage}
                ></img>
                {formParams.workState === 1 && (
                  <SvgIcon
                    svgName="close"
                    onClick={handleDeleteImage}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%,-50%)',
                      zIndex: '999',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.6,
                      },
                    }}
                  ></SvgIcon>
                )}
              </Box>
            )}
          </Grid>
        )}
      </Grid>
      <RejectDialog ref={rejectDialogRef} onReject={handleReject}></RejectDialog>
    </Dialog>
  )
}

export default forwardRef(index)
