
// Tipagem para as props do componente
interface TypesProps {
  types: string[];
  selectedType: string;
  onSelectType: (type: string) => void;
}

function ProductTypes({ types, selectedType, onSelectType }: TypesProps) {
  const filteredTypes = types.filter(
    (t) => t.toLowerCase() !== 'all' && t.toLowerCase() !== 'todos'
  );

  return (
    <div className="categories-bar">
      <button
        type="button"
        className={`categories-bar__item ${selectedType === 'All' ? 'categories-bar__item--active' : ''}`}
        onClick={() => onSelectType('All')}
      >
        Todos
      </button>

      {/* Renderização dinâmica das categorias */}
      {filteredTypes.map((type) => {
        const isActive = selectedType === type;
        return (
          <button
            key={type}
            type="button"
            className={`categories-bar__item ${isActive ? 'categories-bar__item--active' : ''}`}
            onClick={() => onSelectType(type)}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}

export default ProductTypes;