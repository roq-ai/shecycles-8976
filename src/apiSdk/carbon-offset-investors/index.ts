import axios from 'axios';
import queryString from 'query-string';
import {
  CarbonOffsetInvestorInterface,
  CarbonOffsetInvestorGetQueryInterface,
} from 'interfaces/carbon-offset-investor';
import { GetQueryInterface } from '../../interfaces';

export const getCarbonOffsetInvestors = async (query?: CarbonOffsetInvestorGetQueryInterface) => {
  const response = await axios.get(`/api/carbon-offset-investors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCarbonOffsetInvestor = async (carbonOffsetInvestor: CarbonOffsetInvestorInterface) => {
  const response = await axios.post('/api/carbon-offset-investors', carbonOffsetInvestor);
  return response.data;
};

export const updateCarbonOffsetInvestorById = async (
  id: string,
  carbonOffsetInvestor: CarbonOffsetInvestorInterface,
) => {
  const response = await axios.put(`/api/carbon-offset-investors/${id}`, carbonOffsetInvestor);
  return response.data;
};

export const getCarbonOffsetInvestorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/carbon-offset-investors/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteCarbonOffsetInvestorById = async (id: string) => {
  const response = await axios.delete(`/api/carbon-offset-investors/${id}`);
  return response.data;
};
