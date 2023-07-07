import axios from "axios"
import { createSpinner } from "nanospinner"
const baseUrl = process.env.API_URL

export const problemTags = [
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
]


const delay = async function (timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
}

export let problems = []
export const getUserProblems = async function (user) {
    try {
        const response = await axios.get(baseUrl + 'user.status?handle=' + user)
        response.data.result.forEach(submission => {
            if (submission.verdict == 'OK')
                problems = problems.filter(item => item.contestId != submission.problem.contestId)
        })
    } catch (error) {
        console.log(chalk.bgRedBright('ERROR finding problems for specified users'))
        process.exit(1)
    }
}

export const readProblemSet = async function () {
    await delay(500)
    const spinner = createSpinner('Reading problem set...').start()
    try {
        const response = await axios.get(baseUrl + 'problemset.problems')
        response.data.result.problems.forEach(problem => {
            problems.push(problem)
        })
        spinner.success({ text: 'Problems are ready' })
    } catch (error) {
        console.log(chalk.bgRedBright('ERROR Fetching the problem set'))
        process.exit(1)
    }
}