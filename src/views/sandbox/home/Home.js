import React, { useEffect, useState, useRef } from 'react'
import request from 'utils/request'
import { Row, Col, Card, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [myList, setMyList] = useState([])
  const [open, setOpen] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  const {
    username,
    region,
    role: { roleName }
  } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    request.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    request.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      const currentObj = res.data.filter(item => item.author === username)
      const currentList = _.groupBy(currentObj, item => item.category.title)
      let list = []
      for (let i in currentList) {
        list.push({
          value: currentList[i].length,
          name: i
        })
      }
      setMyList(list)
    })
    return () => {
      window.onresize = null
    }
  }, [username])
  const showDrawer = () => {
    setOpen(true)
    setTimeout(() => {
      renderPieView()
    }, 0)
  }
  const onClose = () => {
    setOpen(false)
  }
  const renderBarView = obj => {
    var myChart = echarts.init(barRef.current)
    var option = {
      title: {
        text: '新闻分类图示'
      },
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          data: Object.values(obj).map(item => item.length),
          type: 'bar'
        }
      ]
    }
    option && myChart.setOption(option)
    window.onresize = () => {
      myChart.setOption({
        xAxis: {
          axisLabel: {
            rotate: barRef.current.clientWidth <= 400 ? 45 : 0
          }
        }
      })
      myChart.resize()
    }
  }
  const renderPieView = () => {
    var myChart
    if (pieChart) {
      myChart = pieChart
    } else {
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    }
    var option = {
      title: {
        text: '个人发布新闻',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: '50%',
          data: myList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    option && myChart.setOption(option)
  }
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={viewList}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户浏览最多" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={starList}
              renderItem={item => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ width: 300 }} cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />} actions={[<SettingOutlined onClick={showDrawer} key="setting" />, <EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}>
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ marginInlineStart: '20px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ marginTop: '20px', width: '100%', height: '400px' }}></div>
      <Drawer title="个人发布新闻" width="500px" placement="right" closable={false} onClose={onClose} open={open}>
        <div ref={pieRef} style={{ width: '500px', height: '400px' }}></div>
      </Drawer>
    </div>
  )
}
