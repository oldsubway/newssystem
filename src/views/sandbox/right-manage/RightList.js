import React, { useEffect, useState } from 'react'
import request from 'utils/request'
import { Popover, Button, Table, Modal, Tag, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    request('/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ''
        }
      })
      setDataSource(list)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: key => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: item => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMethod(item)
              }}
            />
            <Popover content={<Switch checked={item.pagepermisson} onClick={() => switchMethod(item)}></Switch>} title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
            </Popover>
          </div>
        )
      }
    }
  ]
  const switchMethod = item => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      request.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })
    } else {
      request.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
    }
  }
  const confirmMethod = item => {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        deleteMethod(item)
      }
    })
  }
  const deleteMethod = item => {
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      request.delete(`/rights/${item.id}`)
    } else {
      //浅拷贝
      let [list] = dataSource.filter(data => data.id === item.rightId)
      list.children = list.children.filter(data => data.id !== item.id)
      setDataSource([...dataSource])
      request.delete(`/children/${item.id}`)
    }
  }
  return <Table dataSource={dataSource} columns={columns} />
}
