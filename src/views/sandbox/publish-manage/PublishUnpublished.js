import React from 'react'
import usePublish from '@/components/publish-manage/usePublish'
import PublishList from '@/components/publish-manage/PublishList'
import { Button } from 'antd'
export default function PublishUnpublished() {
  const { dataSource, handlePublish } = usePublish(1)
  return (
    <PublishList
      dataSource={dataSource}
      button={id => (
        <Button
          type="primary"
          onClick={() => {
            handlePublish(id)
          }}
        >
          发布
        </Button>
      )}
    />
  )
}
