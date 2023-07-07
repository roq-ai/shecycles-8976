import * as yup from 'yup';

export const csrInvestorValidationSchema = yup.object().shape({
  branding_details: yup.string(),
  user_id: yup.string().nullable(),
});
