import './App.css'
import { Provider } from 'react-redux'
import IndexRouter from './routes/IndexRouter'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  )
}
