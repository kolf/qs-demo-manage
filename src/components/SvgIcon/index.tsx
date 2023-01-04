import React from 'react'
import './svg.scss'

interface Props {
  svgClass?: string
  svgName: string
  style?: object
  onClick?: Function
}

const SvgIcon = (props: Props) => {
  const handleClick = () => {
    props.onClick()
  }
  return (
    <svg
      className={props.svgClass + ' svg'}
      aria-hidden="true"
      v-on="$listeners"
      style={props.style}
      onClick={handleClick}
    >
      <use xlinkHref={'#icon-' + props.svgName} />
    </svg>
  )
}
export default SvgIcon
