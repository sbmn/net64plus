import React from 'react'
import { Link } from 'react-router-dom'
import { fromJS } from 'immutable'
import { shell } from 'electron'

export const COLOR_SCHEME = {
  YELLOW: 0,
  GREEN: 1,
  RED: 2
}

export const ICON_STYLE = {
  DARK: 0,
  BRIGHT: 1
}

export default class SMMButton extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      deleteHover: false
    }
    this.onOpenExternal = this.onOpenExternal.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.deleteEnter = this.deleteEnter.bind(this)
    this.deleteLeave = this.deleteLeave.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }
  onOpenExternal () {
    if (this.props.link) shell.openExternal(this.props.link)
  }
  mouseEnter () {
    this.setState({
      hover: true
    })
    if (this.props.onMouseEnter) this.props.onMouseEnter()
  }
  mouseLeave () {
    this.setState({
      hover: false
    })
    if (this.props.onMouseLeave) this.props.onMouseLeave()
  }
  deleteEnter () {
    this.setState({
      deleteHover: true
    })
  }
  deleteLeave () {
    this.setState({
      deleteHover: false
    })
  }
  onDelete (e) {
    e.stopPropagation()
    this.props.onDelete(this.props.saveId)
  }
  render () {
    const hover = this.state.hover
    const iconSrc = this.props.iconSrc
    const iconSrcHover = this.props.iconSrcHover || iconSrc
    const text = this.props.text
    const colorScheme = this.props.colorScheme || COLOR_SCHEME.YELLOW
    const onDelete = this.props.onDelete
    const enabled = this.props.enabled == null
      ? true
      : this.props.enabled
    let styles = fromJS({
      button: {
        flex: '0 0 auto',
        margin: this.props.noMargin ? '' : '0 10px 10px 10px',
        lineHeight: '40px',
        minWidth: '120px',
        height: '40px',
        backgroundColor: enabled
          ? colorScheme === COLOR_SCHEME.YELLOW
            ? this.state.deleteHover
              ? '#cc0008'
              : this.state.hover ? '#323245' : '#ffe500'
            : colorScheme === COLOR_SCHEME.GREEN
              ? this.state.hover ? '#323245' : '#33cc33'
              : this.state.hover ? '#323245' : '#CC7034'
          : '#666',
        textAlign: 'left',
        cursor: 'pointer',
        outline: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        border: '0',
        borderRadius: '5px',
        boxShadow: '1px 4px 13px 0 rgba(0,0,0,0.5)',
        display: 'inline-block',
        fontSize: this.props.fontSize ? this.props.fontSize : '13px'
      },
      icon: {
        margin: '4px',
        width: this.props.noText ? 'auto' : '32px',
        height: '32px',
        float: 'left',
        borderRadius: '4px',
        padding: this.props.padding ? this.props.padding : ''
      },
      iconDark: {
        backgroundColor: 'rgb(50, 50, 69)'
      },
      iconHover: {
        backgroundColor: '#000'
      },
      cancel: {
        right: '3px',
        top: '-3px',
        width: '34px',
        height: '34px',
        borderRadius: '3px',
        backgroundColor: '#f4f47b',
        zIndex: '100'
      },
      cancelImg: {
        padding: '3px',
        width: '100%',
        height: '100%'
      }
    })
    if (this.props.styles) {
      styles = styles.mergeDeep(fromJS(this.props.styles))
    }
    styles = styles.toJS()
    const iconStyle = Object.assign({},
      styles.icon,
      enabled
        ? hover
          ? styles.iconHover
          : {}
        : {
          backgroundColor: '#666'
        },
      this.props.iconStyle === ICON_STYLE.DARK ? styles.iconDark : {}
    )
    return (
      <div style={styles.button}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onClick={
          enabled
            ? this.props.onClick
              ? this.props.onClick
              : this.props.external
                ? this.onOpenExternal
                : null
            : null
        }
      >
        {
          this.props.link && !this.props.external
            ? <Link to={this.props.link}>
              <ButtonSub
                iconStyle={iconStyle}
                iconSrc={hover ? iconSrcHover : iconSrc}
                text={text}
                enabled={enabled}
                hover={hover}
                noText={this.props.noText}
              />
            </Link>
            : <ButtonSub
              iconStyle={iconStyle}
              iconSrc={hover ? iconSrcHover : iconSrc}
              text={text}
              enabled={enabled}
              hover={hover}
              noText={this.props.noText}
            />
        }
        {
          onDelete &&
          <div style={styles.cancel} onClick={this.onDelete} onMouseEnter={this.deleteEnter} onMouseLeave={this.deleteLeave}>
            <img style={styles.cancelImg} src='img/cancel_yellow.svg' />
          </div>
        }
      </div>
    )
  }
}
class ButtonSub extends React.PureComponent {
  render () {
    const styles = {
      img: {
        width: this.props.noText ? 'auto' : '100%',
        height: '100%'
      },
      text: {
        color: this.props.enabled
          ? this.props.hover
            ? '#fff'
            : '#323245'
          : '#fff',
        float: 'left',
        width: 'auto',
        paddingRight: '5px'
      }
    }
    return (
      <div>
        <div style={this.props.iconStyle}>
          <img style={styles.img} src={this.props.iconSrc} />
        </div>
        <div style={styles.text}>{this.props.text}</div>
      </div>
    )
  }
}
