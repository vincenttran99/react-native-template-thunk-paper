module.exports = {
  commands: [
    {
      name: "generate-logo <logoPath>",
      description:
        "Generate a logo using an original logo file (PNG or SVG)",
      options: [],
      func: (
        [logoPath],
        { project: { android, ios } },
        { },
      ) => {
        const path = require("path");
        const { generate } = require("./scripts/generateLogo");

        const workingPath =
          process.env.INIT_CWD || process.env.PWD || process.cwd();

        return generate({
          android,
          ios,
          workingPath,
          logoPath: path.resolve(workingPath, logoPath),
        }).catch((error) => {
          console.error(error);
        });
      },
    }
  ],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    }
  },
};

