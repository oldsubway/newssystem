export const SpinningReducer = (prevState = { isSpinning: false }, action) => {
  switch (action.type) {
    case 'change-spinning':
      return {
        isSpinning: action.payload
      }
    default:
      return prevState
  }
}
