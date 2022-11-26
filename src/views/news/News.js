import React, { useEffect, useState } from 'react'
import { PageHeader, Row, Col, Card, List } from 'antd'
import request from 'utils/request'
import _ from 'lodash'
export default function News() {
  const [list, setList] = useState([])
  useEffect(() => {
    request.get('/news?publishState=2&_expand=category').then(res => {
      const list = _.entries(
        _.groupBy(res.data, item => item.category.title),
        item => item.category.title
      )
      setList(list)
    })
  }, [])
  return (
    <div>
      <PageHeader title="全球大新闻" subTitle="查看新闻" />
      <Row gutter={16}>
        {list.map(item => (
          <Col span={8} key={item[0]} style={{ marginBottom: '20px' }}>
            <Card title={item[0]} bordered={true}>
              <List
                size="small"
                bordered
                dataSource={item[1]}
                pagination={{ pageSize: 3 }}
                renderItem={detail => (
                  <List.Item>
                    <a href={`#/detail/${detail.id}`}>{detail.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
