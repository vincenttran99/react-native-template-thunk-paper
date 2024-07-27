const fs = require("fs-extra");
const path = require("path");
const pc = require("picocolors");
const sharp = require("sharp");

const log = {
  error: (text) => console.log(pc.red(text)),
  text: (text) => console.log(text),
  warn: (text) => console.log(pc.yellow(text)),
};

const getIOSProjectPath = (ios) => {
  if (ios.xcodeProject == null) {
    log.warn("No Xcode project found. Skipping iOS assets generation…");
    return;
  }

  const iosProjectPath = path
    .resolve(ios.sourceDir, ios.xcodeProject.name)
    .replace(/\.(xcodeproj|xcworkspace)$/, "");

  if (!fs.existsSync(iosProjectPath)) {
    log.warn(
      `No ${path.relative(
        workingPath,
        iosProjectPath,
      )} directory found. Skipping iOS assets generation…`,
    );
  } else {
    return iosProjectPath;
  }
};

let generate = async ({
                          android,
                          ios,
                          workingPath,
                          logoPath
                        }) => {
  const image = sharp(logoPath);

  const logWrite = (
    emoji,
    filePath,
  ) =>
    log.text(
      `${emoji}  ${path.relative(workingPath, filePath)}`,
    );

  if (android) {
    log.text(`\n    ${pc.underline("Android")}`);

    const appPath = android.appName
      ? path.resolve(android.sourceDir, android.appName)
      : path.resolve(android.sourceDir); // @react-native-community/cli 2.x & 3.x support

    const resPath = path.resolve(appPath, "src", "main", "res");
    const valuesPath = path.resolve(resPath, "values");

    fs.ensureDirSync(valuesPath);
    await Promise.all(
      [
        { size: 48, directory: "mipmap-mdpi", logoName: "ic_launcher" },
        { size: 72, directory: "mipmap-hdpi", logoName: "ic_launcher" },
        { size: 96, directory: "mipmap-xhdpi", logoName: "ic_launcher" },
        { size: 144, directory: "mipmap-xxhdpi", logoName: "ic_launcher" },
        { size: 192, directory: "mipmap-xxxhdpi", logoName: "ic_launcher" },
        { size: 288, directory: "mipmap-mdpi", splash: true, logoName: "bootsplash_logo" },
        { size: 432, directory: "mipmap-hdpi", splash: true, logoName: "bootsplash_logo" },
        { size: 576, directory: "mipmap-xhdpi", splash: true, logoName: "bootsplash_logo" },
        { size: 864, directory: "mipmap-xxhdpi", splash: true, logoName: "bootsplash_logo" },
        { size: 1152, directory: "mipmap-xxxhdpi", splash: true, logoName: "bootsplash_logo" },
        { size: 48, directory: "mipmap-mdpi", round: true, logoName: "ic_launcher_round" },
        { size: 72, directory: "mipmap-hdpi", round: true, logoName: "ic_launcher_round" },
        { size: 96, directory: "mipmap-xhdpi", round: true, logoName: "ic_launcher_round" },
        { size: 144, directory: "mipmap-xxhdpi", round: true, logoName: "ic_launcher_round" },
        { size: 192, directory: "mipmap-xxxhdpi", round: true, logoName: "ic_launcher_round" },
      ].map(({ directory, size, round, splash, logoName }) => {
        const fileName = `${logoName}.png`;
        const filePath = path.resolve(resPath, directory, fileName);
        let borderRadius = 0;
        if (splash) {
          borderRadius = Math.round((21 / 510) * size)
        }
        if (round) {
          borderRadius = size
        }

        let sizeImage = size

        if (splash) {
          sizeImage = Math.round((240 * size) / 510)
        }


        const mask = Buffer.from(
          `<svg><rect x="0" y="0" width="${sizeImage}" height="${sizeImage}" rx="${borderRadius}" ry="${borderRadius}" /></svg>`
        );

        const canvas = sharp({
          create: {
            width: size,
            height: size,
            channels: 4,
            background: {
              r: 255,
              g: 255,
              b: 255,
              alpha: 0,
            },
          },
        });

        return image
          .clone()
          .resize(sizeImage)
          .png()
          .composite([{
            input: mask,
            blend: 'dest-in'
          }])
          .toBuffer()
          .then((input) =>
            canvas
              .composite([{ input }])
              .png({ quality: 100 })
              .toFile(filePath),
          )
          .then(() => {
            logWrite("✨", filePath, { width: size, height: size });
          });
      }),
    );
  }

  if (ios) {
    log.text(`\n    ${pc.underline("Android")}`);
    const iosProjectPath = getIOSProjectPath(ios)

    const imageSetPath = path.resolve(
      iosProjectPath,
      "Images.xcassets",
      "BootSplashLogo.imageset",
    );

    const logoPath = path.resolve(
      iosProjectPath,
      "Images.xcassets",
      "AppIcon.appiconset",
    );

    fs.ensureDirSync(imageSetPath);

    await Promise.all(
      [
        { ratio: 1, suffix: "", type: "bootsplash" },
        { ratio: 2, suffix: "@2x", type: "bootsplash" },
        { ratio: 3, suffix: "@3x", type: "bootsplash" },
        { size: 16, type: "logo" },
        { size: 20, type: "logo" },
        { size: 29, type: "logo" },
        { size: 32, type: "logo" },
        { size: 40, type: "logo" },
        { size: 48, type: "logo" },
        { size: 50, type: "logo" },
        { size: 55, type: "logo" },
        { size: 57, type: "logo" },
        { size: 58, type: "logo" },
        { size: 60, type: "logo" },
        { size: 64, type: "logo" },
        { size: 66, type: "logo" },
        { size: 72, type: "logo" },
        { size: 76, type: "logo" },
        { size: 80, type: "logo" },
        { size: 87, type: "logo" },
        { size: 88, type: "logo" },
        { size: 92, type: "logo" },
        { size: 100, type: "logo" },
        { size: 114, type: "logo" },
        { size: 120, type: "logo" },
        { size: 128, type: "logo" },
        { size: 144, type: "logo" },
        { size: 152, type: "logo" },
        { size: 167, type: "logo" },
        { size: 172, type: "logo" },
        { size: 180, type: "logo" },
        { size: 196, type: "logo" },
        { size: 216, type: "logo" },
        { size: 256, type: "logo" },
        { size: 512, type: "logo" },
        { size: 1024, type: "logo" },
      ].map(({ ratio, suffix, type, size }) => {
        if (type === "bootsplash") {

          const sizeImage = Math.round((240 / 510) * 288 * ratio)
          const borderRadius = Math.round((21 / 510) * 288 * ratio)

          const mask = Buffer.from(
            `<svg><rect x="0" y="0" width="${sizeImage}" height="${sizeImage}" rx="${borderRadius}" ry="${borderRadius}" /></svg>`
          );

          const canvas = sharp({
            create: {
              width: 288 * ratio,
              height: 288 * ratio,
              channels: 4,
              background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 0,
              },
            },
          });

          const filePath = path.resolve(
            imageSetPath,
            `bootsplash_logo${suffix}.png`,
          );

          return image
            .clone()
            .resize(sizeImage)
            .png()
            .composite([{
              input: mask,
              blend: 'dest-in'
            }])
            .toBuffer()
            .then((input) =>
              canvas
                .composite([{ input }])
                .png({ quality: 100 })
                .toFile(filePath),
            )
            .then(({ width, height }) => {
              logWrite("✨", filePath, { width, height });
            });
        } else {
          const filePath = path.resolve(
            logoPath,
            `${size}.png`,
          );

          return image
            .clone()
            .resize(size)
            .png({ quality: 100 })
            .toFile(filePath)
            .then(({ width, height }) => {
              logWrite("✨", filePath, { width, height });
            });
        }
      }),
    );
  }

  log.text(
    `✅  Done!`,
  );
};

exports.generate = generate;
