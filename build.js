import Showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import matter from 'gray-matter';
import * as fs from "node:fs";
import template from "./template.js";
import {writeFile} from 'write-file-safe'

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

const converter = (content) =>{
    show.setFlavor('github');
    return show.makeHtml(content);
}

const grayMatter = (filePath) =>{
    const fileContent = matter.read(filePath);
    const data = fileContent.data;
    const content = fileContent.content;
    return {data, content}
}

const formatDate = (date)=>{
    return new Date(date).toLocaleString('en-US',{
        weekday: "short",
        day: "numeric",
        month: "short",
        year:"numeric"
    });
};
const readTime = (text) => {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
    
};
const lastUpdate = (filePath) => {
    const stats = fs.statSync(filePath);
    const lastModifiedTime = stats.mtime.toISOString();
    return lastModifiedTime;
};

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
      <small>${date} | Reading Time : ${readingTime} min</small>
      <div>${convertedContent}</div>
      <small>Last Modified : ${lastModified} </small>
    `;
    const html = template(htmlContent);

    await writeFile('./index.html', html);
};

export default build;