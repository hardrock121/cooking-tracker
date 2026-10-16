import React, { useEffect, useState } from "react";
import db from "../lib/db";
import { DishCard } from "../components/DishCard";

interface Meal {
  id: number;
  dish_id: number;
  dish_name: string;
  dish_category: string;
  image_url: string | null;
  meal_type: string;
  date: string;
  notes: string;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [addMealDishId, setAddMealDishId] = useState<number | null>(null);
  const [addMealNotes, setAddMealNotes] = useState("");

  useEffect(() => {
    loadMeals();
  }, [currentMonth]);

  const loadMeals = () => {
    const month = currentMonth.toISOString().slice(0, 7); // YYYY-MM
    const allMeals = db.getMealsByMonth(month);
    setMeals(allMeals);
  };

  const handleAddMeal = () => {
    if (!addMealDishId || !selectedDate) return;
    db.insertMeal(addMealDishId, selectedMealType, selectedDate);
    loadMeals();
    setShowAddMeal(false);
    setAddMealDishId(null);
    setAddMealNotes("");
  };

  const handleDeleteMeal = (mealId: number) => {
    db.deleteMeal(mealId);
    loadMeals();
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (string | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i.toString());
    return days;
  };

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const days = getDaysInMonth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Calendar</h1>
        <nav className="app-nav">
          <a href="/" className="nav-link">Add Dish</a>
          <a href="/calendar" className="nav-link active">Calendar</a>
        </nav>
      </header>

      <main className="app-main">
        <div className="calendar-header">
          <button
            className="btn-nav"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            ← Previous
          </button>
          <h2>{monthName}</h2>
          <button
            className="btn-nav"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            Next →
          </button>
        </div>

        <div className="calendar-controls">
          <label>
            Meal Type:
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="meal-select"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </label>
          <button
            className="btn-add"
            onClick={() => setShowAddMeal(true)}
          >
            + Add Meal
          </button>
        </div>

        {showAddMeal && (
          <div className="add-meal-modal">
            <h3>Add Meal to Calendar</h3>
            <p>Select a dish from your saved dishes:</p>
            <div className="dish-select-grid">
              {meals.map((meal) => (
                <button
                  key={meal.id}
                  className="dish-select-btn"
                  onClick={() => {
                    setAddMealDishId(meal.dish_id);
                    setAddMealNotes(meal.notes || "");
                  }}
                >
                  <img src={meal.image_url || "/placeholder-food.png"} alt={meal.dish_name} />
                  <span>{meal.dish_name}</span>
                </button>
              ))}
            </div>
            <label>
              Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </label>
            <label>
              Meal Type:
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="meal-select"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </label>
            <label>
              Notes:
              <textarea
                value={addMealNotes}
                onChange={(e) => setAddMealNotes(e.target.value)}
                className="input-field"
                rows={2}
              />
            </label>
            <button className="btn-primary" onClick={handleAddMeal}>
              Save
            </button>
            <button onClick={() => setShowAddMeal(false)}>Cancel</button>
          </div>
        )}

        <div className="calendar-grid">
          {days.map((day, index) => {
            if (!day) return <div key={index} className="calendar-day empty" />;
            const dayMeals = meals.filter((m) => {
              const mealDate = new Date(m.date);
              const dayDate = new Date(day);
              return (
                mealDate.toISOString().slice(0, 10) === dayDate.toISOString().slice(0, 10) &&
                (selectedMealType === "all" || m.meal_type === selectedMealType)
              );
            });
            return (
              <div key={index} className="calendar-day">
                <span className="day-number">{day}</span>
                <div className="day-meals">
                  {dayMeals.map((meal) => (
                    <DishCard
                      key={meal.id}
                      name={meal.dish_name}
                      category={meal.dish_category}
                      imageUrl={meal.image_url}
                      onDelete={() => handleDeleteMeal(meal.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ by sum</p>
      </footer>
    </div>
  );
}
