/* eslint-disable react/button-has-type */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { Box, Chip, Modal, Avatar, Typography } from '@mui/material';

import { getCookieValue } from 'src/utils/cookie';

import { Onrun } from 'src/api/onRun';

import Iconify from '../../components/iconify'; // مطمئن شوید که این ایمپورت صحیح است

const DetailVisit = ({ open, onClose, id }) => {
  const [detail,setDetail] = useState(null)
  const fetchConsultant = async () => {
    const token = getCookieValue('UID');

    try {
      const response = await axios.get(`${Onrun}/api/visit/consultations/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetail(response.data);
    } catch (error) {
      console.log('Error fetching consultant data:', error);
    }
  };

  useEffect(() => {
    fetchConsultant();
  }, [id]);


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxWidth: '90%',
          backgroundColor: '#FFFFFF',
          boxShadow: 24,
          borderRadius: 4,
          textAlign: 'center',
          p: 4,
          border: '2px solid #E0E0E0',
        }}
      >
        {detail && (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: '#42a5f5',
                fontWeight: 'bold',
                backgroundColor: '#e3f2fd',
                py: 1,
                borderRadius: 2,
              }}
            >
              جزئیات مشاوره
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <Avatar
                src={`${Onrun}/${detail.consultant_photo}`}
                alt="مشاور"
                sx={{ width: 100, height: 100, mr: 2 }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                {detail.customer}{' '}
              </Typography>
         
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '18px',mb:1}}>
             امتیاز مشاوره :{detail.risktaking}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              نوع مشاوره: {detail.kind}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }} dir="rtl">
              تاریخ: {detail.date}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ساعت مشاوره: {detail.time}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip
                icon={detail.status === 'done' ? <Iconify icon="gravity-ui:circle-check-fill" /> : <Iconify icon="mdi:perimeter" />}
                label={detail.status === 'done' ? 'تکمیل شد' : 'درحال اجرا'}
                color={detail.status === 'done' ? "info" : "success"}
                sx={{ fontSize: '14px', bgcolor: '#D7ECD9', color: '#4CAF50' }}
              />
            </Box>
          </>
        )}
   
      </Box>
    </Modal>
  );
}
DetailVisit.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired, 
};


export default DetailVisit