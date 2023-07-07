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
import { createGovSubsidyProvider } from 'apiSdk/gov-subsidy-providers';
import { Error } from 'components/error';
import { govSubsidyProviderValidationSchema } from 'validationSchema/gov-subsidy-providers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { GovSubsidyProviderInterface } from 'interfaces/gov-subsidy-provider';

function GovSubsidyProviderCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GovSubsidyProviderInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGovSubsidyProvider(values);
      resetForm();
      router.push('/gov-subsidy-providers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GovSubsidyProviderInterface>({
    initialValues: {
      subsidy_details: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: govSubsidyProviderValidationSchema,
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
            Create Gov Subsidy Provider
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="subsidy_details" mb="4" isInvalid={!!formik.errors?.subsidy_details}>
            <FormLabel>Subsidy Details</FormLabel>
            <Input
              type="text"
              name="subsidy_details"
              value={formik.values?.subsidy_details}
              onChange={formik.handleChange}
            />
            {formik.errors.subsidy_details && <FormErrorMessage>{formik.errors?.subsidy_details}</FormErrorMessage>}
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
    entity: 'gov_subsidy_provider',
    operation: AccessOperationEnum.CREATE,
  }),
)(GovSubsidyProviderCreatePage);
