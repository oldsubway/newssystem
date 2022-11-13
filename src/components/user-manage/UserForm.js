import React, { forwardRef, useContext } from 'react'
import { Form, Input, Select } from 'antd'
import { GlobalContext } from '@/views/sandbox/user-manage/UserList'
const UserForm = forwardRef((props, ref) => {
  const { regionList, rolesList } = props
  const { regionDisabled, setRegionDisabled, roleIdDisabled } = useContext(GlobalContext)

  const changeRole = value => {
    if (value === 1) {
      ref.current.setFieldsValue({
        region: ''
      })
      setRegionDisabled(true)
    } else {
      setRegionDisabled(false)
    }
  }
  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '不能为空'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '不能为空'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={[
          regionDisabled
            ? ''
            : {
                required: true,
                message: '不能为空'
              }
        ]}
      >
        <Select disabled={regionDisabled} options={regionList} />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          roleIdDisabled
            ? { required: false }
            : {
                required: true,
                message: '不能为空'
              }
        ]}
      >
        <Select disabled={roleIdDisabled} options={rolesList} onChange={changeRole} fieldNames={{ value: 'id', label: 'roleName' }} />
      </Form.Item>
    </Form>
  )
})
export default UserForm
