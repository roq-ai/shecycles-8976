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
import { getCarbonOffsetInvestorById, updateCarbonOffsetInvestorById } from 'apiSdk/carbon-offset-investors';
import { Error } from 'components/error';
import { carbonOffsetInvestorValidationSchema } from 'validationSchema/carbon-offset-investors';
import { CarbonOffsetInvestorInterface } from 'interfaces/carbon-offset-investor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function CarbonOffsetInvestorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CarbonOffsetInvestorInterface>(
    () => (id ? `/carbon-offset-investors/${id}` : null),
    () => getCarbonOffsetInvestorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CarbonOffsetInvestorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCarbonOffsetInvestorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/carbon-offset-investors');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CarbonOffsetInvestorInterface>({
    initialValues: data,
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
            Edit Carbon Offset Investor
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
    entity: 'carbon_offset_investor',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CarbonOffsetInvestorEditPage);
