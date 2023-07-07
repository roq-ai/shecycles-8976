import * as yup from 'yup';

export const microEntrepreneurValidationSchema = yup.object().shape({
  station_details: yup.string(),
  location: yup.string(),
  annual_revenue_potential: yup.number().integer(),
  annual_expenditure: yup.number().integer(),
  roi: yup.number().integer(),
  user_id: yup.string().nullable(),
});
