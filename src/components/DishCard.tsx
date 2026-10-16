import React from "react";

interface DishCardProps {
  name: string;
  category: string;
  imageUrl: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DishCard({ name, category, imageUrl, onEdit, onDelete }: DishCardProps) {
  return (
    <div className="dish-card">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="dish-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-food.png";
          }}
        />
      )}
      <div className="dish-info">
        <h3 className="dish-name">{name}</h3>
        <span className="dish-category">{category}</span>
      </div>
      {onEdit && (
        <button className="btn-edit" onClick={onEdit}>
          Edit
        </button>
      )}
      {onDelete && (
        <button className="btn-delete" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
}
