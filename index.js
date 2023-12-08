import build from './build.js';
import devserver from './server.js';
import chalk from 'chalk';

const routes = [{ route: '/',  path: '.'}];
const mdFile = './example.md';
const start = Date.now();
setTimeout(()=>{
    build(mdFile);
     setTimeout(() =>{
        const app = devserver(routes);
        const port = 5040;
        app.listen(port, () => {
            console.log(chalk.bgBlack.green.bold(`Server running on http://localhost:${port} ✨ ✨ ✨`));
        });

     },2000);
    const end = Date.now();
    console.log(chalk.yellow.bold(`Done in ${ start - end} ms`));
},1000);