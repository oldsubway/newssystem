import React from 'react'
import TopHeader from '../../components/sandbox/TopHeader'
import SlideMenu from '../../components/sandbox/SlideMenu'
import NewsRouter from '@/components/sandbox/NewsRouter'
import './NewsSandBox.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Layout } from 'antd'
const { Content } = Layout

export default function NewsSandBox() {
  NProgress.start()
  NProgress.done()
  return (
    <Layout>
      <SlideMenu />
      <Layout className="site-layout">
        <TopHeader />

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
