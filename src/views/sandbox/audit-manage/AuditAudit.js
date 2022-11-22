import React, { useState, useEffect } from 'react'
import request from 'utils/request'
import { Button, Space, Table } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
export default function AuditAudit() {
  const [dataSource, setDataSource] = useState([])
  const { username, roleId, region } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get('/news?auditState=1&_expand=category').then(res => {
      const list = res.data
      setDataSource(roleId === 1 ? list : [...list.filter(item => item.author === username), ...list.filter(item => item.roleId === 3 && item.region === region)])
    })
  }, [roleId, region, username])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category => {
        return category.title
      }
    },
    {
      title: '操作',
      render: item => {
        return (
          <Space>
            <Button
              shape="circle"
              type="primary"
              icon={
                <CheckOutlined
                  onClick={() => {
                    handleAudit(item, 2, 1)
                  }}
                />
              }
            ></Button>
            <Button
              shape="circle"
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                handleAudit(item, 3, 0)
              }}
            ></Button>
          </Space>
        )
      }
    }
  ]
  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.patch(`/news/${item.id}`, {
      auditState,
      publishState
    })
  }
  return <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }}></Table>
}
