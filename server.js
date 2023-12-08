import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";


export default function devserver(routes) {
  if (!routes) {
    console.log('Please check option: routes !!');
  }

  const folders = routes;
  const server = http.createServer((req, res) => {
    const foundFolder = folders.find((folder) => req.url.startsWith(folder.route));

    if (foundFolder) {
      const filePath = path.join(foundFolder.path, req.url.replace(foundFolder.route, ''));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        const indexPath = path.join(filePath, 'index.html');
        if (fs.existsSync(indexPath)) {
          fs.createReadStream(indexPath).pipe(res);
          return;
        }
      }
    }

    res.statusCode = 404;
    res.end('Not found');
  });

  return server;
}