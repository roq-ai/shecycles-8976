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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCsrInvestorById, updateCsrInvestorById } from 'apiSdk/csr-investors';
import { Error } from 'components/error';
import { csrInvestorValidationSchema } from 'validationSchema/csr-investors';
import { CsrInvestorInterface } from 'interfaces/csr-investor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function CsrInvestorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CsrInvestorInterface>(
    () => (id ? `/csr-investors/${id}` : null),
    () => getCsrInvestorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CsrInvestorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCsrInvestorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/csr-investors');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CsrInvestorInterface>({
    initialValues: data,
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
            Edit Csr Investor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(CsrInvestorEditPage);
