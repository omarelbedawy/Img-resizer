# 🖼️ Image Resizer

A web-based image resizer built with **Node.js**, **Express**, and **Sharp**. Upload an image, set your desired dimensions, and instantly download or view the resized result. Includes a gallery of previously resized images.

## 🚀 Features

- Upload images through a web form
- Resize images to custom width and height
- View the resized image directly in the browser
- Automatically stores and displays resized image gallery
- Built with TypeScript, linted with ESLint, formatted with Prettier


## 🧰 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/)
- **Frontend:** HTML + CSS + JS
- **Testing:** Jasmine, Supertest
- **Tooling:** ESLint, Prettier, Nodemon

## 📦 Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/omarelbedawy/Image-resizer.git
cd Image-resizer
npm install
```

## 🛠️ Build and Run

### Development:

```bash
cd Back-end
```

```bash
npm run start
```

This uses `nodemon` to run the app at `http://localhost:3000`.

### Build (TypeScript → JavaScript):

```bash
npm run build
```

## 🧪 Testing

```bash
npm test
```

This runs the build and then executes Jasmine tests.

## 🧹 Lint and Format

```bash
npm run lint       # Check linting issues
npm run linting    # Check and auto-fix issues
npm run format     # Format code using Prettier
```

## 🖼️ Example

Upload and resize an image via the UI:

1. Open `http://localhost:3000` in your browser.
2. Upload an image, choose dimensions.
3. View and download the resized version.

> Created with ❤️ by Omar Elbedawy
