import * as React from 'react'
import Button, { LoadingButton } from '@/components/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2, background: '#3B4154' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

export default function CustomizedDialogs({
  children,
  title,
  open,
  onClose,
  onSubmit,
  loadingBtn = false,
  closeText = '取消',
  submitText = '确认',
  action,
}: {
  children: any
  title: string
  open: boolean
  onClose?: Function
  onSubmit?: Function
  loadingBtn?: boolean
  closeText?: string
  submitText?: string
  action?: any
}) {
  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <div>
      <BootstrapDialog
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          position: 'absolute',
        }}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          sx={{
            background: '#3B4154',
          }}
        >
          {children}
        </DialogContent>

        <DialogActions
          sx={{
            background: '#3B4154',
          }}
        >
          {action ? (
            action
          ) : (
            <>
              <Button autoFocus onClick={handleClose}>
                {closeText}
              </Button>
              <LoadingButton autoFocus onClick={handleSubmit} loading={loadingBtn}>
                {submitText}
              </LoadingButton>
            </>
          )}
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
