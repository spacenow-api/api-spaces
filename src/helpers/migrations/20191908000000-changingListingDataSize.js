exports.up = (queryInterface, callback) => {
  queryInterface.changeColumn(
    'ListingData',
    'size',
    {
      type: 'float',
      defaultValue: 0.0,
      allowNull: true
    },
    callback
  )
}

exports.down = (queryInterface, callback) => {
  queryInterface.changeColumn(
    'ListingData',
    'size',
    {
      type: 'int',
      defaultValue: 0,
      allowNull: true
    },
    callback
  )
}
