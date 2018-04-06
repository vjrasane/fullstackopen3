import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(r => r.data);
}

const create = (obj) => {
  return axios.post(baseUrl, obj).then(r => r.data);
}

const update = (id, obj) => {
  return axios.put(`${baseUrl}/${id}`, obj).then(r => r.data);
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, create, update, remove}
