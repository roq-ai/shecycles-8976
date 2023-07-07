import axios from 'axios';
import queryString from 'query-string';
import { GovSubsidyProviderInterface, GovSubsidyProviderGetQueryInterface } from 'interfaces/gov-subsidy-provider';
import { GetQueryInterface } from '../../interfaces';

export const getGovSubsidyProviders = async (query?: GovSubsidyProviderGetQueryInterface) => {
  const response = await axios.get(`/api/gov-subsidy-providers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGovSubsidyProvider = async (govSubsidyProvider: GovSubsidyProviderInterface) => {
  const response = await axios.post('/api/gov-subsidy-providers', govSubsidyProvider);
  return response.data;
};

export const updateGovSubsidyProviderById = async (id: string, govSubsidyProvider: GovSubsidyProviderInterface) => {
  const response = await axios.put(`/api/gov-subsidy-providers/${id}`, govSubsidyProvider);
  return response.data;
};

export const getGovSubsidyProviderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/gov-subsidy-providers/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteGovSubsidyProviderById = async (id: string) => {
  const response = await axios.delete(`/api/gov-subsidy-providers/${id}`);
  return response.data;
};
