import { LoadingButton } from '@mui/lab';
// material
import {
  IconButton,
  InputAdornment, Link,
  Stack,
  TextField
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import * as Yup from 'yup';
import axios from 'axios';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loginFailPassword, setLogInFailPassword] = useState(false)
  const [loginFailEmail, setLogInFailEmail] = useState(false)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });
  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  let history = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (value) => {
      let user = { user: { email: value.email, password: value.password } };
      try {
        const response = await api.post('/api/login', user, {
          headers: { Authorization: localStorage.getItem('access_token') }
        });

        if (response.status === 200) {
          setLogInFailEmail(false);
          setLogInFailPassword(false);
          const responseJson = JSON.stringify(response.data.result);
          localStorage.setItem("loggedInUser", responseJson);
          localStorage.setItem("access_token", response.data.token);
          window.location.href = window.location.origin + "/dashboard/home";
        }
      } catch (err) {

        if (err.response.data == "Invalid Password") {
          setLogInFailPassword(true);
          setLogInFailEmail(false);
        }
        if (err.response.data == "Incorrect Email") {
          setLogInFailEmail(true);
          setLogInFailPassword(false);
        }
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  let location = useLocation();
  localStorage.setItem('lastPage', location.pathname);
  const checkLoggedIn = () => {
   
    let loggedIn = localStorage.getItem("loggedInUser");
    let lastPage = localStorage.getItem("lastPage");
    if (loggedIn && lastPage !== "/") {
      // history(state.from);
        history(lastPage)
    }
    else if(loggedIn && lastPage =="/")
    {
      history('/dashboard/home');
    }
    else {
      history('/login');
    }
}
  useEffect(() => {
    checkLoggedIn();
  }, [])

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mb: 2 }}>
          <div>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
            <span style={{ color: 'red', display: loginFailEmail ? 'block' : 'none', fontSize: '14px' }}>Incorrect Email</span>
          </div>
          <div>
            <TextField
              sx={{ borderRadius: "0" }}
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <span style={{ color: 'red', display: loginFailPassword ? 'block' : 'none', fontSize: '14px' }}>Incorrect Password</span>
          </div>
        </Stack>

        <LoadingButton
          sx={{ background: "#1B1464", boxShadow: "none", borderRadius: "0" }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
