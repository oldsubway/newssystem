import React, { useEffect, useRef, useState } from 'react'
import request from 'utils/request'
import { Button, Table, Modal, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '@/components/user-manage/UserForm'
const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [regionList, setRegionList] = useState([])
  const [rolesList, setrolesList] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const addForm = useRef()
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const updateForm = useRef()
  const [currentItem, setCurrentItem] = useState([])
  // 状态提升控制区域是否禁用
  const [regionDisabled, setRegionDisabled] = useState(false)
  useEffect(() => {
    request('/users?_expand=role').then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    request('/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])
  useEffect(() => {
    request('/roles').then(res => {
      setrolesList(res.data)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        { text: '全球', value: '全球' },
        ...regionList.map(item => ({
          text: item.title,
          value: item.title
        }))
      ],
      onFilter: (value, record) => {
        if (value === '全球') {
          return record.region === ''
        }
        return record.region === value
      },
      render: region => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => role?.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onClick={() => {
              handleChange(item)
            }}
          ></Switch>
        )
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
              disabled={item.default}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => {
                handleUpdate(item)
              }}
            />
          </div>
        )
      }
    }
  ]
  // 删除操作
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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    request.delete(`/users/${item.id}`)
  }
  //添加操作
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setIsAddOpen(false)
      setRegionDisabled(false)
      addForm.current.resetFields()
      request.post('/users', { ...value, roleState: true, default: false }).then(res => {
        setDataSource([...dataSource, { ...res.data, role: rolesList.filter(item => item.id === value.roleId)[0] }])
      })
    })
  }
  // 改变用户状态
  const handleChange = item => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    request.patch(`/users/${item.id}`, { roleState: item.roleState })
  }
  // 更新操作
  const handleUpdate = item => {
    setIsUpdateOpen(true)
    setCurrentItem(item)
    if (item.roleId === 1) {
      setRegionDisabled(true)
    } else {
      setRegionDisabled(false)
    }
    setTimeout(() => {
      updateForm.current.setFieldsValue(item)
    }, 0)
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setIsUpdateOpen(false)
      updateForm.current.resetFields()
      setDataSource(
        dataSource.map(item => {
          if (item.id === currentItem.id) {
            console.log(currentItem)
            return {
              ...item,
              ...value,
              role: rolesList.filter(item => item.id === value.roleId)[0]
            }
          }
          return item
        })
      )
      request.patch(`/users/${currentItem.id}`, value)
    })
  }
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsAddOpen(true)
          setRegionDisabled(false)
        }}
      >
        添加用户
      </Button>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }} />
      {/* 添加对话框表单 */}
      <Modal
        open={isAddOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddOpen(false)
          addForm.current.resetFields()
        }}
        onOk={addFormOk}
      >
        <UserForm
          ref={addForm}
          regionList={regionList}
          rolesList={rolesList}
          regionDisabled={regionDisabled}
          setRegionDisabled={flag => {
            console.log(flag)
            setRegionDisabled(flag)
          }}
        />
      </Modal>
      {/* 更新对话框表单 */}
      <Modal
        open={isUpdateOpen}
        title="编辑用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false)
        }}
        onOk={updateFormOk}
      >
        <UserForm
          ref={updateForm}
          regionList={regionList}
          rolesList={rolesList}
          regionDisabled={regionDisabled}
          setRegionDisabled={flag => {
            console.log(flag)
            setRegionDisabled(flag)
          }}
        />
      </Modal>
    </div>
  )
}
