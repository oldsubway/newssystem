import React, { useState, useEffect } from 'react'
import { PageHeader, Descriptions } from 'antd'
import request from 'utils/request'
import dayjs from 'dayjs'

export default function NewsPreview(props) {
  const [newsInfo, setnNewsInfo] = useState(null)
  useEffect(() => {
    const id = props.match.params.id
    request.get(`/news/${id}?_expand=role&_expand=category`).then(res => {
      setnNewsInfo(res.data)
    })
  }, [props.match.params.id])
  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  const colorList = ['#1890ff', '#d46b08', '#389e0d', '#cf1322']
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader onBack={() => window.history.back()} title={newsInfo.title} subTitle={newsInfo.category.title}>
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{dayjs(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsInfo.publishTime ? dayjs(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span>
              </Descriptions.Item>
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
