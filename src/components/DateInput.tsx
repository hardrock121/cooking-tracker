import React from "react";

interface DateInputProps {
  date: string;
  setDate: (date: string) => void;
}

export function DateInput({ date, setDate }: DateInputProps) {
  return (
    <div className="date-input">
      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="date-input-field"
      />
    </div>
  );
}
