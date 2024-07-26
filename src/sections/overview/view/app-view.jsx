/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { getCookieValue, setCookieValue } from 'src/utils/cookie';

import { Onrun } from 'src/api/onRun';

import AppTasks from '../app-tasks';
import AppWidgetSummary from '../app-widget-summary';

export default function AppView() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);
  const [data, setData] = useState(null);
  const [agreementStatus, setAgreementStatus] = useState(null);
  const [cardBox, setCardBox] = useState('');

  const token = getCookieValue('UID');
// چک میشه اگر توکن کاربر وجود داشته باشه تو صفحه می مونه در غیر این صورت  وارد صفحه ورود میشه
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`${Onrun}/api/consultant/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data);
          setAgreementStatus(response.data.agreement);
          if (!response.data.agreement) {
            setModalOpen(true);
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 401 || error.response.status === 500) {
              setCookieValue('UID', '');
              navigate('/login');
            } else {
              setError(error.response.data.message || error.message || 'خطا');
            }
          } else {
            setError('اینترنت خود را چک کنید');
          }
        }
      };
      fetchProfile();
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookieValue('UID');
        const response = await axios.put(
          `${Onrun}/api/agreement/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        console.log('response', response);
      } catch (error) {
        console.error('Error:', error);
        if (error.response) {
          console.error('Error details:', error.response);
        }
      }
    };

    fetchData();
  }, []);

  const handleConfirm = () => {
    setModalOpen(false);
    setConfirmResult('Confirmed');
  };

  const handleLogout = () => {
    setCookieValue('UID', '');
    navigate('/login');
  };
// مقادیر توی باکس  بالای صفحه پنل مشاور را از بک اند دریافت میکنه
  const fetchWidgetSummary = async () => {
    const token = getCookieValue('UID');

    try {
      const response = await axios.get(`${Onrun}/api/cardbox/consultant/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCardBox(response.data);
      console.log('fetchWidgetSummary', response.data);
    } catch (error) {
      console.log('Error fetching time:', error);
    }
  };
  console.log('cardBox.consultations_waiting ', cardBox.consultations_waiting);

  useEffect(() => {
    fetchWidgetSummary();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} style={{ justifyContent: 'center', direction: 'rtl' }}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='تعداد بازدید کنندگان'
            total={cardBox.visits}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='مشاوره های در حال انتظار'
            total={cardBox.consultations_waiting}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/team.png" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title='امتیاز مشاور'
            total={cardBox.Consultant_score}
            color="warning"
            icon={<img alt="icon" src="../../../../public/assets/icons/glass/icons8-star-80.png" />}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <AppTasks title="Tasks" />
        </Grid>
      </Grid>
      {agreementStatus === false && (
        <Modal
          open={modalOpen}
          onClose={null}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <Typography id="modal-description" variant="h5" mb={5}>
              {data && data.message ? data.message : 'در حال بارگذاری...'}
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleConfirm}>
                  میپذیرم
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={handleLogout}>
                  خروج
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      )}
    </Container>
  );
}
