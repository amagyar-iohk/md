#!/usr/bin/env node

const { execSync } = require('child_process')
const { execute } = require('./src/markdown/runner')

const validations = [
    // {
    //     url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-swift"
    // },
    // {
    //     url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-ts"
    // },
    // {
    //     url: "https://github.com/input-output-hk/atala-prism-wallet-sdk-kmm"
    // },
    // {
    //     url: "https://github.com/input-output-hk/atala-prism-apollo"
    // },
    // {
    //     url: "https://github.com/input-output-hk/atala-prism-docs"
    // },
    {
        url: "https://github.com/hyperledger/identus-cloud-agent"
    }
]

validations.forEach(validation => {
    // execSync("rm -rf temp")
    // execSync(`git clone ${validation.url} temp`)
    let result = execute("temp", validation.url)
    result.toTable(validation.out)
    // execSync("rm -rf temp")
})
