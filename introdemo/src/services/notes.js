import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject)
    return response.data
}

const update = async (id, change) => {
    const response= await axios.patch(`${baseUrl}/${id}`, change)
    return response.data
}

export default {
    getAll,
    create,
    update
}