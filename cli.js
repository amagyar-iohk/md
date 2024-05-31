#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process')
const { execute } = require('./index')

const validations = [
    {
        url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-swift",
        dir: "",
        exclude: ["Sample", "E2E", "CHANGELOG.md"],
        out: "sdk-swift.md"
    },
    {
        url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-ts",
        dir: "",
        exclude: ["docs/sdk", "CHANGELOG.md"],
        out: "sdk-ts.md"
    },
    {
        url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-kmm",
        dir: "",
        exclude: ["end-to-end", "CHANGELOG.md"],
        out: "sdk-kmm.md"
    },
    {
        url: "https://github.com/input-output-hk/atala-prism-apollo",
        dir: "",
        exclude: ["CHANGELOG.md"],
        out: "apollo.md"
    },
    {
        url: "https://github.com/input-output-hk/atala-prism-docs",
        dir: "",
        exclude: ["CHANGELOG.md"],
        out: "docs.md"
    },
    {
        url: "https://github.com/hyperledger/identus-cloud-agent/",
        dir: "/docs/decisions",
        exclude: [],
        out: "adrs.md"
    }
]

validations.forEach(validation => {
    execSync("rm -rf temp")
    execSync(`git clone ${validation.url} temp`)
    let result = execute(`temp${validation.dir}`, validation.exclude, validation.url)
    result.toTable(validation.out)
    execSync("rm -rf temp")
})
