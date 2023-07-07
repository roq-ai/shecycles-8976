import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCarbonOffsetInvestor } from 'apiSdk/carbon-offset-investors';
import { Error } from 'components/error';
import { carbonOffsetInvestorValidationSchema } from 'validationSchema/carbon-offset-investors';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { CarbonOffsetInvestorInterface } from 'interfaces/carbon-offset-investor';

function CarbonOffsetInvestorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CarbonOffsetInvestorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCarbonOffsetInvestor(values);
      resetForm();
      router.push('/carbon-offset-investors');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CarbonOffsetInvestorInterface>({
    initialValues: {
      photo_details: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: carbonOffsetInvestorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Carbon Offset Investor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="photo_details" mb="4" isInvalid={!!formik.errors?.photo_details}>
            <FormLabel>Photo Details</FormLabel>
            <Input
              type="text"
              name="photo_details"
              value={formik.values?.photo_details}
              onChange={formik.handleChange}
            />
            {formik.errors.photo_details && <FormErrorMessage>{formik.errors?.photo_details}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'carbon_offset_investor',
    operation: AccessOperationEnum.CREATE,
  }),
)(CarbonOffsetInvestorCreatePage);
