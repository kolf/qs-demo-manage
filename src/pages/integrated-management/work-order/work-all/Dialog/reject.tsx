import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { Grid, FormLabel, MenuItem, Box } from '@mui/material'
import Input from '@/components/Input'
import Dialog from '@/components/FormDialog'
import { workLevelList, workStateList } from '../SearchBar/data'
import { getUserList } from '@/api/user'
import { getAreaList } from '@/api/area'
import { getByWarning } from '@/api/warning'
import { addOrUpdateByWork } from '@/api/workOrder'
import { getUserInfo } from '@/utils/auth'
import Message from '@/components/Message'
import Button, { LoadingButton } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import Upload from '@/components/Upload'

function index({ onReject }, ref) {
  const rejectInputRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [input, setInput] = useState('')

  useImperativeHandle(ref, () => ({
    handleOpen,
    handleClose,
  }))

  /* 打开弹出框 */
  const handleOpen = () => {
    setVisible(true)
  }
  /* 关闭弹出框 */
  const handleClose = () => {
    setVisible(false)
  }
  /* 确定按钮 */
  const handleSubmit = () => {
    if (!input) {
      Message({ content: '驳回备注不能为空' })
      return
    }
    onReject(input)
  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  return (
    <Dialog title="驳回" open={visible} loadingBtn={false} onClose={handleClose} onSubmit={handleSubmit}>
      <Grid
        container
        spacing={{ xs: 1, md: 2, lg: 4 }}
        sx={{
          padding: '20px 0',
        }}
      >
        <Grid item xs={12} className="from-item">
          <FormLabel component="span" className="label">
            备注
          </FormLabel>
          <Input
            ref={rejectInputRef}
            value={input}
            required
            size="small"
            placeholder="请输入驳回备注"
            // helperText={!input ? '驳回备注不能为空' : ''}
            autoComplete="off"
            onChange={handleInput}
            sx={{
              width: '80%',
            }}
          />
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default forwardRef(index)
