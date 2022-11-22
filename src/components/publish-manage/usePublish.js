import { useEffect, useState } from 'react'
import request from 'utils/request'
import { notification } from 'antd'
function usePublish(publishState) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    request.get(`/news?author=${username}&auditState_ne=0&publishState=${publishState}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username, publishState])
  const changeDataSource = id => {
    setDataSource(dataSource.filter(item => item.id !== id))
  }
  const handlePublish = id => {
    changeDataSource(id)
    request.patch(`/news/${id}`, { publishState: 2 })
    notification.info({
      message: '通知',
      description: ''
    })
  }
  const handleSunset = id => {
    changeDataSource(id)
    request.patch(`/news/${id}`, { publishState: 3 })
  }
  const handleDelete = id => {
    changeDataSource(id)
    request.delete(`/news/${id}`)
  }
  return { dataSource, handleDelete, handlePublish, handleSunset }
}

export default usePublish
