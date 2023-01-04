import { Grow } from '@mui/material'
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import SvgIcon from '@/components/SvgIcon'
import Message from '@/components/Message'
// import { parseGeoJson } from '@/api/parse'
import { useTranslation } from 'react-i18next'
// import { getLanguage } from '@/utils/auth'
// import defaultUploadImg from '@/assets/image/png/upload_default_img.png'
import { fileToBase64 } from '@/utils/ImageFormatConversion'
import './style.scss'

function index(
  {
    show = true,
    onClose,
    onSuccess,
    className,
    style,
    onDeleteFile,
    onUploadHelpClick,
  }: {
    show?: boolean
    onClose?: Function
    onSuccess?: Function
    className?: string
    style?: object
    onDeleteFile?: Function
    onUploadHelpClick?: Function
  },
  ref
) {
  const { t } = useTranslation()
  let [fileNameState, setFileNameState] = useState('')
  const upload = useRef(null)
  const uploadBox = useRef(null)
  const label = useRef(null)
  const inputUpload = useRef(null)
  const hintInfoRef = useRef(null)
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(ref, () => ({
    handleDeleteFileName,
  }))
  /* 初始化 */
  useEffect(() => {
    // document.addEventListener('click', closeUpload)
    /* 拖拽 */
    handleDrop()
  }, [])

  /* 点击空白处关闭 */
  function closeUpload(e) {
    if (!upload.current.contains(e.target)) {
      onClose()
    }
  }

  /* 上传部分点击事件 */
  const handleUploadClick = () => {
    inputUpload.current.click()
  }

  /* 上传文件 */
  function handleChange(file, type) {
    // 判断是点击还是拖拽
    if (type === 'click') {
      file = file.target.files[0]
    } else {
      file = file.dataTransfer.files[0]
    }
    const fileName = file.name
    // 判断文件类型
    const arr = fileName.split('.')
    let suffixName = arr[arr.length - 1]
    if (suffixName !== 'jpg' && suffixName !== 'png' && suffixName !== 'jpeg') {
      Message({
        content: '请上传jpg/jpeg/png格式文件',
      })
      return false
    }
    // let formData = new FormData()
    // formData.append('file', file)
    fileToBase64(file).then((data) => {
      console.log(data)
      onSuccess(data)
    })
  }

  /* 遮罩层单击事件(点击垃圾桶删除事件) */
  function handleMaskClick() {
    onDeleteFile()
    setFileNameState(null)
  }

  /* 清空文件名 */
  function handleDeleteFileName() {
    setFileNameState('')
  }

  /* 遮罩层状态 */
  function showMask(value) {
    // this.makeVisible = value
  }

  /* 拖拽 */
  const handleDrop = () => {
    const drag = uploadBox.current
    // 被拖动的对象进入目标容器
    drag.addEventListener('dragover', (e) => {
      e.preventDefault()
      label.current.style.color = '#d9d9d9'
      uploadBox.current.style.borderColor = '#d9d9d9'
    })
    // 被拖动的对象离开目标容器
    drag.addEventListener('dragleave', (e) => {
      e.preventDefault()
      label.current.style.color = '#999999'
      uploadBox.current.style.borderColor = '#666565'
    })
    // 被拖动的对象进入目标容器，释放鼠标键
    drag.addEventListener('drop', (e) => {
      e.preventDefault()
      label.current.style.color = '#999999'
      uploadBox.current.style.borderColor = '#666565'
      handleChange(e, 'drop')
    })
  }

  /* 鼠标移入移出 */
  const handleUploadHelp = (type) => {
    if (type === 'enter') {
      hintInfoRef.current.style.display = 'block'
    } else {
      hintInfoRef.current.style.display = 'none'
    }
  }

  /* 帮助的点击事件 */
  const handleClickHelp = () => {
    onUploadHelpClick()
  }
  return (
    <>
      <Grow in={show} className={className + ' upload-container'} style={style}>
        <div ref={upload}>
          <div
            ref={hintInfoRef}
            style={{
              display: 'none',
            }}
            className={'hint_info '}
          >
            {t('upload.promptMessage')}
          </div>
          {fileNameState ? (
            <div className="result">
              <div className="img-wapper" onMouseEnter={() => showMask(true)} onMouseLeave={() => showMask(false)}>
                {/* <img src={defaultUploadImg} /> */}
                <div className="make" onClick={handleMaskClick}>
                  <SvgIcon svgName="delete" svgClass="icon"></SvgIcon>
                  <p className="filename">{fileNameState}</p>
                </div>
              </div>
            </div>
          ) : (
            <div ref={uploadBox} className="upload-wapper" onClick={handleUploadClick}>
              <div className="upload">
                <input
                  id="InputUpload"
                  type="file"
                  ref={inputUpload}
                  style={{ display: 'none' }}
                  onChange={(e) => handleChange(e, 'click')}
                ></input>
                <div>
                  <p className="title" ref={label}>
                    上传图片
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Grow>
    </>
  )
}

export default forwardRef(index)
