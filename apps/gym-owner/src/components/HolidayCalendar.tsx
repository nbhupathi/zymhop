import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface Holiday {
  date: Date;
  description: string;
}

const HolidayCalendar: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');

  const addHoliday = () => {
    if (selectedDate && description) {
      setHolidays([...holidays, { date: selectedDate, description }]);
      setSelectedDate(null);
      setDescription('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Holiday Calendar</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select holiday date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Holiday description"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          
          <button
            onClick={addHoliday}
            disabled={!selectedDate || !description}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Holiday
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Holidays</h3>
          {holidays.length > 0 ? (
            <ul className="space-y-2">
              {holidays.map((holiday, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">
                    {holiday.date.toLocaleDateString()}
                  </span>
                  <span className="text-gray-600">{holiday.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No holidays scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;