import React from "react";

interface MealSelectorProps {
  mealType: string;
  setMealType: (type: string) => void;
}

export function MealSelector({ mealType, setMealType }: MealSelectorProps) {
  return (
    <div className="meal-selector">
      <label>Meal Type:</label>
      <select
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
        className="meal-select"
      >
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>
    </div>
  );
}
