const https = require('https');
const fs = require('fs');

const url = "https://models.readyplayer.me/64b44b802611e9f1a0e0d554.glb?morphTargets=ARKit,Oculus%20Visemes";
const dest = "./public/human-avatar.glb";

https.get(url, (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log("Redirecting to:", res.headers.location);
    https.get(res.headers.location, (res2) => {
        if (res2.statusCode !== 200) {
            console.error("Failed to download:", res2.statusCode);
            return;
        }
        const file = fs.createWriteStream(dest);
        res2.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("Download complete");
        });
    });
  } else if (res.statusCode === 200) {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log("Download complete");
    });
  } else {
    console.error("Failed with status:", res.statusCode);
  }
}).on('error', (err) => {
  console.error("Error:", err.message);
});
