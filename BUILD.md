# An Alphabet − Desktop | Build

An Alphabet is easy to build because it's a Node.JS/ElectronJS application.

## Install dependencies

This project use some dependencies like `marked` for the lexing of the alphabets data, `fs` for get the content of the alphabets data, `electron` for the application and `electron-builder` for build the application.

To install them, you can try this:
```sh
npm install # Will install `marked`, `fs`, `electron` and `electron-builder`.
```

## Testing

Now, you can test if the project work (With your edits. Normaly the project on GitHub work).

For test the project, you can run this command (enable DevTools in `main.js` if you need):
```sh
npm start # This will take few seconds to launch the application.
```

## Building

In this last part, you will know how to build the project using `eletron-builder`.

You can try one of these four commands:
```sh
npm run build       # This will build for all platforms (Mac propably make an error, but don't worry it's normal)
npm run build-linux # Build for Linux
npm run build-win   # Build for Windows
npm run build-mac   # Build for macOS
```

Now, you can check in the `/dist` directory, and you will see these interesting files:
- `an-alphabet.deb`, the `deb.` installer for Linux
- `an-alphabet.AppImage`, the `AppImage.` installer for Linux
- `an-alphabet.rpm`, the `rpm.` installer for Linux
- `An Alphabet - Desktop Setup 1.0.0.exe`, the `.exe` installer for Windows.
- `an-alphabet.dmg`, the `dmg.` installer for macOS