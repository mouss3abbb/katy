#!/usr/bin/env node
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
const baseUrl = 'https://mirror.codeforces.com/api/'
const problems = [];
let handles = [];
const problemTags = [
    '2-sat',
    'binary search',
    'bitmasks',
    'brute force',
    'combinatorics',
    'constructive algorithms',
    'chinese remainder theorem',
    'data structures',
    'dfs and similar',
    'divide and conquer',
    'dp',
    'dsu',
    'expression parsing',
    'fft',
    'flows',
    'games',
    'geometry',
    'graph matchings',
    'graphs',
    'greedy',
    'hashing',
    'implementation',
    'interactive',
    'math',
    'matrices',
    'meet-in-the-middle',
    'number theory',
    'probabilities',
    'schedules',
    'shortest paths',
    'sortings',
    'string suffix structures',
    'strings',
    'ternary search',
    'two pointers',
    'trees'
];
let chosenTags = [];

axios.get(`${baseUrl}problemset.problems`)
    .then((response) => {
        for (const problem of response.data.result.problems) {
            problems.push(problem);
        }
    })
    .catch((err) => {
        console.log(chalk.red(err.message));
    });

async function readHandles() {
    const answers = await inquirer.prompt(
        {
            type: 'input',
            name: 'handles',
            message: 'Enter handles separated by spaces',
        }
    );
    handles = answers.handles.split(' ');
}
await readHandles();

async function readTags() {
    const answers = await inquirer.prompt({
        type: 'checkbox',
        name: 'tags',
        message: 'Choose preferred tags',
        choices: problemTags,
    })
    chosenTags = answers.tags;
}
await readTags();


