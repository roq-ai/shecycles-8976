import axios from 'axios';
import queryString from 'query-string';
import { MicroEntrepreneurInterface, MicroEntrepreneurGetQueryInterface } from 'interfaces/micro-entrepreneur';
import { GetQueryInterface } from '../../interfaces';

export const getMicroEntrepreneurs = async (query?: MicroEntrepreneurGetQueryInterface) => {
  const response = await axios.get(`/api/micro-entrepreneurs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMicroEntrepreneur = async (microEntrepreneur: MicroEntrepreneurInterface) => {
  const response = await axios.post('/api/micro-entrepreneurs', microEntrepreneur);
  return response.data;
};

export const updateMicroEntrepreneurById = async (id: string, microEntrepreneur: MicroEntrepreneurInterface) => {
  const response = await axios.put(`/api/micro-entrepreneurs/${id}`, microEntrepreneur);
  return response.data;
};

export const getMicroEntrepreneurById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/micro-entrepreneurs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMicroEntrepreneurById = async (id: string) => {
  const response = await axios.delete(`/api/micro-entrepreneurs/${id}`);
  return response.data;
};
