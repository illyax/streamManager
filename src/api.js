import axios from 'axios'

const { IP, PORT } = process.env

console.log({ IP, PORT })

const axiosInstance = axios.create({
    baseURL: `http://${IP}:${PORT}`
})

export const calculate = async data => {
    const { data: { request_id: requestId } } = await axiosInstance.post('/', { data })
    return requestId
}

export const getResult = async request_id => {
    console.log({ request_id })
    const { data: { result } } = await axiosInstance.get(`/?request_id=${request_id}`)
    console.log({ result })
    return result
}

