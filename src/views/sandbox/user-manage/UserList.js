import React, { useEffect, useRef, useState, createContext } from 'react'
import request from 'utils/request'
import { Button, Table, Modal, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '@/components/user-manage/UserForm'
const { confirm } = Modal
const GlobalContext = createContext()
export { GlobalContext }
export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [regionList, setRegionList] = useState([])
  const [rolesList, setrolesList] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const addForm = useRef()
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const updateForm = useRef()
  const [currentItem, setCurrentItem] = useState([])
  const [regionDisabled, setRegionDisabled] = useState(false)
  const [roleIdDisabled, setRoleIdDisabled] = useState(false)
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get('/users?_expand=role').then(res => {
      setDataSource(roleId === 1 ? res.data : res.data.filter(item => item.username === username || (item.region === region && item.roleId === 3)))
    })
  }, [roleId, region, username])
  useEffect(() => {
    request.get('/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])
  useEffect(() => {
    request.get('/roles').then(res => {
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
              handeleStateChange(item)
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
                openUpdateModal(item)
              }}
            />
          </div>
        )
      }
    }
  ]
  // 是否禁用区域和角色
  const shouldDisabled = isAdd => {
    if (roleId === 1) {
      setRoleIdDisabled(false)
      setRegionDisabled(false)
    } else {
      setRegionDisabled(true)
      setRoleIdDisabled(true)
      if (isAdd) {
        setTimeout(() => {
          addForm.current.setFieldsValue({
            region,
            roleId: 3
          })
          console.log(addForm.current.getFieldValue('roleId'))
        }, 0)
      }
    }
  }
  // 打开添加表单
  const openAddModal = () => {
    setIsAddOpen(true)
    shouldDisabled(true)
  }
  //添加操作
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setIsAddOpen(false)
      request.post('/users', { ...value, roleState: true, default: false }).then(res => {
        setDataSource([...dataSource, { ...res.data, role: rolesList.filter(item => item.id === value.roleId)[0] }])
        addForm.current.resetFields()
      })
    })
  }
  // 打开确认删除对话框
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

  // 更新用户状态
  const handeleStateChange = item => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    request.patch(`/users/${item.id}`, { roleState: item.roleState })
  }
  // 打开编辑表单
  const openUpdateModal = item => {
    setIsUpdateOpen(true)
    setCurrentItem(item)
    shouldDisabled()
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
    <GlobalContext.Provider value={{ regionDisabled, setRegionDisabled, roleIdDisabled, setRoleIdDisabled }}>
      <div>
        <Button type="primary" onClick={openAddModal}>
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
          <UserForm ref={addForm} regionList={regionList} rolesList={rolesList} />
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
          <UserForm ref={updateForm} isUpdate regionList={regionList} rolesList={rolesList} />
        </Modal>
      </div>
    </GlobalContext.Provider>
  )
}
