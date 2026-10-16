// Database module for Cooking Tracker
// Simple in-memory SQLite-like storage using a plain JS object
// This is lightweight, requires no external dependencies, and works everywhere

type Row = Record<string, any>;

interface Database {
  insertDish: (name: string, category: string, imageUrl?: string, notes?: string) => number;
  getDishById: (id: number) => Dish | null;
  getAllDishes: () => Dish[];
  insertMeal: (dishId: number, mealType: string, date: string) => number;
  getMealsByMonth: (month: string) => Meal[];
  deleteDish: (id: number) => number;
  deleteMeal: (id: number) => number;
}

interface Dish {
  id: number;
  name: string;
  category: string;
  image_url: string | null;
  notes: string | null;
  created_at: string;
}

interface Meal {
  id: number;
  dish_id: number;
  dish_name: string;
  dish_category: string;
  image_url: string | null;
  meal_type: string;
  date: string;
  notes: string;
  created_at: string;
}

// In-memory storage
const dishes: Dish[] = [];
const meals: Meal[] = [];
let nextDishId = 1;
let nextMealId = 1;

const db: Database = {
  insertDish: (name: string, category: string, imageUrl?: string, notes?: string) => {
    const dish: Dish = {
      id: nextDishId++,
      name,
      category,
      image_url: imageUrl || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };
    dishes.push(dish);
    return dish.id;
  },

  getDishById: (id: number) => {
    return dishes.find((d) => d.id === id) || null;
  },

  getAllDishes: () => {
    return [...dishes];
  },

  insertMeal: (dishId: number, mealType: string, date: string) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return 0;

    const meal: Meal = {
      id: nextMealId++,
      dish_id: dishId,
      dish_name: dish.name,
      dish_category: dish.category,
      image_url: dish.image_url,
      meal_type: mealType,
      date,
      notes: "",
      created_at: new Date().toISOString(),
    };
    meals.push(meal);
    return meal.id;
  },

  getMealsByMonth: (month: string) => {
    const prefix = `${month}-`;
    return meals.filter((m) => m.date.startsWith(prefix));
  },

  deleteDish: (id: number) => {
    const index = dishes.findIndex((d) => d.id === id);
    if (index === -1) return 0;
    dishes.splice(index, 1);
    return 1;
  },

  deleteMeal: (id: number) => {
    const index = meals.findIndex((m) => m.id === id);
    if (index === -1) return 0;
    meals.splice(index, 1);
    return 1;
  },
};

export default db;
