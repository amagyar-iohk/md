const fs = require('fs');
const path = require('path');
const termsReplacement = require('./replacement')

const matches = {};
const termToFile = {}
let root = ""
let repo = ""

const defaultIgnore = [
    ".git"
]
function execute(baseDir, excludeRegex, url) {
    root = baseDir
    repo = url + "/blob/main"

    if (!excludeRegex) {
        excludeRegex = []
    }

    // ignore files declared on .git folder
    const gitignore = fs.readFileSync(`${baseDir}/.gitignore`, 'utf-8').trim().split('\n')
    excludeRegex = [...defaultIgnore, ...excludeRegex, ...gitignore].filter((v) => v != '')


    let findings = find(baseDir, excludeRegex)

    return {
        matches: findings,
        files: Object.keys(matches),
        toTable: function() {
            if (Object.keys(termToFile) == 0) {
                return "No terms found"
            }

            let output =  "| term | replace with | files |\n"
            output +=     "|------|--------------|-------|\n"
            Object.keys(termToFile).forEach(term => {
                output += "|" + term + "|" + termsReplacement[term] + "|"
                let files = ""
                termToFile[term].forEach(file => {
                    files += file + "<br>"
                })
                output += files + "|\n"
            })
            
            fs.writeFileSync('output.md', output)
        }
    }
}

function find(baseDir, excludeRegex) {
    for (const item of fs.readdirSync(baseDir)) {
        const itemPath = path.join(baseDir, item);
        let ignore = false
        excludeRegex.forEach(regex => {
            if (itemPath.includes(regex)) {
                ignore = true
            }
        })

        if (!ignore) {
            if (fs.statSync(itemPath).isDirectory()) {
                find(itemPath, excludeRegex);
            } else {
                readFile(itemPath)
            }
        }
    }

    return matches
}

function readFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8').split('\n')
    for (const term of Object.keys(termsReplacement)) {
        if (term == termsReplacement[term]) {
            console.log("term equals replacement")
            continue
        }
        for (let i = 0; i < fileContent.length; i++) {
            if (fileContent[i].includes(term)) {
                if (!matches[filePath]) {
                    matches[filePath] = []
                }
                if (!termToFile[term]) {
                    termToFile[term] = []
                }
                matches[filePath].push({
                    term: term,
                    line: i,
                    value: fileContent[i]
                })
                const relativePath = filePath.replace(root, "")
                termToFile[term].push(`${repo}/${relativePath}` + "?plain=1#L" + (i+1))
            }
        }

    }
}

module.exports = {
    execute
}