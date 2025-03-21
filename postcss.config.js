module.exports = {
  plugins: {
    "postcss-preset-env": {
      autoprefixer: {
        grid: false,
        flexbox: "no-2009",
        overrideBrowserslist: [
          "> 0.2%",
          "last 10 versions",
          "not dead",
          "ie >= 10",
          "Firefox ESR",
          "Opera >= 12",
          "Safari >= 6",
        ],
      },
      stage: 0,
      features: {
        "logical-properties-and-values": false,
        "media-query-ranges": {
          preserve: true,
        },
        "custom-properties": false,
      },
    },
  },
};
