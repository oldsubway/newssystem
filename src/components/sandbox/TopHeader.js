import React, { useState } from 'react'

import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Dropdown, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
const { Header } = Layout

const TopHeader = props => {
  const [collapsed, setCollapsed] = useState(false)
  const { username, role } = JSON.parse(localStorage.getItem('token'))
  const items = [
    { label: role.roleName, key: 'item-1' },
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
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed)
      })}
      {/* {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
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
          // onOpenChange
        >
          <Avatar size={48} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
export default withRouter(TopHeader)
