/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import axios from 'axios';
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import {  CardHeader } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { getCookieValue } from 'src/utils/cookie';

// request 'http://192.168.62.106:8000'
import { Onrun } from 'src/api/onRun';

import Iconify from 'src/components/iconify';

import DetailVisit from './app-propview';

// ----------------------------------------------------------------------

export default function AnalyticsTasks({ title, subheader, ...other }) {
  const [selected, setSelected] = useState(['2']); // حالت برای نگهداری آیتم‌های انتخاب شده
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // حالت برای باز یا بسته بودن مودال تایید حذف
  const [viewModalOpen, setViewModalOpen] = useState(false); // حالت برای باز یا بسته بودن مودال مشاهده
  const [selectedTask, setSelectedTask] = useState(null); // حالت برای نگهداری تسک انتخاب شده
  const [list, setList] = useState([]); // حالت برای نگهداری لیست تسک‌ها

  // تابع برای گرفتن لیست مشتریان
  const fetchConsultant = async () => {
    const token = getCookieValue('UID'); // گرفتن توکن از کوکی

    try {
      const response = await axios.get(`${Onrun}/api/visit/consultations/list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setList(response.data); // ذخیره داده‌ها در حالت لیست
    } catch (error) {
      console.log('Error fetching consultant data:', error); // نمایش خطا در صورت عدم موفقیت
    }
  };

  useEffect(() => {
    fetchConsultant(); // فراخوانی تابع fetchConsultant در زمان لود کامپوننت
  }, []);

  const navigate = useNavigate(); // استفاده از هوک useNavigate برای مسیریابی

  // تابع برای مدیریت کلیک تکمیل تسک
  const handleClickComplete = (taskId) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted); // به روز رسانی حالت selected
  };

  // تابع برای مدیریت حذف تسک
  const handleDelete = (taskId) => {
    setSelectedTask(taskId); // تنظیم تسک انتخاب شده
    setConfirmDeleteOpen(true); // باز کردن مودال تایید حذف
  };

  // تابع برای تایید حذف تسک
  const handleConfirmDelete = () => {
    console.info('DELETE', selectedTask); // نمایش پیام در کنسول
    setConfirmDeleteOpen(false); // بستن مودال تایید حذف
  };

  // تابع برای مشاهده جزئیات تسک
  const handleView = (taskId) => {
    setSelectedTask(taskId); // تنظیم تسک انتخاب شده
    setViewModalOpen(true); // باز کردن مودال مشاهده
  };

 

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
      dir="rtl" // تنظیم جهت به راست
    >
      <div className='flex justify-between mb-8 md:m-4'>
        <CardHeader
          sx={{
            mb: 3,
            textAlign: 'center',
            fontSize: '1rem',
          }}
          title='برنامه کاری شما' // عنوان برنامه کاری شما
        />
        <Box className='mt-4' >
          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/date')} // مسیریابی به صفحه تقویم
          >
            <Iconify className="ml-2 " icon="material-symbols:checkbook-outline-rounded" width="1.2rem" height="1.2rem" />
            برنامه کاری
          </Button>
        </Box>
      </div>
      <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#64b5f6' }}>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#555555',
                }}
              >
                نام مشتری
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#555555',
                }}
              >
                نوع
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#555555',
                }}
              >
                وضعیت
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#555555',
                }}
              >
                تاریخ
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#555555',
                }}
              >
                عملیات
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  اطلاعاتی موجود نمیباشد {' '}
                </TableCell>
              </TableRow>
            ) : (
              list.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  list={list}
                  checked={selected.includes(task.id)}
                  onClickComplete={() => handleClickComplete(task.id)}
                  onDelete={() => handleDelete(task.id)}
                  onView={() => handleView(task.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


     
    </Card>
  );
}

AnalyticsTasks.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
// ----------------------------------------------------------------------

// کامپوننت TaskItem برای نمایش یک ردیف از تسک‌ها
function TaskItem({ task, list, onView }) {
  const [open, setOpen] = useState(false);
  const isComplating = list.status === 'complating';

  const [openMenu, setOpenMenu] = useState(null); // حالت برای باز یا بسته بودن منوی پاپ‌اور

  // تابع برای باز کردن منوی پاپ‌اور
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  // تابع برای بستن منوی پاپ‌اور
  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleShare = () => {
    handleCloseMenu();
    console.info('SHARE', task.id);
  };

  return (
    <TableRow
      sx={{
        border: '2px solid #e0e0e0',
        '&:hover': { backgroundColor: '#f5f5f5' },
      }}
    >
      <React.Fragment key={task.id}>
        <TableCell>{task.customer}</TableCell>
        <TableCell>{task.kind}</TableCell>
        <TableCell style={{ display: 'flex', marginRight: '20px', alignItems: 'center' }}>
          {task.status ? (
            <Iconify icon="mdi:perimeter" style={{ color: 'green' }} />
          ) : (
            <Iconify icon="gravity-ui:circle-check" style={{ color: 'blue' }} />
          )}
        </TableCell>
        <TableCell>{task.date}</TableCell>
      </React.Fragment>


      <TableCell>
        <IconButton color={openMenu ? 'inherit' : 'default'} onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Popover
          open={!!openMenu}
          anchorEl={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => setOpen(true) } >
            <Iconify icon="gravity-ui:chevrons-expand-up-right" sx={{ mr: 2 }} />
            مشاهده
          </MenuItem>
          <DetailVisit
            open={open}
            onClose={() => setOpen(false)}
            id={task.id}
          />
         
        </Popover>
      </TableCell>
    </TableRow>
  );
}

