import React, { useState, useRef, ChangeEvent } from "react";
import db from "../lib/db";

interface AddDishFormProps {
  onAddDish: (name: string, category: string, imageUrl?: string, notes?: string) => void;
  initialDishes: Array<{ id: number; name: string; category: string; image_url: string | null }>;
}

const PRESELECTED_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const PRESELECTED_DISHES = [
  "Oatmeal", "Pancakes", "Eggs Benedict", "Avocado Toast", "French Toast",
  "Grilled Cheese", "Pasta", "Stir Fry", "Salad", "Soup",
  "Steak", "Chicken", "Fish", "Tacos", "Burrito",
  "Smoothie", "Yogurt", "Muffin", "Cookies", "Cake"
];

export function AddDishForm({ onAddDish, initialDishes }: AddDishFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAddToMenu, setShowAddToMenu] = useState(false);
  const [addToMenuDate, setAddToMenuDate] = useState("");
  const [addToMenuMealType, setAddToMenuMealType] = useState("breakfast");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectDish = (dishName: string, dishCategory: string) => {
    setName(dishName);
    setCategory(dishCategory);
    setShowAddToMenu(true);
  };

  const handleAddDish = () => {
    if (!name.trim()) return alert("Please enter a dish name.");
    onAddDish(name.trim(), category || "Other", imageUrl, notes);
    setName("");
    setCategory("");
    setImageUrl("");
    setNotes("");
    setShowImagePicker(false);
    setShowAddToMenu(false);
    setAddToMenuDate("");
    setAddToMenuMealType("breakfast");
  };

  const handleAddToMenu = () => {
    if (!addToMenuDate) return alert("Please select a date.");
    onAddDish(name.trim(), category || "Other", imageUrl);
    setShowAddToMenu(false);
    setAddToMenuDate("");
    setAddToMenuMealType("breakfast");
  };

  return (
    <div className="add-dish-form">
      <h2>Add a Dish</h2>

      {!showImagePicker && (
        <div className="form-section">
          <label>
            Dish Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Spaghetti Bolognese"
              className="input-field"
            />
          </label>

          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Select Category</option>
              {PRESELECTED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label>
            Image:
            <div className="image-picker">
              <button className="btn-upload" onClick={() => setShowImagePicker(true)}>
                📷 Upload Image
              </button>
              {imageUrl && (
                <div className="image-preview">
                  <img src={imageUrl} alt="Preview" />
                </div>
              )}
            </div>
          </label>

          <label>
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="input-field"
              rows={3}
            />
          </label>

          <button className="btn-primary" onClick={handleAddDish}>
            Save Dish
          </button>
        </div>
      )}

      {showImagePicker && (
        <div className="form-section">
          <p>Select an image from your device:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <button onClick={() => setShowImagePicker(false)}>Cancel</button>
        </div>
      )}

      {showAddToMenu && (
        <div className="form-section">
          <p>Add to meal calendar:</p>
          <label>
            Date:
            <input
              type="date"
              value={addToMenuDate}
              onChange={(e) => setAddToMenuDate(e.target.value)}
              className="input-field"
            />
          </label>
          <label>
            Meal Type:
            <select
              value={addToMenuMealType}
              onChange={(e) => setAddToMenuMealType(e.target.value)}
              className="input-field"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </label>
          <button className="btn-primary" onClick={handleAddToMenu}>
            Add to Calendar
          </button>
          <button onClick={() => setShowAddToMenu(false)}>Cancel</button>
        </div>
      )}

      <div className="form-section">
        <h3>Quick Select</h3>
        <p>Select from pre-selected dishes:</p>
        <div className="quick-select">
          {PRESELECTED_DISHES.map((dish) => (
            <button
              key={dish}
              className="quick-select-btn"
              onClick={() => handleSelectDish(dish, "Breakfast")}
            >
              {dish}
            </button>
          ))}
        </div>
        <p>Or select a category to see suggestions:</p>
        <div className="category-suggestions">
          {PRESELECTED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="category-suggestion-btn"
              onClick={() => {
                setCategory(cat);
                const suggestions: Record<string, string[]> = {
                  "Breakfast": ["Oatmeal", "Pancakes", "Eggs", "Toast", "Smoothie"],
                  "Lunch": ["Salad", "Sandwich", "Pasta", "Soup", "Wrap"],
                  "Dinner": ["Chicken", "Steak", "Fish", "Tacos", "Rice Bowl"],
                  "Snack": ["Nuts", "Fruit", "Yogurt", "Cheese", "Popcorn"],
                  "Dessert": ["Cookies", "Ice Cream", "Cake", "Pie", "Pudding"],
                };
                const suggestionsForCat = suggestions[cat] || [];
                suggestionsForCat.forEach((suggestion) => {
                  const btn = document.createElement("button");
                  btn.className = "quick-select-btn";
                  btn.textContent = suggestion;
                  btn.onclick = () => handleSelectDish(suggestion, cat);
                  document.querySelector(".category-suggestions")?.appendChild(btn);
                });
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
