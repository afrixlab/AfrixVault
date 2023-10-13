'use client';
import React from 'react';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

import { BiChevronLeft } from 'react-icons/bi';

import {
  Box,
  Center,
  InputGroup,
  InputRightElement,
  FormControl,
  FormErrorMessage,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  ButtonGroup,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import SocialBtn from '@/components/SocialBtn';
import Logo from '@/components/header/Logo';
import axios from 'axios';

const AllForm = () => {
  const router = useRouter();
  const toast = useToast();
  const [formState, setFormState] = React.useState(false);
  const [forgetPassword, setForgetPassword] = React.useState(false);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    router.push(
      `?action=${
        formState
          ? 'create-account'
          : forgetPassword
          ? 'forget-password'
          : 'login'
      }`,
      { scroll: false }
    );

    window.location.search;
  }, [router, formState, forgetPassword]);

  const handleTogglePassword = () => setShow(!show);

  const handleFormState = () => {
    setFormState((formState) => !formState);
    setForgetPassword(false);
  };

  const handleDefault = () => {
    setForgetPassword(false);
  };

  return (
    <Box as='section' className='min-h-screen py-6 bg-login'>
      <Grid placeItems='center'>
        <Center className='py-4 pb-20'>
          <Logo image={'/logo-header.svg'} />
        </Center>
        <Box
          pos='relative'
          overflow='hidden'
          bg='black'
          color='white'
          w={{
            base: '90%',
            md: '70%',
            lg: '40%',
          }}
          p={6}
          borderRadius='xl'
        >
          {forgetPassword && (
            <button
              onClick={handleDefault}
              className='absolute top-4 left-4 text-[#1EC6B1] flex item-center bg-[#1EC6B1]/50 px-2 rounded'
            >
              <BiChevronLeft className='mt-1 text-lg' />
              <span> Back</span>
            </button>
          )}
          <Formik
            initialValues={{
              email: '',
              password: '',
              first_name: '',
              last_name: '',
            }}
            onSubmit={async (values) => {
              await axios
                .post(
                  `${
                    formState
                      ? 'https://vaults.protechhire.com:8443/api/v1/auth/register/'
                      : forgetPassword
                      ? 'https://vaults.protechhire.com:8443/api/v1/auth/reset-account/'
                      : 'https://vaults.protechhire.com:8443/api/v1/auth/login/'
                  }`,
                  values
                )
                .then((res) => {
                  if (res.status === 200 && formState) {
                    toast({
                      position: 'top',
                      title: 'Account created.',
                      description: "We've created your account for you.",
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                    setFormState(false);
                  }

                  // push router to /dashboard when user login
                  if (res.status === 200 && !formState) {
                    toast({
                      position: 'top',
                      title: 'Signed in successfully.',
                      description: 'Welcome back!',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                    router.push('/dashboard');
                  }

                  if (res.status === 200 && forgetPassword) {
                    toast({
                      position: 'top',
                      title: 'Password reset.',
                      description: 'Your password has been reset.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                    setForgetPassword(false);
                  }
                })
                .catch((err) => {
                  toast({
                    position: 'top',
                    title: 'Error',
                    description: err.response.data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                })
                .finally(() => {
                  values.email = '';
                  values.password = '';
                  values.first_name = '';
                  values.last_name = '';
                });
            }}
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <Center className='flex flex-col gap-2 pb-8 text-center'>
                    {forgetPassword ? (
                      <>
                        <Flex className='flex-col gap-1 pt-8'>
                          <Heading>Forget password?</Heading>
                          <Text className='text-sm text-white/70'>
                            Enter the email address you created your account
                            with.
                          </Text>
                        </Flex>
                      </>
                    ) : (
                      <>
                        <Heading>
                          {formState ? 'Create your account' : 'Log in'}{' '}
                        </Heading>
                        <Text className='text-white/70'>
                          {formState
                            ? 'Already have an account?'
                            : 'New to vault?'}{' '}
                          <span
                            onClick={handleFormState}
                            className=' text-[#51EC81] cursor-pointer'
                          >
                            {formState ? 'Log in' : 'Create an account'}
                          </span>
                        </Text>
                      </>
                    )}
                  </Center>

                  {/* Forget Password */}
                  {forgetPassword && (
                    <FormControl isInvalid={!!errors.email && touched.email}>
                      <Field
                        className='bg-[#293534] shadow-form'
                        as={Input}
                        name='email'
                        id='email'
                        type='email'
                        variant='filled'
                        placeholder=' Email'
                        validate={(value) => {
                          let error;
                          if (!value) {
                            error = 'Email is required';
                          }
                          // IF email does not contain @, error
                          else if (!value.includes('@')) {
                            error = 'Invalid email';
                          }
                          return error;
                        }}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                  )}

                  {/* first_name and last_name */}
                  {formState && (
                    <Flex
                      gap={4}
                      w='full'
                      flexDir={{ base: 'column', md: 'row' }}
                    >
                      <FormControl
                        className='flex-1'
                        isInvalid={!!errors.first_name && touched.first_name}
                      >
                        <Field
                          className='bg-[#293534] shadow-form'
                          as={Input}
                          name='first_name'
                          id='first_name'
                          type='text'
                          variant='filled'
                          placeholder='First Name'
                          validate={(value) => {
                            let error;
                            if (!value) {
                              error = 'First Name is required';
                            }
                            return error;
                          }}
                        />
                        <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                      </FormControl>
                      <FormControl
                        className='flex-1'
                        isInvalid={!!errors.last_name && touched.last_name}
                      >
                        <Field
                          className='bg-[#293534] shadow-form'
                          as={Input}
                          name='last_name'
                          id='last_name'
                          type='text'
                          variant='filled'
                          placeholder='Last Name'
                          validate={(value) => {
                            let error;
                            if (!value) {
                              error = 'Last Name is required';
                            }
                            return error;
                          }}
                        />
                        <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                      </FormControl>
                    </Flex>
                  )}
                  {/* Log in */}
                  {!forgetPassword && (
                    <>
                      <FormControl isInvalid={!!errors.email && touched.email}>
                        <Field
                          className='bg-[#293534] shadow-form'
                          as={Input}
                          name='email'
                          id='email'
                          type='email'
                          variant='filled'
                          placeholder=' Email'
                          validate={(value) => {
                            let error;
                            if (!value) {
                              error = 'Email is required';
                            }
                            // IF email does not contain @, error
                            else if (!value.includes('@')) {
                              error = 'Invalid email';
                            }
                            return error;
                          }}
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>
                      {/* Password Input */}
                      <FormControl
                        isInvalid={!!errors.password && touched.password}
                      >
                        <InputGroup size='md'>
                          <Field
                            className='bg-[#293534] shadow-form'
                            pr='4.5rem'
                            as={Input}
                            name='password'
                            id='password'
                            type={show ? 'text' : 'password'}
                            variant='filled'
                            placeholder='Password'
                            validate={(value) => {
                              let error;
                              if (!value) {
                                error = 'Password is required';
                              } else if (!/[A-Z]/.test(value)) {
                                error =
                                  'Password must contain at least one uppercase letter';
                              }
                              // password must contain special characters
                              else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                                error =
                                  'Password must contain at least one special character';
                              }

                              return error;
                            }}
                          />
                          <InputRightElement width='4.5rem' cursor='pointer'>
                            <div
                              h='1.75rem'
                              size='sm'
                              onClick={handleTogglePassword}
                            >
                              {show ? (
                                <AiOutlineEyeInvisible />
                              ) : (
                                <AiOutlineEye />
                              )}
                            </div>
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                  <Button
                    className='w-full'
                    title={
                      formState
                        ? `${
                            isSubmitting
                              ? 'Creating account...'
                              : 'Create account'
                          }`
                        : forgetPassword
                        ? `${
                            isSubmitting
                              ? 'Sending instructions...'
                              : 'Send Instructions'
                          }`
                        : `${isSubmitting ? 'Logging In...' : 'Log In'}`
                    }
                    type='submit'
                  />
                  {formState ? (
                    <Text className='text-white/70'>
                      By continuing, you agree to our{' '}
                      <Link href='/terms-of-service' className='text-[#51EC81]'>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href='/privacy-policy' className='text-[#51EC81]'>
                        Privacy Policy
                      </Link>
                    </Text>
                  ) : (
                    <span
                      className='text-center text-[#51EC81] cursor-pointer'
                      onClick={() => setForgetPassword(!forgetPassword)}
                    >
                      {forgetPassword ? '' : 'Forget Password?'}
                    </span>
                  )}
                  {!forgetPassword && (
                    <>
                      <Text className='flex items-center justify-center gap-4 form-or text-white/70'>
                        or
                      </Text>

                      <ButtonGroup className='w-full'>
                        <SocialBtn
                          className='flex-1 w-full'
                          bgColor='#fff'
                          image={'/google.svg'}
                          alt='Google'
                        />
                        <SocialBtn
                          className='flex-1 w-full hover:bg-blue-500'
                          bgColor='#0676Eb'
                          image={'/facebook.svg'}
                          alt='Facebook'
                        />
                      </ButtonGroup>
                    </>
                  )}
                </VStack>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Box>
  );
};

export default AllForm;
