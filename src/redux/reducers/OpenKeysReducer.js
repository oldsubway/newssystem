export const OpenKeysReducer = (prevState = { openKeys: [] }, action) => {
  switch (action.type) {
    case 'change-openkeys':
      return {
        openKeys: action.payload
      }
    default:
      return prevState
  }
}
