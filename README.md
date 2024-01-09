![m2h](https://imagedelivery.net/6bSk6wUa9UOwEesJAZQuoA/93d02944-6c14-4671-aacc-a2f53691b200/public)


### Convert Markdown To HTML with Showdown JS.
---

Live Demo : https://markdownapp.onrender.com/

---
###  အသုံးပြုသည့် Packages များ

1. Showdown JS
2. showdown-highlight
3. gray-matter
4. write-file-safe
5. chalk
---
#### template.js

Markdown ကနေ HTML generate လုပ်တဲ့အခါ အသုံးပြုမည့် template ပါ..CSS နှင့် Highlight. js အတွက် လိုအပ်တာတွေကို external link ချိတ်ထားပါသည်။ es6-string-html VS Code Extension  https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html ကို install လုပ်ထားရင်  template literalsတွေကို VS Code မှာ Highlight လုပ်ပေးပါတယ်

```javascript
export default function template(content){

    const html = /* html */`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css">
        <link rel="stylesheet" href="https://unpkg.com/highlightjs-copy/dist/highlightjs-copy.min.css">
        <link rel="stylesheet" href="https://classless.de/classless.css">
        <title>M 2 H</title>
    </head>
    <body>
         ${content}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
        <script src="https://unpkg.com/highlightjs-copy/dist/highlightjs-copy.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/phothinmg/ptm@main/hljsCopyBtn.js"></script>
    </body>
    </html>
    
    `;
    return html
}
```
---
#### build.js မှ  functions များ

**Showdown**

Showdown js ၏ Converter ကို ကိုယ်လိုခြင်တဲ့ Options တွေ နှင့် အရင်တည်ဆောက်တာဖြစ်ပါတယ် Options အသေးစိတ်တွေကို https://github.com/showdownjs/showdown#options မှာ သွားကြည့်လိုရပါတယ်

```javascript
const show = new Showdown.Converter({
    extensions: [showdownHighlight({ pre: true })],
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    openLinksInNewWindow: true,
    emoji: true,
    moreStyling: true,
});

```

 Content ကို HTML အဖြစ် makeHtml method နှင့်ပြောင်းပေးမည့် function ဖြစ်ပါသည်။

 ```javascript
 const converter = (content) =>{
    // github flavored markdown အဖြစ် set လုပ်တာပါ
    show.setFlavor('github');
    return show.makeHtml(content);
}
```

**gray-matter**

Markdown file ၏ data နှင့် content ကိုခွဲထုတ်ပါမယ် Gray Matter Package က အသုံးဝင်ပါ Options တွေအများကြီးရွေးလိုရတယ်.. ကျနော်ကတော့ သူ့ရဲ့ default options တွေကိုပဲရွေးလို သီးခြား options တွေမထည့်တော့ပါဘူး.. documentation ကို ဒီမှာဖတ်လိုရပါတယ်..https://github.com/jonschlinkert/gray-matter#usage Showdown ကိုယ်၌လည်းခွဲထုတ်ပေးနိုင်ပါတယ် gray matter ၏ အခြား options သုံးမယ်ဆိုပိုအဆင်ပြေအောင် gray-matterကိုသုံးတာပါ

```javascript
const grayMatter = (filePath) =>{
    const fileContent = matter.read(filePath);
    const data = fileContent.data;
    const content = fileContent.content;
    return {data, content}
}
```

data မှ date ကို local string ပြောင်းတာပါ

```javascript
const formatDate = (date)=>{
    return new Date(date).toLocaleString('en-US',{
        weekday: "short",
        day: "numeric",
        month: "short",
        year:"numeric"
    });
};
```

စာဖတ်ချိန်ခန့်မှန်းကိုတွက်တာပါအသက်အရွယ်ဘာသာစကားခက်ခဲမှုအရကွာခြားတာတော့ရှိတယ် ဘယ်ဂျီယမ် တက္ကသိုလ်တစ်ခု၏ သုသေသန အရ သာမန်လူကြီးတစ်ယောက်က အသံတိတ်ဖတ်ရင် 238 wpm အော်ဖတ်ရရင် 183 wpm လိုပြောတယ် အများစုကတော့250wpmကိုအခြေခံထားတွက်ပါတယ်..ကျနော်ကတော့အခု ကာဗာဖြစ်အောင် 225 wpm နှင့်တွက်ပါတယ်

```javascript
const readTime = (text) => {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
    
};
```

Markdown ဖိုင်ကို နောက်ဆုံး update လုပ်ခဲ့သောရက်ကိုဖော်ပြပေးမှာပါ


```javascript
const lastUpdate = (filePath) => {
    const stats = fs.statSync(filePath);
    const lastModifiedTime = stats.mtime.toISOString();
    return lastModifiedTime;
};
```

function တွေအားလုံးစုပီး build function တည်ဆောက်ပါမယ်

```javascript
async function build (filePath){
    const gray = grayMatter(filePath);
    const title  = gray.data.title;
    const date = formatDate(gray.data.date);
    const content = gray.content;
    const readingTime = readTime(content);
    const convertedContent = converter(content);
    const lastModified = formatDate(lastUpdate(filePath));
    const htmlContent = /* html */`
      <h1>${title}</h1>
      <small>${date} | Reading Time : ${readingTime}</small>
      <div>${convertedContent}</div>
      <small>Last Modified : ${lastModified} min</small>
    `;
    const html = template(htmlContent);

    await writeFile('./index.html', html);
};

```
---

#### server.js

သာမန် node http server ကို routes နှင့် တည်ဆောက်ထားပါတယ်..  key နှစ်ခု path and route ပါ

```javascript
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
```

---

#### index.js

project entry file အဖြစ် index.js ဖိုင်ပါ ဒီဖိုင် run လိုက်ရင် root မှာ index.html ဖိုင် create လုပ်ပေးပီး http://localhost:5040 မှာ server run မှာပါ


```javascript
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
```

---

**ကျနော် javascript လေ့လာရင်း blog app လုပ်လိုတဲ့ စိတ်ရှိနေလို အခုလို markdown ကနေ html ပြောင်းတာကို လုပ်ဖြစ်နေပါတယ်**

**showdown သုံးတာထက်ကောင်းတဲ့နည်းလမ်းတွေလည်း ရှိပါတယ်.... အခု လည်း ကျနော် လေ့ကျင့်တဲ့အနေနဲ့ပဲ လုပ်ထားတာဖြစ်ပါတယ်.. လိုအပ်တာတွေ ဝေဖန် တည့်မတ်ပေးပါ**

---

