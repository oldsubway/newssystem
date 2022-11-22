import React, { useEffect, useState } from 'react'
import { PageHeader, Steps, Button, message, Form, Input, Select, notification } from 'antd'
import style from './NewsAdd.module.css'
import request from 'utils/request'
import openKeysBus from '@/redux/reducers/openKeysBus'
import NewsEditor from '@/components/news-manage/NewsEditor'
const steps = [
  {
    title: '基本信息',
    content: '新闻标题，新闻分类'
  },
  {
    title: '新闻内容',
    content: '新闻主体内容'
  },
  {
    title: '新闻提交',
    content: '保存草稿或者提交审核'
  }
]
export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0)
  const [categories, setCategories] = useState([])
  const [NewsForm] = Form.useForm()
  const [formInfo, setFormInfo] = useState([])
  const [content, setContent] = useState('')
  useEffect(() => {
    const id = props.match.params.id
    request.get(`/news/${id}?_expand=role&_expand=category`).then(res => {
      const { title, categoryId, content } = res.data
      NewsForm.setFieldsValue({
        title,
        categoryId
      })
      setContent(content)
    })
  }, [props.match.params.id, NewsForm])
  useEffect(() => {
    request.get('categories').then(res => setCategories(res.data))
  }, [])
  const next = async () => {
    if (current === 0) {
      try {
        const res = await NewsForm.validateFields()
        setFormInfo(res)
        setCurrent(current + 1)
      } catch (error) {}
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }
    }
  }
  const prev = () => {
    setCurrent(current - 1)
  }
  const items = steps.map(item => ({
    title: item.title,
    description: item.content
  }))
  const handleUpdate = auditState => {
    request
      .patch(`/news/${props.match.params.id}`, {
        ...formInfo,
        content,
        auditState
      })
      .then(() => {
        if (auditState === 1) openKeysBus.publish(['/audit-manage'])
        console.log(2)
        props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
        notification.info({
          message: '通知',
          description: `成功提交${auditState === 0 ? '草稿箱' : '审核'}`,
          placement: 'bottomRight'
        })
      })
  }
  return (
    <div>
      <PageHeader
        title="更新新闻"
        onBack={() => {
          window.history.back()
        }}
      />
      <Steps current={current} items={items} />
      <div style={{ marginTop: '30px' }}>
        <div className={current === 0 ? '' : style.hidden}>
          <Form form={NewsForm}>
            <Form.Item label="新闻标题" name="title" rules={[{ required: true, message: '不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="新闻分类" name="categoryId" rules={[{ required: true, message: '不能为空' }]}>
              <Select options={categories} fieldNames={{ value: 'id', label: 'value' }} placeholder="请选择" />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.hidden}>
          <NewsEditor
            getContent={value => {
              setContent(value)
            }}
            content={content}
          />
        </div>
      </div>
      <div style={{ marginTop: '50px' }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <span>
            <Button type="primary" onClick={() => handleUpdate(0)}>
              保存草稿箱
            </Button>
            <Button
              danger
              style={{
                marginLeft: '8px'
              }}
              onClick={() => handleUpdate(1)}
            >
              提交审核
            </Button>
          </span>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px'
            }}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  )
}
