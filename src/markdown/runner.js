const fs = require('fs');
const path = require('path');
const linkExtractor = require('markdown-link-extractor')

let root = ""
let repo = ""

function execute(baseDir, url) {
    root = baseDir
    repo = url
    repoFileRef = url + "/blob/main"

    let findings = find(root)

    return {
        toTable: function (out) {
            // let output = "| link | files |\n"
            // output += "|------|-------|\n"
            // Object.keys(termToFile).forEach(term => {
            //     output += "|" + term + "|" + termsReplacement[term] + "|"
            //     let files = ""
            //     termToFile[term].forEach(file => {
            //         files += file + "<br>"
            //     })
            //     output += files + "|\n"
            // })

            // fs.writeFileSync(`reports/${out}`, output)
        }
    }
}

function find(baseDir, excludeRegex) {
    for (const item of fs.readdirSync(baseDir)) {
        const itemPath = path.join(baseDir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            find(itemPath, excludeRegex);
        } else {
            if (itemPath.endsWith(".md")) {
                readFile(itemPath)
            }
        }
    }
    // return matches
}


function readFile(filePath) {
    const repoPath = filePath.replace("temp/", "")
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const links = linkExtractor(fileContent)
    links.forEach(link => {
        console.log(repoPath, "->", link)
    })
}



module.exports = {
    execute
}