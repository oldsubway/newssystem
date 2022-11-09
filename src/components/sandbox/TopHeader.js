import React, { useState } from 'react'

import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Dropdown, Avatar } from 'antd'
const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  const items = [
    { label: '超级管理员', key: 'item-1' },
    { label: '退出', danger: true, key: 'item-2' }
  ]
  return (
    <Header className="site-layout-background">
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed)
      })}
      {/* {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
      <div style={{ float: 'right' }}>
        欢迎admin回来
        <Dropdown
          menu={{ items }}
          arrow={{
            pointAtCenter: true
          }}
          placement="bottom"
        >
          <Avatar size={48} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
