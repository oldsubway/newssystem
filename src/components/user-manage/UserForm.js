import React, { forwardRef } from 'react'
import { Form, Input, Select } from 'antd'
const UserForm = forwardRef((props, ref) => {
  const { regionList, rolesList, regionDisabled, setRegionDisabled } = props
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
          {
            required: true,
            message: '不能为空'
          }
        ]}
      >
        <Select
          options={rolesList}
          fieldNames={{ value: 'id', label: 'roleName' }}
          onChange={value => {
            if (value === 1) {
              ref.current.setFieldValue('region', '')
              setRegionDisabled(true)
            } else {
              setRegionDisabled(false)
            }
          }}
        />
      </Form.Item>
    </Form>
  )
})
export default UserForm
