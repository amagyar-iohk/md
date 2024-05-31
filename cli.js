#!/usr/bin/env node

const { execute } = require('./index')

// dir of project
// const baseDir = "./test"

// add for loop for all repos?
const baseDir = "/path/to/repo"

// string to exclude
// right now it does a simple match in the path of the file
// and excludes if that string is present
const excludeRegex = []
const repoUrl = "<repo url>"

const output = execute(baseDir, excludeRegex, repoUrl)
const mdName = "<result-names>"

console.log(output.toTable(mdName))

