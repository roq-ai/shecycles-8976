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
import { createCsrInvestor } from 'apiSdk/csr-investors';
import { Error } from 'components/error';
import { csrInvestorValidationSchema } from 'validationSchema/csr-investors';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { CsrInvestorInterface } from 'interfaces/csr-investor';

function CsrInvestorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CsrInvestorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCsrInvestor(values);
      resetForm();
      router.push('/csr-investors');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CsrInvestorInterface>({
    initialValues: {
      branding_details: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: csrInvestorValidationSchema,
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
            Create Csr Investor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="branding_details" mb="4" isInvalid={!!formik.errors?.branding_details}>
            <FormLabel>Branding Details</FormLabel>
            <Input
              type="text"
              name="branding_details"
              value={formik.values?.branding_details}
              onChange={formik.handleChange}
            />
            {formik.errors.branding_details && <FormErrorMessage>{formik.errors?.branding_details}</FormErrorMessage>}
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
    entity: 'csr_investor',
    operation: AccessOperationEnum.CREATE,
  }),
)(CsrInvestorCreatePage);
