const puppeteer = require("puppeteer");
const sharp = require("sharp");
const createError = require("http-errors");
const generateThumbnail = async (url) => {
  try {
    // // Step 1: Launch Puppeteer and capture the screenshot of the website
    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: [
    //     "--no-sandbox",
    //     "--disable-setuid-sandbox",
    //     "--disable-dev-shm-usage",
    //     "--disable-accelerated-2d-canvas",
    //     "--disable-gpu",
    //   ],
    // });
    // const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 800 });
    // await page.goto(url, { waitUntil: "domcontentloaded" });

    // // Step 2: Capture a full-page screenshot
    // const screenshot = await page.screenshot();

    // // Close the browser after the screenshot
    // await browser.close();

    // // Step 3: Generate a thumbnail from the screenshot using sharp
    // const thumbnail = await sharp(screenshot)
    //   .resize({ width: 300 })
    //   .jpeg({ quality: 60 }) // Define your thumbnail width
    //   .toBuffer();

    // // Step 4: Return the thumbnail as base64 or store it on the server
    // const base64Thumbnail = thumbnail.toString("base64");
    // //console.log("Thumbnail generated successfully", base64Thumbnail);
    // return `data:image/jpeg;base64,${base64Thumbnail}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Capture screenshot as base64 string
    const base64Screenshot = await page.screenshot({
      encoding: "base64",
    });

    await browser.close();

    return `data:image/jpeg;base64,${base64Screenshot}`;
  } catch (error) {
    throw createError(400, "Error in generating image with provided URL");
  }
};

module.exports = generateThumbnail;
