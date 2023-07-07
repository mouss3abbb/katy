#!/usr/bin/env node
import chalk from "chalk"
import inquirer from "inquirer"
import figlet from "figlet"
import gradient from "gradient-string"
import open from "open"
import 'dotenv/config.js'
import { problemTags, getUserProblems, readProblemSet, problems } from '../problems.js'
let handles = []
const problemset = []
let chosenTags = []

function welcome() {
    figlet('Katy', (err, data) => {
        console.log(gradient.pastel(data))
    })
}

async function readHandles() {
    const answers = await inquirer.prompt(
        {
            type: 'input',
            name: 'handles',
            message: 'Enter handles separated by spaces',
            default: 'tourist'
        }
    )
    handles = answers.handles.split(' ')
}

async function readRating() {
    const min = await inquirer.prompt(
        {
            type: 'number',
            name: 'min_rating',
            message: 'Enter minimum rating',
            default: 800,
            validate: function (value) {
                return value >= 800 && value <= 3500
            }
        }
    )
    const max = await inquirer.prompt(
        {
            type: 'number',
            name: 'max_rating',
            message: 'Enter maximum rating',
            default: min.min_rating + 400,
            validate: function (value) {
                return value >= 800 && value <= 3500
            }
        }
    )
    return [min.min_rating, max.max_rating].sort()
}

async function readTags() {
    const answers = await inquirer.prompt({
        type: 'checkbox',
        name: 'tags',
        message: 'Choose preferred tags',
        choices: problemTags
    })
    chosenTags = answers.tags
    if (chosenTags.length == 0) chosenTags = problemTags
}

async function readNumberOfProblems() {
    const answer = await inquirer.prompt({
        type: 'number',
        name: 'number',
        message: 'Enter number of problems',
        default: 5
    })
    return answer.number
}

welcome()
await readProblemSet()
await readHandles()
const [min_rate, max_rate] = await readRating()
await readTags()
for (const handle of handles) {
    await getUserProblems(handle)
}
let number_of_problems = await readNumberOfProblems()
problems.forEach(problem => {
    chosenTags.forEach(tag => {
        if (number_of_problems && problem.tags.includes(tag) && problem.rating >= min_rate && problem.rating <= max_rate && !problemset.some(element => element.contestId == problem.contestId && element.name == problem.name)) {
            problemset.push(problem)
            number_of_problems--
        }
    })
})

function urlBuilder(problem_name) {
    return 'https://www.codeforces.com/problemset/problem/' + problem_name.contestId + '/' + problem_name.index
}


problemset.forEach(problem => {
    console.log(chalk.yellow(problem.name))
    console.log(chalk.blue(urlBuilder(problem)))
    open(urlBuilder(problem))
})