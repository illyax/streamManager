import StreamManager from './streamManager'
import * as api from './api'

const delay = async (time = 2000) => {
    await new Promise(res => {
        setTimeout(() => { res() }, time)
    })
}

const getResult = async requestId => {
    try {
        const res = await api.getResult(requestId)
        return res
    } catch (e) {
        if (e.response.data.error.toLowerCase().includes('still in progress')) {
            await delay()
            return await getResult(requestId)
        }
    }
}

const jobHandler = async data => {
    const requestId = await api.calculate(data)
    return await getResult(requestId)
}

const sm = new StreamManager({ jobHandler, inputFilePath: 'src/input.txt', outputFilePath: 'src/output.txt' })

sm.start()