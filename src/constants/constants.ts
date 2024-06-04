import chalk from "chalk";

// Environments colors
const API_COLOR = '#D58831'
const POSTGRES_COLOR = '#0064A5'

// Error console log
export const error = () => { return chalk.bold.red('ERROR\t') }
export const warning = () => { return chalk.bold.yellow('WARNING ') }
export const infoLog = () => { return chalk.bold.green('INFO\t') }

// Console log environments colors
export const apiLog = chalk.hex(API_COLOR)
export const postgresLog = chalk.hex(POSTGRES_COLOR)