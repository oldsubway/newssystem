import React, { useState, useEffect, useRef, useContext } from 'react'
import request from 'utils/request'
import { Table, Space, Button, Modal, Form, Input, message } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

const EditableContext = React.createContext(null)
// 可编辑行
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
// 可编辑单元格
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

export default function NewsCategory(props) {
  const [dataSource, setDataSource] = useState([])
  const [addForm] = Form.useForm()
  const [isAdd, setIsAdd] = useState(false)
  useEffect(() => {
    request.get(`/categories`).then(res => {
      setDataSource(res.data)
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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: record => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave
      })
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
    request.delete(`/categories/${item.id}`)
  }
  const handleAdd = async () => {
    if (!addForm.getFieldValue('title')) return message.error('字段不能为空')
    setIsAdd(true)
    const res = await addForm.validateFields()
    const newCategory = {
      title: res.title,
      value: res.title
    }
    const { data } = await request.post('/categories', newCategory)
    setDataSource([...dataSource, data])
    addForm.setFieldValue('title', '')
    setIsAdd(false)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }
  // 保存编辑结果
  const handleSave = record => {
    setDataSource(
      dataSource.map(item => {
        if (item.id === record.id) {
          return {
            id: record.id,
            title: record.title,
            value: record.title
          }
        }
        return item
      })
    )
    axios.patch(`/categories/${record.id}`, {
      id: record.id,
      title: record.title,
      value: record.title
    })
  }
  return (
    <div>
      <Form form={addForm} labelAlign="right" layout="inline" style={{ marginBottom: '20px' }}>
        <Form.Item name="title" required>
          <Input placeholder="请输入要添加的类别" />
        </Form.Item>
        <Form.Item>
          <Button disabled={isAdd} type="primary" onClick={handleAdd}>
            添加
          </Button>
        </Form.Item>
      </Form>
      <Form></Form>
      <Table components={components} dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 6 }}></Table>
    </div>
  )
}
