import * as yup from 'yup';

export const govSubsidyProviderValidationSchema = yup.object().shape({
  subsidy_details: yup.string(),
  user_id: yup.string().nullable(),
});
