import React, { useEffect, useState } from 'react'
import request from 'utils/request'
import { Button, Table, Modal, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rigtList, setRightList] = useState([])
  const [currentId, setCurrentId] = useState()
  const [currentRights, setCurrentRights] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  //获取角色列表
  useEffect(() => {
    request('/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
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
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalOpen(true)
                setCurrentRights(item.rights)
                setCurrentId(item.id)
              }}
            />
          </div>
        )
      }
    }
  ]
  const confirmMethod = item => {
    confirm({
      title: '你确定要删除吗??',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        deleteMethod(item)
      }
    })
  }
  const deleteMethod = item => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.delete(`/roles/${item.id}`)
  }

  const handleOk = () => {
    const newData = dataSource.map(item => {
      if (item.id === currentId) {
        return { ...item, rights: currentRights }
      }
      return item
    })
    setDataSource(newData)
    setIsModalOpen(false)
    request.patch(`/roles/${currentId}`, { rights: currentRights })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    request('/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])
  const onCheck = checkedKeys => {
    setCurrentRights(checkedKeys)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />
      <Modal title="权限分配" okText="确定" cancelText="取消" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree checkable checkedKeys={currentRights} onCheck={onCheck} treeData={rigtList} />
      </Modal>
    </div>
  )
}
