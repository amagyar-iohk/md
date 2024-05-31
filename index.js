const fs = require('fs');
const path = require('path');
const termsReplacement = require('./replacement')

let matches = {};
let termToFile = {}
let root = ""
let repo = ""

const defaultIgnore = [
    ".git"
]

function execute(baseDir, dir, excludeRegex, url) {
    // cleanup
    matches = {}
    termToFile = {}

    root = baseDir + dir
    repo = url + dir + "/blob/main"

    if (!excludeRegex) {
        excludeRegex = []
    }

    excludeRegex = [...excludeRegex, ...defaultIgnore]

    // ignore files declared on .git folder
    if (fs.existsSync(`${baseDir}/.gitignore`)) {
        const gitignore = fs.readFileSync(`${baseDir}/.gitignore`, 'utf-8').trim().split('\n')
        excludeRegex = [...excludeRegex, ...gitignore]

    }

    // filters any empty entry
    excludeRegex = excludeRegex.filter((v) => v != '')
    
    let findings = find(root, excludeRegex)

    return {
        matches: findings,
        files: Object.keys(matches),
        toTable: function(out) {
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
            
            fs.writeFileSync(`reports/${out}`, output)
        }
    }
}

function find(baseDir, excludeRegex) {
    for (const item of fs.readdirSync(baseDir)) {
        const itemPath = path.join(baseDir, item);
        let ignore = false
        excludeRegex.forEach(regex => {
            if (itemPath.toLocaleLowerCase().includes(regex.toLocaleLowerCase())) {
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

        // ignore if term == replacement
        if (term == termsReplacement[term]) {
            continue
        }

        for (let i = 0; i < fileContent.length; i++) {
            if (fileContent[i].toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
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
                termToFile[term].push(`${repo}${relativePath}` + "?plain=1#L" + (i+1))
            }
        }

    }
}

module.exports = {
    execute
}