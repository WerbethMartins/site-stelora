import { useState } from "react";
import { Link } from "react-router-dom";

// Images
import bell from "../assets/img/bell.png";
import arrow from "../assets/img/arrow.png";

// Hooks
import { useMessage } from "../hooks/useMessage";

// Um esboço rápido de como ficaria a estrutura
function ProductForm() {
    // Estado para controlar se é exclusivo ou não
    const [isExclusive, setIsExclusive] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { showMessage } = useMessage();

    // Função para criar URL da imagem ao criar um novo Produto
    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // FormData captura automaticamente todos os inputs que têm o atributo "name"
        const formData = new FormData(e.currentTarget);
        
        const newProduct = {
            name: formData.get("name"),
            price: Number(formData.get("price")),
            discount: Number(formData.get("discount")),
            category: formData.get("category"),
            typeSize: formData.get("typeSize"),
            size: Number(formData.get("size")),
            description: formData.get("description"),
            image: imageUrl,
            exclusive: isExclusive,
            enphasis: isExclusive  
        };

        showMessage("Produto cadastrado com sucesso!");

        console.log("Produto pronto para o Firebase:", newProduct);
        // Lógica para salvar no Firebase virá aqui...
    };

    const handleSaveProduct = () => {
        // Aqui você pode adicionar a lógica para salvar o produto no Firebase
        // Por enquanto, apenas exibimos uma mensagem de sucesso
        showMessage("Produto cadastrado com sucesso!");
    }

    return (
        <>
            <section className="product-form__section">
                <div className="form__header">
                    <Link to="/">
                        <button type="button" className="form__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <div className="form__header-title-group">
                        <h1 className="form__title">Formulário</h1>
                        <button type="button" className="form__icon-btn">
                            <img className="form__icon" src={bell} alt="Notificações" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="product-form__title-section">
                        <h1 style={{ textShadow: "0px 2px 4px rgba(0, 0, 0, 0.575)" }}>Cadastrar Novo Produto</h1>
                    </div>
                    
                    {/* Campos comuns */}
                    <div className="product-form__input">
                        <div className="product-form__product-name">
                            <input name="name" type="text" placeholder="Nome do Produto" required />
                        </div>
                        <div className="product-form__product-price">
                            <input name="price" type="number" placeholder="Preço" step="0.01" required />
                            <input name="discount" type="number" placeholder="Desconto (%)" />
                        </div>
                        <div className="product-form__product-category">
                           <input name="category" type="text" placeholder="Categoria (ex: Cosmético, 3D)" required />
                        </div>
                        <div className="product-form__product-type-size">
                            <input name="typeSize" type="text" placeholder="Tipo (Cosmético ou 3D)" required />
                            <input name="size" type="number" placeholder="Tamanho do produto" required />
                        </div>
                        <div className="product-form__product-description">
                            <textarea name="description" placeholder="Descrição do Produto" required></textarea>
                        </div>
                        <div className="product-form__product-image">
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* O "Pulo do Gato" para o MVP */}
                    <label className="checkbox-container">
                        <input 
                            type="checkbox" 
                            checked={isExclusive}
                            onChange={(e) => setIsExclusive(e.target.checked)}
                        />
                        Marcar como Produto Exclusivo (Destaque na Home)
                    </label>

                    <button type="submit" className="product-form__btn" onClick={handleSaveProduct}>
                        Salvar Produto
                    </button>
                </form>
            </section>
        </>
    );
}

export default ProductForm;