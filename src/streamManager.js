import fs from 'fs'
import Promise from 'bluebird'

export default class StreamManager {

    constructor({ concurrentJobs = 5, jobHandler, inputFilePath, outputFilePath }) {
        this.concurrentJobs = concurrentJobs
        this.jobHandler = jobHandler
        this.readable = fs.createReadStream(inputFilePath)
        this.readable.setEncoding('utf8')
        this.writable = fs.createWriteStream(outputFilePath)
    }

    async start() {
        this.handleStream()
        return new Promise(res => {
            this.readable.on('end', function () {
                console.log('finshed')
                res()
            })
        })
    }

    handleStream() {
        this.readable.on('data', async chunk => {
            const lines = chunk.split('\n')
            await Promise.map(lines, async line => {
                const num = parseInt(line)
                try {
                    const result = await this.jobHandler(num)
                    this.writable.write(num + ' -> ' + result + '\n')
                } catch (e) {
                    console.log(e.response.data)
                }
            }, { concurrency: this.concurrentJobs })
        })
    }
}