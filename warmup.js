/*
Script to warm up the Next.js image optimization cache by preloading images used in the app.
Also loads the landing page and about page to warm up their caches.
Run this script after starting the Next.js server.
Usage: node warmup.js
*/
const fs = require('fs');
const path = require('path');

// Base public directory
const publicDir = path.join(__dirname, 'public');

// Recursively get all image files in a directory
function getAllImagesRecursively(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getAllImagesRecursively(filePath));
        } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
            results.push(filePath);
        }
    });

    return results;
}

// Convert absolute file path to public URL path
function toPublicPath(filePath) {
    return filePath.replace(publicDir, '').replace(/\\/g, '/');
}

// Preload an image
async function preloadImage(imagePath) {
    const url = `http://0.0.0.0:3000${imagePath}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log(`Preloaded: ${url}`);
        } else {
            console.error(`Failed to preload: ${url} - Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error preloading ${url}:`, error);
    }
}

// Warm up cache for a directory
async function warmUpCache() {
    // Tiles images
    console.log('Warming up images');
    const images = getAllImagesRecursively(publicDir);
    for (const absPath of images) {
        const publicPath = toPublicPath(absPath);
        console.log(`Warming up cache for: ${publicPath}`);
        await preloadImage(publicPath);
    }

    console.log('Warming up landing page');
    await fetch('http://0.0.0.0:3000/');
    console.log('Warming up landing page en');
    await fetch('http://0.0.0.0:3000/en');
}

// Run the warm-up
warmUpCache()
    .then(() => console.log('Cache warm-up completed.'))
    .catch(err => console.error('Error during cache warm-up:', err));
