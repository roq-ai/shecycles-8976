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
import { getMicroEntrepreneurById, updateMicroEntrepreneurById } from 'apiSdk/micro-entrepreneurs';
import { Error } from 'components/error';
import { microEntrepreneurValidationSchema } from 'validationSchema/micro-entrepreneurs';
import { MicroEntrepreneurInterface } from 'interfaces/micro-entrepreneur';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function MicroEntrepreneurEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MicroEntrepreneurInterface>(
    () => (id ? `/micro-entrepreneurs/${id}` : null),
    () => getMicroEntrepreneurById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MicroEntrepreneurInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMicroEntrepreneurById(id, values);
      mutate(updated);
      resetForm();
      router.push('/micro-entrepreneurs');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MicroEntrepreneurInterface>({
    initialValues: data,
    validationSchema: microEntrepreneurValidationSchema,
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
            Edit Micro Entrepreneur
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
            <FormControl id="station_details" mb="4" isInvalid={!!formik.errors?.station_details}>
              <FormLabel>Station Details</FormLabel>
              <Input
                type="text"
                name="station_details"
                value={formik.values?.station_details}
                onChange={formik.handleChange}
              />
              {formik.errors.station_details && <FormErrorMessage>{formik.errors?.station_details}</FormErrorMessage>}
            </FormControl>
            <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
            </FormControl>
            <FormControl id="annual_revenue_potential" mb="4" isInvalid={!!formik.errors?.annual_revenue_potential}>
              <FormLabel>Annual Revenue Potential</FormLabel>
              <NumberInput
                name="annual_revenue_potential"
                value={formik.values?.annual_revenue_potential}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('annual_revenue_potential', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.annual_revenue_potential && (
                <FormErrorMessage>{formik.errors?.annual_revenue_potential}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="annual_expenditure" mb="4" isInvalid={!!formik.errors?.annual_expenditure}>
              <FormLabel>Annual Expenditure</FormLabel>
              <NumberInput
                name="annual_expenditure"
                value={formik.values?.annual_expenditure}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('annual_expenditure', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.annual_expenditure && (
                <FormErrorMessage>{formik.errors?.annual_expenditure}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="roi" mb="4" isInvalid={!!formik.errors?.roi}>
              <FormLabel>Roi</FormLabel>
              <NumberInput
                name="roi"
                value={formik.values?.roi}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('roi', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.roi && <FormErrorMessage>{formik.errors?.roi}</FormErrorMessage>}
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
    entity: 'micro_entrepreneur',
    operation: AccessOperationEnum.UPDATE,
  }),
)(MicroEntrepreneurEditPage);
