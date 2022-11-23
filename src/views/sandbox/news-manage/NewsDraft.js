import React, { useState, useEffect } from 'react'
import request from 'utils/request'
import { Table, Space, Button, Modal, notification } from 'antd'
import { EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
const { confirm } = Modal

function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
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
      title: '操作',
      render: item => {
        return (
          <Space>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMethod(item)
              }}
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => {
                handleCheck(item.id)
              }}
            />
          </Space>
        )
      }
    }
  ]
  const confirmMethod = item => {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        handleDelete(item)
      }
    })
  }
  const handleDelete = item => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.delete(`/news/${item.id}`)
  }
  const handleCheck = id => {
    setDataSource(dataSource.filter(data => data.id !== id))
    request
      .patch(`/news/${id}`, {
        auditState: 1
      })
      .then(res => {
        notification.info({
          message: '通知',
          description: '成功提交审核,点击立即查看',
          placement: 'bottomRight',
          key: id,
          duration: 2,
          onClick: () => {
            props.history.push('/audit-manage/list')
            props.setOpenKeys(['/audit-manage'])
            notification.close(id)
          }
        })
      })
  }
  return <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }}></Table>
}
const mapDispatchToProps = {
  setOpenKeys(payload) {
    return {
      type: 'change-openkeys',
      payload
    }
  }
}
export default connect(null, mapDispatchToProps)(NewsDraft)
