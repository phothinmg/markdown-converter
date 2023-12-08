
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