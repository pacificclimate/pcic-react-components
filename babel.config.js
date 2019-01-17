module.exports = function (api) {
  api.cache(true);
  return {
    "presets": [
      ["react-app", { "absoluteRuntime": false }]
    ],
    "plugins": [
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
  };
};
