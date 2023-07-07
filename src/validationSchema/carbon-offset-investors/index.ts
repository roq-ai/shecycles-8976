import * as yup from 'yup';

export const carbonOffsetInvestorValidationSchema = yup.object().shape({
  photo_details: yup.string(),
  user_id: yup.string().nullable(),
});
