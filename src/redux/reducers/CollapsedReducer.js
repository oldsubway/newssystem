export const CollapsedReduer = (prevState = { isCollapsed: false }, action) => {
  switch (action.type) {
    case 'change-collapsed':
      return {
        isCollapsed: !prevState.isCollapsed
      }
    default:
      return prevState
  }
}
