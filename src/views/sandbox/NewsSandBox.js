import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import SlideMenu from '../../components/sandbox/SlideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import Home from './home/Home'
import UserList from './user-manage/UserList'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import NoPermission from '../nopermission/NoPermission'
export default function NewsSandBox() {
  return (
    <div>
      <SlideMenu />
      <TopHeader />
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/user-manage/list" component={UserList} />
        <Route path="/right-manage/role/list" component={RoleList} />
        <Route path="/right-manage/right/list" component={RightList} />
        <Redirect from="/" exact to="/home" />
        <Route path="*" component={NoPermission} />
      </Switch>
    </div>
  )
}
