import React, { useState, useEffect } from 'react'
import request from 'utils/request'
import { Table, Button, Tag, notification } from 'antd'

export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => {
        return <b>{id}</b>
      }
    },
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: auditState => {
        const auditList = ['未审核', '审核中', '已通过', '未通过']
        const colorList = ['', 'orange', 'green', 'red']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: item => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button
                onClick={() => {
                  handleRevert(item)
                }}
              >
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button
                danger
                onClick={() => {
                  handlePublish(item)
                }}
              >
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdate(item)
                }}
              >
                更新
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const handleRevert = item => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.patch(`/news/${item.id}`, { auditState: 0 })
    notification.info({
      message: '通知',
      description: <span style={{ color: '#d46b08' }}>已撤销</span>,
      placement: 'bottomRight'
    })
  }
  const handleUpdate = item => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  const handlePublish = item => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.patch(`/news/${item.id}`, {
      publishState: 2
    })
  }
  return <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }}></Table>
}
