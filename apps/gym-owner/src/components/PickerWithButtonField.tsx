import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface PickerWithButtonFieldProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const PickerWithButtonField: React.FC<PickerWithButtonFieldProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MM/dd/yyyy"
        placeholderText="Select date"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
};

export default PickerWithButtonField;