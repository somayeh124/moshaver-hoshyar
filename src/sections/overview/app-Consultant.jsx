/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/button-has-type */
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import TimePicker from "react-multi-date-picker/plugins/time_picker";

import { Divider } from '@mui/material';

import { getCookieValue } from 'src/utils/cookie';

import { Onrun } from 'src/api/onRun';

import Iconify from 'src/components/iconify';

export default function CalendarTime() {
    const [selectedDates, setSelectedDates] = useState(new Date());
    const [submissionStatus, setSubmissionStatus] = useState('');
    const [timeData, setTimeData] = useState([]);
    const navigate = useNavigate();
    console.log("tim0", timeData);

    useEffect(() => {
        getTime();
    }, []);

    const handleDateChange = (dates) => {
        setSelectedDates(dates);
    };
    const token = getCookieValue('UID');

    const fetchTime = async () => {
        try {
            const response = await axios.post(
                `${Onrun}/api/settime/consultant/`,
                { date: selectedDates },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedDates(response.data);
            setSubmissionStatus('ارسال شد!');
        } catch (error) {
            console.error('Error fetching Profile:', error);
            if (error.response?.status === 401) {
                console.log("Unauthorized access");
            } else {
                console.log('Network error.');
            }
        }
    };

    const getTime = async () => {
        axios.get(`${Onrun}/api/selecttime/consultant/`, { headers: { Authorization: `Bearer ${token}` }, })
            .then(response => {
                setTimeData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    };
    useEffect(getTime, []);

    const deletTime = async (date, time) => {
        console.log(date, time);
        axios.delete(`${Onrun}/api/delete/settime/?date=${date}&time=${time} `, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                getTime()
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    };

    return (
        <div className='md:flex md:flex-col grid grid-row-1 justify-center items-center md:mt-4'>
            <div className='md:flex grid grid-row-1 justify-between w-full max-w-5xl'>
                <div className="flex flex-col h-96 justify-evenly gap-32 md:mt-24 md:ml-20 ml-4">
                    <div className='flex'>
                        <div className='md:scale-[1.5]'>
                            <Calendar
                                className='w-full'
                                plugins={[
                                    <TimePicker hideSeconds position="bottom" />
                                ]}
                                weekDays={['شنبه', 'یک', 'دو', 'سه', 'چهار', 'پنج', "جمعه"]}
                                calendar={persian}
                                locale={persian_fa}
                                value={selectedDates}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex space-y-80'>
                    <div className='flex flex-col mb-2 h-[570px] overflow-y-scroll justify-evenly items-center md:mt-0 mt-8 w-72 md:w-96 rounded-lg shadow-md shadow-[#6390ba] bg-white'>
                        <div className='flex text-xl font-bold items-center text-[#49a8f5] justify-center bg-[#e3f2fd] p-2 rounded-2xl m-2 md:w-80 w-60 sticky top-4'>
                            برنامه کاری
                        </div>
                        <div className='h-[500px] w-full'>
                            {timeData.length > 0 && timeData.map((item, i) => (
                                <div key={item.date}>
                                    <div className='flex border-gray-200 p-2 items-center justify-center'>
                                        <p>{item.jalali}</p>
                                    </div>
                                    <div className='flex flex-wrap justify-center'>
                                        {item.time.map((jitem, index) => (
                                            <div
                                                key={jitem.time}
                                                className='flex items-center border-[1px] mb-2 p-1 rounded-md w-16 m-1'
                                            >
                                                <p>{jitem.time}</p>
                                                {jitem.reserve ? (
                                                    <Iconify className='text-[#1e89e5] ml-2' icon="material-symbols:check-box-outline-rounded" width="2rem" height="2rem" />
                                                ) : (
                                                    <Iconify onClick={() => deletTime(item.date, jitem.time)} className='text-red-700 ml-2 cursor-pointer' icon="material-symbols:cancel-presentation-outline" width="2rem" height="2rem" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Divider sx={{ width: '360px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-between w-full max-w-5xl mt-4'>
                <button
                    className='bg-green-500 hover:bg-green-700 md:text-lg md:px-12 px-4 ml-3 text-white font-bold py-1 rounded-md text-sm'
                    onClick={fetchTime}
                >
                    تائید
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 md:p-1 md:text-lg md:px-12 px-4 text-white font-bold py-1 rounded-md text-sm"
                    onClick={() => navigate('/')}
                >
                    بازگشت
                </button>
            </div>
            {submissionStatus && (
                <p className="text-[#4caf50] mt-4">
                    {submissionStatus}
                </p>
            )}
        </div>
    );
}
