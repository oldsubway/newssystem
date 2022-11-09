import React, { useCallback, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import request from '../../utils/request'
import './SlideMenu.css'

import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
const { Sider } = Layout

//一级菜单key值数组
const rootSubmenuKeys = ['/home', '/user-manage', '/right-manage', '/news-manage', '/audit-manage', '/publish-manage']
//图标映射对象
const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <UploadOutlined />,
  '/news-manage': <VideoCameraOutlined />,
  '/audit-manage': <UserOutlined />,
  '/publish-manage': <UserOutlined />
}

function SlideMenu(props) {
  //循环渲染菜单
  const renderMenu = useCallback(data => {
    const new_data = data.map(item => {
      const { title, key, children, pagepermisson } = item
      if (pagepermisson === 1) {
        if (children?.length > 0) return getItem(title, key, iconList[key], renderMenu(children))
        return getItem(title, key, iconList[key])
      }
      return false
    })
    return new_data
  }, [])
  // 侧边栏菜单值
  const [menu, setMenu] = useState([])
  useEffect(() => {
    request.get('rights?_embed=children').then(res => {
      const data = renderMenu(res.data)
      setMenu(data)
    })
  }, [renderMenu])

  //得到每一个菜单项
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type
    }
  }

  const [collapsed] = useState(false)

  // 只展开当前父菜单
  const [openKeys, setOpenKeys] = useState([props.location.pathname?.match(/\/(\w+)?(-\w+)?/)[0]])
  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">全球新闻发布系统</div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[props.location.pathname]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menu}
        onSelect={({ key }) => {
          props.history.push(key)
        }}
      />
    </Sider>
  )
}

export default withRouter(SlideMenu)
