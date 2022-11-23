import React from 'react'

import { connect } from 'react-redux'

import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Dropdown, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
const { Header } = Layout

const TopHeader = props => {
  const { username, role } = JSON.parse(localStorage.getItem('token'))
  const items = [
    { label: role.roleName, key: 'rolename' },
    { label: '退出', danger: true, key: '/login' }
  ]
  const onClick = ({ key }) => {
    if (key === '/login') {
      localStorage.removeItem('token')
      props.history.replace(key)
    }
  }
  return (
    <Header className="site-layout-background">
      {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        onClick: () => props.setCollapsed()
      })}
      <div style={{ float: 'right' }}>
        <span>
          欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来
        </span>
        <Dropdown
          menu={{ items, onClick }}
          arrow={{
            pointAtCenter: true
          }}
          placement="bottom"
          trigger={['hover', 'click']}
        >
          <Avatar size={48} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReduer: { isCollapsed } }) => ({
  isCollapsed
})

const mapDispatchToProps = {
  setCollapsed(payload) {
    return {
      type: 'change-collapsed'
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
