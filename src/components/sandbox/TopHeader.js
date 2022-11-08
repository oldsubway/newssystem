import React, { useState } from 'react'

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed)
      })}
      {/* {collapsed ? MenuUnfoldOutlined : MenuFoldOutlined} */}
    </Header>
  )
}
