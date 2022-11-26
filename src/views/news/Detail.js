import React, { useState, useEffect } from 'react'
import { PageHeader, Descriptions } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import request from 'utils/request'
import dayjs from 'dayjs'

export default function Detail(props) {
  const [newsInfo, setnNewsInfo] = useState(null)
  const id = props.match.params.id
  useEffect(() => {
    _init(id)
  }, [id])
  const _init = async id => {
    const { data } = await request.get(`/news/${id}?_expand=role&_expand=category`)
    setnNewsInfo(data)
    await request.patch(`news/${id}`, {
      view: data.view + 1
    })
  }
  const handleStar = () => {
    setnNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1
    })
    request.patch(`news/${id}`, {
      star: newsInfo.star + 1
    })
  }
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={
              <div>
                {newsInfo.category.title}
                <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} />
              </div>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsInfo.publishTime ? dayjs(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>

          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content
            }}
            style={{
              margin: '0 24px',
              border: '1px solid gray'
            }}
          ></div>
        </div>
      )}
    </div>
  )
}
