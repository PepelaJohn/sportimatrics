// components/CustomDatePicker.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const CustomDatePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const today = new Date();

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null); // Reset end date if start date exceeds it
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  return (
    <div className="date-picker-container">
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate!}
          endDate={endDate!}
          maxDate={today}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
        />
      </div>

      <div>
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate!}
          endDate={endDate!}
          minDate={startDate || undefined}
          maxDate={today}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
        />
      </div>

      <div>
        <strong>Selected Range: </strong>
        {startDate && endDate ? `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}` : 'None'}
      </div>

      <style >{`
        .date-picker-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        label {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default CustomDatePicker;
