import React from 'react'
import { Table, Tag } from 'antd'
export default function PublishList(props) {
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
        return props.button(item.id)
      }
    }
  ]

  return <Table dataSource={props.dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }}></Table>
}
