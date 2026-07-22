import React from 'react';

// Tipagem para as props do componente
interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

function Categories({ categories, selectedCategory, onSelectCategory }: CategoriesProps) {
  return (
    <div className="categories-bar">
      {/* Botão para mostrar todos os produtos */}
      <button
        type="button"
        className={`categories-bar__item ${selectedCategory === 'All' ? 'categories-bar__item--active' : ''}`}
        onClick={() => onSelectCategory('All')}
      >
        Todos
      </button>

      {/* Renderização dinâmica das categorias */}
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            className={`categories-bar__item ${isActive ? 'categories-bar__item--active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

export default Categories;