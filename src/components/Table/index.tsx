import React, { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableBody, Paper, Box, Collapse } from '@mui/material'
import Loading from '@/components/Loading'
import nullImg from '@/assets/image/png/data_null.png'
import { MyTableCell, MyPagination, MyTextField } from './component'
import './style.scss'

export interface Column {
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined
  title: string
  key: string
  slot?: any
}

export default function index({
  data,
  columns,
  pagination,
  onPageChange,
  loading,
  extensionColums,
}: {
  data: any
  columns: Array<Column>
  pagination?: any
  onPageChange?: ((event: React.ChangeEvent<unknown>, page: number) => void) | undefined
  loading?: boolean
  extensionColums?: Array<Column>
}) {
  const [listData, setListData] = useState<any>([])

  // 输入框事件
  const handleCurrent = (e: { target: { value: string | number } }) => {
    if (Number(e.target.value) > Math.ceil(pagination.total / pagination.pageSize)) {
      ;(onPageChange as Function)(e, Math.ceil(pagination.total / pagination.pageSize))
    } else if (e.target.value == '' || e.target.value == 0) {
      ;(onPageChange as Function)(e, 1)
    } else {
      ;(onPageChange as Function)(e, e.target.value)
    }
  }

  useEffect(() => {
    setListData(data as any)
  }, [data])

  return (
    <TableContainer
      component={Paper}
      sx={{
        position: 'relative',
      }}
      className="table"
    >
      <Table sx={{ minWidth: 700, fontSize: '12px' }} aria-label="caption table">
        {listData.length > 0 && pagination && (
          <caption className="table-footer">
            <Box className="table-footer-box">
              <span className="count">此次搜索共{pagination.total}条</span>
              <MyPagination
                count={Math.ceil(pagination.total / pagination.pageSize)}
                shape={pagination.shape || 'rounded'}
                page={Number(pagination.pageNumber)}
                color={pagination.color}
                onChange={onPageChange}
              />
              <span className="pagination">
                跳至
                <MyTextField
                  value={pagination.pageNumber}
                  onChange={handleCurrent}
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: pagination.count,
                    type: 'number',
                  }}
                />
                页
              </span>
            </Box>
          </caption>
        )}
        <TableHead className="table-header">
          <TableRow>
            {columns.map((column: Column) => (
              <MyTableCell className="table-cell" align={column.align || 'left'}>
                {column.title}
              </MyTableCell>
            ))}
          </TableRow>
        </TableHead>
        {listData.length > 0 && (
          <TableBody className="table-body">
            {listData.map((row: any, index: React.Key | null | undefined) => (
              <>
                <TableRow
                  key={index}
                  className="body-row"
                  sx={{
                    background: row.open ? '#2E3343' : '',
                  }}
                >
                  {columns.map((column: Column, indexColumn) => (
                    <MyTableCell align={column.align || 'left'}>
                      <Box className="height-24">
                        {column.slot ? <column.slot row={row} index={indexColumn}></column.slot> : row[column.key]}
                      </Box>
                    </MyTableCell>
                  ))}
                </TableRow>
                {/* 二级表格 */}
                {row.secondList && (
                  <SecondTable
                    key={index}
                    open={row.open}
                    data={row.secondList}
                    extensionColums={extensionColums}
                  ></SecondTable>
                )}
              </>
            ))}
            <Loading show={loading}></Loading>
          </TableBody>
        )}
      </Table>
      {data.length === 0 && <Empty loading={loading} />}
    </TableContainer>
  )
}

/* 二级表格 */
function SecondTable({
  open,
  data = [],
  extensionColums,
}: {
  open: boolean
  data: any
  extensionColums?: Array<Column>
}) {
  return (
    <TableRow className="second-table">
      <MyTableCell style={{ padding: 0, border: !open ? 0 : '' }} colSpan={6}>
        <Collapse in={open} timeout={300}>
          <Box className="collapse-box">
            <Box
              sx={{
                maxHeight: data.length > 0 ? '210px' : '',
                overflow: data.length > 0 ? 'auto' : '',
                padding: '0 10px',
              }}
            >
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {data.map((row: any) => (
                    <TableRow>
                      {extensionColums &&
                        extensionColums.map((column) => (
                          <MyTableCell align={column.align || 'left'}>
                            <Box className="height-24">
                              {column.slot ? <column.slot row={row}></column.slot> : row[column.key]}
                            </Box>
                          </MyTableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Collapse>
      </MyTableCell>
    </TableRow>
  )
}

//空状态
function Empty({ height = '484px', hint = '暂无数据', background = '#3B4154', color = '#232734', loading = false }) {
  return (
    <Box
      className="empty"
      sx={{
        height: height,
        background: background,
      }}
    >
      <img src={nullImg} />
      <span
        style={{
          color: color,
        }}
      >
        {hint}
      </span>
      <Loading show={loading}></Loading>
    </Box>
  )
}
