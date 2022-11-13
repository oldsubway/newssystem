import React, { useEffect, useState } from 'react'
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
  // 侧边栏菜单值  获取所有权限
  const [menu, setMenu] = useState([])
  useEffect(() => {
    //  当前用户的权限
    const {
      role: { rights }
    } = JSON.parse(localStorage.getItem('token'))
    // 判断当前权限是否开启并判断当前用户是否有该权限
    const checkPagepermission = (pagepermisson, key) => {
      return pagepermisson && rights.includes(key)
    }
    //循环渲染菜单
    const renderMenu = data => {
      const new_data = data.map(item => {
        const { title, key, children, pagepermisson } = item
        if (checkPagepermission(pagepermisson, key)) {
          if (children?.length > 0) return getItem(title, key, iconList[key], renderMenu(children))
          return getItem(title, key, iconList[key])
        }
        return false
      })
      return new_data
    }
    request.get('rights?_embed=children').then(res => {
      const data = renderMenu(res.data)
      setMenu(data)
    })
  }, [])

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
