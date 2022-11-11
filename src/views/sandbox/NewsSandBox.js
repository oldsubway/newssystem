import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Home from './home/Home'
import UserList from './user-manage/UserList'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import NoPermission from '../nopermission/NoPermission'
import TopHeader from '../../components/sandbox/TopHeader'
import SlideMenu from '../../components/sandbox/SlideMenu'

import './NewsSandBox.css'
import { Layout } from 'antd'
const { Content } = Layout

export default function NewsSandBox() {
  return (
    <Layout>
      <SlideMenu />
      <Layout className="site-layout">
        <TopHeader />

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserList} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />
            <Redirect from="/" exact to="/home" />
            <Route path="*" component={NoPermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
