#!/usr/bin/env node
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";
import gradient from "gradient-string";
import nanospinner, { createSpinner } from "nanospinner";
import open from "open";
const baseUrl = 'https://mirror.codeforces.com/api/'
let problems = [];
let handles = [];
const problemset = [];
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

const delay = async function (timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

function welcome() {
    figlet('Katy', (err, data) => {
        console.log(gradient.pastel(data));
    });
}

async function getUserProblems(user) {
    try {
        const response = await axios.get(baseUrl + 'user.status?handle=' + user);
        for (const submission of response.data.result) {
            if (submission.verdict == 'OK') {
                problems = problems.filter(item => item.contestId != submission.problem.contestId);
            }
        }
    } catch (error) {
        console.log(error);
        console.log(chalk.bgRedBright('ERROR finding problems for specified users'));
    }
}

async function readProblemSet() {
    await delay(500);
    const spinner = createSpinner('Reading problem set...').start();
    try {
        const response = await axios.get(baseUrl + 'problemset.problems');
        for (const problem of response.data.result.problems) {
            problems.push(problem.name);
        }
        spinner.success({ text: 'Problems are ready' });
    } catch (error) {
        console.log(chalk.bgRedBright('ERROR Fetching the problem set'));
    }
}

axios.get(baseUrl + 'problemset.problems')
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
            default: 'tourist'
        }
    );
    handles = answers.handles.split(' ');
}

async function readRating() {
    const min = await inquirer.prompt(
        {
            type: 'number',
            name: 'min_rating',
            message: 'Enter minimum rating',
            default: 800,
            validate: function (value) {
                return value >= 800 && value <= 3500;
            }
        }
    );
    const max = await inquirer.prompt(
        {
            type: 'number',
            name: 'max_rating',
            message: 'Enter maximum rating',
            default: min.min_rating + 400,
            validate: function (value) {
                return value >= 800 && value <= 3500;
            }
        }
    );
    return [Math.min(min.min_rating, max.max_rating),
    Math.max(min.min_rating, max.max_rating)];
}

async function readTags() {
    const answers = await inquirer.prompt({
        type: 'checkbox',
        name: 'tags',
        message: 'Choose preferred tags',
        choices: problemTags,
        default: problemTags
    })
    chosenTags = answers.tags;
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

welcome();
await readProblemSet();
await readHandles();
const [min_rate, max_rate] = await readRating();
await readTags();
for (const handle of handles) {
    await getUserProblems(handle);
}
let number_of_problems = await readNumberOfProblems();
for (const problem of problems) {
    for (const tag of chosenTags) {
        if (problem.tags.includes(tag) && problem.rating >= min_rate && problem.rating <= max_rate && !problemset.some(element => element.contestId == problem.contestId && element.name == problem.name)) {
            problemset.push(problem);
            number_of_problems--;
        }
        if (number_of_problems <= 0) {
            break;
        }
    }
    if (number_of_problems <= 0) {
        break;
    }
}

function urlBuilder(problem_name) {
    return 'https://www.codeforces.com/problemset/problem/' + problem_name.contestId + '/' + problem_name.index;
}


for (const problem of problemset) {
    console.log(chalk.yellow(problem.name));
    console.log(chalk.blue(urlBuilder(problem)));
    open(urlBuilder(problem));
}
