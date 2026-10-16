import React, { useEffect, useState } from "react";
import { db } from "../lib/db";
import { AddDishForm } from "../components/AddDishForm";
import { DishCard } from "../components/DishCard";
import { MealSelector } from "../components/MealSelector";

interface Dish {
  id: number;
  name: string;
  category: string;
  image_url: string | null;
}

export default function Home() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const allDishes = db.getAllDishes();
    setDishes(allDishes);
  }, []);

  const handleAddDish = (
    name: string,
    category: string,
    imageUrl?: string,
    notes?: string
  ) => {
    const result = db.insertDish(name, category, imageUrl, notes);
    if (result) {
      const newDish: Dish = {
        id: result.lastInsertRowid,
        name,
        category,
        image_url: imageUrl || null,
      };
      setDishes((prev) => [...prev, newDish]);
    }
  };

  const handleDeleteDish = (id: number) => {
    db.deleteDish(id);
    setDishes((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍳 Cooking Tracker</h1>
        <nav className="app-nav">
          <a href="/" className="nav-link active">Add Dish</a>
          <a href="/calendar" className="nav-link">Calendar</a>
        </nav>
      </header>

      <main className="app-main">
        <AddDishForm onAddDish={handleAddDish} initialDishes={dishes} />

        <section className="dishes-section">
          <h2>Your Dishes</h2>
          {dishes.length === 0 ? (
            <p className="empty-state">No dishes yet. Add your first one!</p>
          ) : (
            <div className="dishes-grid">
              {dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  name={dish.name}
                  category={dish.category}
                  imageUrl={dish.image_url}
                  onDelete={() => handleDeleteDish(dish.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ by sum</p>
      </footer>
    </div>
  );
}
