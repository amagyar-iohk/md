#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process')
const { execute } = require('./index')

const repoList = [
    {
        url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-swift",
        exclude: ["Sample", "E2E", "CHANGELOG.md"],
        out: "sdk-swift.md"
    }
]

repoList.forEach(repo => {
    execSync("rm -rf temp")
    execSync(`git clone ${repo.url} temp`)
    let result = execute('temp', repo.exclude, repo.url)
    result.toTable(repo.out)
    execSync("rm -rf temp")
})
