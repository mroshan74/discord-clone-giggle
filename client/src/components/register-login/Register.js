import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { object, string, ref } from 'yup'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import {
  Button,
  TextField,
  Box,
  FormGroup,
  InputAdornment,
  IconButton,
} from '@material-ui/core'

import '../../styles/form.css'
import { startRegister } from '../../redux/actions/loginsAction'

const registerSchema = object().shape({
  username: string().required().min(4, 'minimum 4 characters'),
  email: string().email().required(),
  password: string().required().min(6, 'minimum 6 characters'),
  confirmPass: string().oneOf([ref('password')], 'password must match'),

  //🧾https://til.hashrocket.com/posts/vahuw4phan-check-the-password-confirmation-with-yup
})

// ! https://dev.to/finallynero/react-form-using-formik-material-ui-and-yup-2e8h
// ! https://medium.com/@kmerandi25/react-form-validation-with-formik-material-ui-and-yup-1cd92eac887

function Register(props) {
  const [showPass, setShowPass] = useState(false)
  const handleShowPass = () => {
    console.log(showPass, 'showPass')
    setShowPass(!showPass)
  }
  const redirect = () => {
    props.history.push('/users/login')
  }
  return (
    <div className='register-bg'>
      <div className='form-container'>
        <Formik
          initialValues={{
            username: '',
            password: '',
            confirmPass: '',
            email: '',
          }}
          validationSchema={registerSchema}
          onSubmit={(values, { setSubmitting }) => {
            const regEnable = () => {
              setSubmitting(false)
            }
            const fd = {
              ...values,
            }
            //console.log(fd, setSubmitting)
            props.dispatch(startRegister(fd, redirect, regEnable))
          }}
        >
          {({ isSubmitting, values, errors, touched, isValid }) => (
            <Fragment>
              <div className='form-register'>
                <h1>Register</h1>
                <Form>
                  <Box marginBottom={2}>
                    <FormGroup>
                      <Field
                        error={touched.username && Boolean(errors.username)}
                        type='text'
                        name='username'
                        label='Username'
                        variant='outlined'
                        as={TextField}
                        helperText={touched.username && errors.username}
                      />
                    </FormGroup>
                  </Box>
                  <Box marginBottom={2}>
                    <FormGroup>
                      <Field
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        type='email'
                        name='email'
                        label='Email'
                        variant='outlined'
                        as={TextField}
                      />
                    </FormGroup>
                  </Box>
                  <Box marginBottom={2}>
                    <FormGroup>
                      <Field
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        type={showPass ? 'text' : 'password'}
                        name='password'
                        label='Password'
                        variant='outlined'
                        as={TextField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={handleShowPass}
                                className='icon-svg'
                              >
                                {showPass ? (
                                  <MdVisibility />
                                ) : (
                                  <MdVisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormGroup>
                  </Box>
                  <Box marginBottom={2}>
                    <FormGroup>
                      <Field
                        error={
                          touched.confirmPass && Boolean(errors.confirmPass)
                        }
                        helperText={touched.confirmPass && errors.confirmPass}
                        type='password'
                        name='confirmPass'
                        label='Confirm Password'
                        variant='outlined'
                        as={TextField}
                      />
                    </FormGroup>
                  </Box>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    className='btn-register'
                    disabled={isSubmitting || !isValid}
                  >
                    SIGN UP
                  </Button>
                  {/* <pre>{JSON.stringify(values, null, 4)}</pre>
                  <pre>{JSON.stringify(isSubmitting, null, 4)}</pre>
                  <pre>{JSON.stringify(errors, null, 4)}</pre>
                  <pre>{JSON.stringify(isValid, null, 4)}</pre> */}
                </Form>
              </div>
            </Fragment>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default connect()(Register)
