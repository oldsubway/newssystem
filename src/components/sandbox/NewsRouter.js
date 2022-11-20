import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import request from 'utils/request'

import Home from '@/views/sandbox/home/Home'
import UserList from '@/views/sandbox/user-manage/UserList'
import RightList from '@/views/sandbox/right-manage/RightList'
import RoleList from '@/views/sandbox/right-manage/RoleList'
import NoPermission from '@/views/nopermission/NoPermission'
import NewsAdd from '@/views/sandbox/news-manage/NewsAdd'
import NewsDraft from '@/views/sandbox/news-manage/NewsDraft'
import NewsPreview from '@/views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '@/views/sandbox/news-manage/NewsUpdate'
import NewsCategory from '@/views/sandbox/news-manage/NewsCategory'
import AuditAudit from '@/views/sandbox/audit-manage/AuditAudit'
import AuditList from '@/views/sandbox/audit-manage/AuditList'
import PublishUnpublished from '@/views/sandbox/publish-manage/PublishUnpublished'
import PublishPublished from '@/views/sandbox/publish-manage/PublishPublished'
import PublishSunset from '@/views/sandbox/publish-manage/PublishSunset'
// 所有菜单路径映射
const LocalRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/preview/:id': NewsPreview,
  '/news-manage/update/:id': NewsUpdate,
  '/news-manage/category': NewsCategory,
  '/audit-manage/audit': AuditAudit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': PublishUnpublished,
  '/publish-manage/published': PublishPublished,
  '/publish-manage/sunset': PublishSunset
}
export default function NewsRouter() {
  const [localRouter, setLocalRouter] = useState([])
  useEffect(() => {
    Promise.all([request.get('/rights'), request.get('/children')]).then(res => {
      setLocalRouter([...res[0].data, ...res[1].data])
    })
  }, [])
  // 检查菜单是否存在以及页面权限和路有权限是否为1
  const checkRoute = item => {
    return (LocalRouterMap[item.key] && item.pagepermisson) || item.routepermisson
  }
  const {
    role: { rights }
  } = JSON.parse(localStorage.getItem('token'))
  // 判断当前用户是否有权限
  const checkUserPagepermission = item => {
    return rights.includes(item.key)
  }
  return (
    <Switch>
      {localRouter.map(item => {
        if (checkRoute(item) && checkUserPagepermission(item)) {
          return <Route key={item.key} path={item.key} component={LocalRouterMap[item.key]} exact />
        }
        return null
      })}
      <Redirect from="/" to="/home" exact />
      {localRouter.length > 0 && <Route path="*" component={NoPermission} />}
    </Switch>
  )
}
