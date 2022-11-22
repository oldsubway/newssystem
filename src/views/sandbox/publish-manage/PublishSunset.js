import React from 'react'
import usePublish from '@/components/publish-manage/usePublish'
import PublishList from '@/components/publish-manage/PublishList'
import { Button } from 'antd'
export default function PublishSunset() {
  const { dataSource, handleDelete } = usePublish(3)
  return (
    <PublishList
      dataSource={dataSource}
      button={id => (
        <Button
          danger
          onClick={() => {
            handleDelete(id)
          }}
        >
          删除
        </Button>
      )}
    />
  )
}
