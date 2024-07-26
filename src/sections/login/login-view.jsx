/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Button, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { getCookieValue, setCookieValue } from 'src/utils/cookie';

// request 'http://192.168.62.106:8000'
import { Onrun } from 'src/api/onRun';
import { bgGradient } from 'src/theme/css';

export default function LoginView() {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState('');
  const [captchaLogin, setCaptchaLogin] = useState('');
  const [codeNumber, setCodeNumber] = useState('');

  const navigate = useNavigate();
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(true);
  const [captchaData, setCaptchaData] = useState(null);
  // فرم دریافت کد تائید
  const [secondForm, setSecondForm] = useState(false);
  // فرم login
  const [firstForm, setfirstForm] = useState(true);


  // برای گرفتن کپچا در ورود
  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await axios.get(`${Onrun}/api/captcha/`);
      setCaptchaData(response.data);
    } catch (error) {
      console.error('Error fetching captcha:', error);

      if (error.response) {
        console.error('Server response:', error.response.data);
        const errorMessage = error.response.data.message;
        toast.error(`خطا در ارسال کپچا: ${errorMessage}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('خطا در ارسال کپچا ');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error(`خطا در ارسال کپچا: ${error.message}`);
      }
    } finally {
      setIsLoadingCaptcha(false);
    }
  };
  useEffect(() => {
    fetchCaptcha();
  }, []);
  // دریافت کد تائید
  const handleClick = async () => {
    try {
      const response = await axios.post(`${Onrun}/api/otp/consultant/`, {
        mobile: mobileNumber,
        captcha: captchaLogin,
        encrypted_response: captchaData.encrypted_response,
      });
      console.log('OTP response:', response);

      console.log('response.data.registered', response.data.registered);
      if (response.data.registered === false) {
        setSecondForm(false);
      } else {
        setSecondForm(true);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        toast.error('خطا در ارسال درخواست', error.message);
      }
      toast.error('خطا در ارسال درخواست', error.message);
    }
  };
  const loginClick = async () => {
    try {
      const sendApiCode = await axios.post(`${Onrun}/api/login/consultant/`, {
        mobile: mobileNumber,
        code: codeNumber,
      });
      // ست کردن کوکی
      setCookieValue('UID', sendApiCode.data.access);

      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('خطا در ارسال درخواست', error.message);
    }
  };

  // چک کردن آیدی
  const checkUID = () => {
    const uid = getCookieValue('UID');
    console.log(uid);
  };
// ویرایش شماره موبایل
  const editPhone = () => {
    setSecondForm(false);
    setfirstForm(true);
  };
// کوکی را چک
  useEffect(() => {
    checkUID();
  }, []);


  useEffect(() => {
    fetchCaptcha();
  }, []);

  const renderForm = (
    <>
      {firstForm && !secondForm && (
        <>
          <Stack spacing={3}>
            <TextField
              name="mobile"
              label="شماره موبایل"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <TextField
              style={{ marginBottom: '20px' }}
              name="captcha"
              label="کپچا"
              value={captchaLogin}
              onChange={(e) => setCaptchaLogin(e.target.value)}
            />
          </Stack>

          {isLoadingCaptcha ? (
            <Skeleton variant="rounded" width={330} height={60} />
          ) : (
            <Stack spacing={3}>
              <Button onClick={fetchCaptcha}>
                <img src={`data:image/png;base64,${captchaData?.image}`} alt="captcha" />
              </Button>
            </Stack>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              className='bg-[#3a84cd]'
              onClick={handleClick}
            >
              تایید
            </LoadingButton>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </>
      )}
      {/* فرم دوم برای وارد کردن کد تائید */}
      {secondForm && (
        <>
          <Stack spacing={3}>
            <TextField value={mobileNumber} disabled name="mobileNumber" />
            <TextField
              name="Code"
              label="کد تایید"
              onChange={(e) => setCodeNumber(e.target.value)}
            />
          </Stack>

          <div className='space-y-4' style={{ marginTop: '20px' }}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              className='bg-[#3a84cd]'
              onClick={editPhone}
            >
              ویرایش شماره
            </LoadingButton>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              className='bg-[#1973cf]'
              onClick={loginClick}
            >
              ورود
            </LoadingButton>
          </div>
        </>
      )}
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          {firstForm && !secondForm && (
            <>
              <Typography variant="h3"> ورود</Typography>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ورود
                </Typography>
              </Divider>
            </>
          )}
          {secondForm &&  (
            <>
              <Typography variant="h3"> تایید شماره تلفن</Typography>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  تایید شماره
                </Typography>
              </Divider>
            </>
          )}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
