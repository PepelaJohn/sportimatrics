// components/CustomDatePicker.tsx
import React, { SetStateAction, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const CustomDatePicker = ({disabled,customDate, setCustomDate}:{disabled:boolean,setCustomDate:React.Dispatch<SetStateAction<{
  customStartDate?: Date ;
  customEndDate?: Date ;
} | null>>, customDate: { customStartDate?: Date | undefined ; customEndDate?: Date | undefined; } | null; },) => {
  // const [startDate, setStartDate] = useState<Date | null>(null);
  
  // const [endDate, setEndDate] = useState<Date | null>(null);
  const today = new Date();

  const handleStartDateChange = (date: Date | null ) => {
    setCustomDate((prev)=>({...prev, customStartDate:date as Date | undefined}))
    // setStartDate(date);
    if (date && customDate?.customEndDate && date > customDate.customEndDate) {
      // setEndDate(null); // Reset end date if start date exceeds it
      setCustomDate((prev)=>({...prev, customEndDate:undefined}))
    }
  };
  
  const handleEndDateChange = (date: Date | null ) => {
    setCustomDate((prev)=>({...prev, customEndDate:date as Date | undefined}))
    // setEndDate(date);
  };

  return (
    <div className="flex items-center h-full gap-2">
      <div>
        <DatePicker
         className={`h-[40px] cursor-pointer w-[90px] rounded-md ${disabled ? "bg-gray-700":"bg-gray-900"} border border-gray-700`}
          selected={customDate?.customStartDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={customDate!?.customStartDate}
          endDate={customDate?.customEndDate}
          maxDate={customDate?.customEndDate || today}
          dateFormat="yyyy-MM-dd"
          placeholderText="Start"
          disabled={disabled}
        />
      </div>

      <div>
        <DatePicker
          className={`h-[40px] cursor-pointer w-[90px] rounded-md ${disabled ? "bg-gray-700":"bg-gray-900"} border border-gray-700`}
          selected={customDate?.customEndDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={customDate!?.customStartDate}
          endDate={customDate?.customEndDate}
          minDate={customDate?.customStartDate || undefined}
          maxDate={today}
          dateFormat="yyyy-MM-dd"
          placeholderText="End"
          disabled={disabled}
        />
      </div>

     

   
    </div>
  );
};

export default CustomDatePicker;
