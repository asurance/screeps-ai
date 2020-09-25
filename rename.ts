import { readdirSync, renameSync, rmdirSync, statSync } from 'fs'
import { resolve } from 'path'

const files = readdirSync('dist')
files.forEach(file => {
    const nextPath = resolve('dist', file)
    const fileStat = statSync(nextPath)
    if (fileStat.isDirectory()) {
        HandleDirectory(nextPath, nextPath)
        rmdirSync(nextPath)
    } else if (fileStat.isFIFO()) {
        if (file === 'index.js') {
            renameSync(nextPath, resolve('dist', 'main.js'))
        }
    }
})

function HandleDirectory(path: string, name: string) {
    const files = readdirSync(path)
    files.forEach(file => {
        const nextPath = resolve(path, file)
        const fileStat = statSync(nextPath)
        if (fileStat.isDirectory()) {
            HandleDirectory(nextPath, `${name}_${file}`)
            rmdirSync(nextPath)
        } else if (fileStat.isFile()) {
            renameSync(nextPath, `${name}_${file}`)
        }
    })
}