import axios from 'axios';
import queryString from 'query-string';
import { CsrInvestorInterface, CsrInvestorGetQueryInterface } from 'interfaces/csr-investor';
import { GetQueryInterface } from '../../interfaces';

export const getCsrInvestors = async (query?: CsrInvestorGetQueryInterface) => {
  const response = await axios.get(`/api/csr-investors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCsrInvestor = async (csrInvestor: CsrInvestorInterface) => {
  const response = await axios.post('/api/csr-investors', csrInvestor);
  return response.data;
};

export const updateCsrInvestorById = async (id: string, csrInvestor: CsrInvestorInterface) => {
  const response = await axios.put(`/api/csr-investors/${id}`, csrInvestor);
  return response.data;
};

export const getCsrInvestorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/csr-investors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCsrInvestorById = async (id: string) => {
  const response = await axios.delete(`/api/csr-investors/${id}`);
  return response.data;
};
