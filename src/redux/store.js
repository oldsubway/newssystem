import { legacy_createStore as createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { CollapsedReduer } from './reducers/CollapsedReducer'
import { OpenKeysReducer } from './reducers/OpenKeysReducer'
import { SpinningReducer } from './reducers/SpinningReducer'
const reducer = combineReducers({
  CollapsedReduer,
  OpenKeysReducer,
  SpinningReducer
})
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['CollapsedReduer', 'OpenKeysReducer']
}
const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export { store, persistor }
