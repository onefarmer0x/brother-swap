module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [
          /node_modules[\\\/]starknet-types-07/
        ]
      }
    ]
  }
  