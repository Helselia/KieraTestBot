export const channelTypeToString = (type: Number): string => {
  switch(type) {
    case 0:
      return 'Text'
    case 1:
      return 'Private (DM)'
    case 2:
      return 'Voice'
    case 3:
      return 'Group (DM)'
    case 4:
      return 'Category'
    default:
      return 'Unknown Type'
  }
}
