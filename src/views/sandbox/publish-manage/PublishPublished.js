import React from 'react'
import usePublish from '@/components/publish-manage/usePublish'
import PublishList from '@/components/publish-manage/PublishList'
import { Button } from 'antd'
export default function PublishPublished() {
  const { dataSource, handleSunset } = usePublish(2)
  return (
    <PublishList
      dataSource={dataSource}
      button={id => (
        <Button
          type="primary"
          onClick={() => {
            handleSunset(id)
          }}
        >
          下线
        </Button>
      )}
    />
  )
}
