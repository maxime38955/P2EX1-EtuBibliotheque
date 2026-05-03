import * as path from "path";

// Utilisez 'export default' au lieu de 'export const CoverageWebpack ='
export default {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: [
          // Assurez-vous que ce chemin pointe bien vers votre dossier src/
          path.resolve(__dirname, "..", "src"), 
        ],
        exclude: [
          /\.(cy|spec)\.ts$/,
          /node_modules/,
        ],
      },
    ],
  },
};