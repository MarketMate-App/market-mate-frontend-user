const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (async () => {
  const config = getDefaultConfig(__dirname);
  const {
    resolver: { sourceExts, assetExts }
  } = config;

  return withNativeWind(
    {
      ...config,
      transformer: {
        babelTransformerPath: require.resolve(
          "react-native-svg-transformer/react-native"
        )
      },
      resolver: {
        assetExts: assetExts.filter((ext) => ext !== "svg"),
        sourceExts: [...sourceExts, "svg"]
      }
    },
    { input: "./global.css" }
  );
})();