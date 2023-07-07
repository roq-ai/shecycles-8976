import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  rental_details: yup.string(),
  user_id: yup.string().nullable(),
});
