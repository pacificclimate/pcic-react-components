module.exports = function (api) {
  api.cache(true);
  return {
    "presets": [
      ["@babel/preset-react", { "absoluteRuntime": false }]
    ],
    "plugins": [
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
      ["@babel/plugin-proposal-export-namespace-from"]
    ]
  };
};
