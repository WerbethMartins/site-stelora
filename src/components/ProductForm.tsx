import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Images
import bell from "../assets/img/bell.png";
import arrow from "../assets/img/arrow.png";

// Hooks
import { useMessage } from "../hooks/useMessage";
import { addProduct } from "../service/ProductService";

// Utils
import { compressImage } from "../utils/CompressImage";

function ProductForm() {
    // Estado para controlar se é exclusivo ou não
    const [isExclusive] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { showMessage } = useMessage();
    const navigate = useNavigate();

    // Função para criar URL da imagem ao criar um novo Produto
    async function handleImageUpload (event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            try {
                // Comprime antes de definir no estado
                const compressedBase64 = await compressImage(file, 800, 0.7);
                setImageUrl(compressedBase64);
            } catch (error) {
                console.error("Erro ao comprimir imagem:", error);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!imageUrl){
            showMessage("Pro favor, selecione uma imagem para o produto.");
            return;
        }
        
        setIsSubmitting(true);
        // FormData captura automaticamente todos os inputs que têm o atributo "name"
        const formData = new FormData(e.currentTarget);
        
        const newProduct = {
            name: formData.get("name") as string,
            price: Number(formData.get("price")),
            discount: Number(formData.get("discount")) || 0,
            category: formData.get("category") as string,
            typeSize: formData.get("typeSize") as string,
            size: (formData.get("size")) as string,
            description: formData.get("description") as string,
            image: imageUrl,
            exclusive: isExclusive,
            enphasis: isExclusive,
            imgExclusive: imageUrl
        };

        try{
            await addProduct(newProduct);
            showMessage("produto cadastrado com sucesso!");
            navigate("/catalog")
        }catch(error){
            showMessage("Erro ao cadastrar produto no banco");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <input name="size" type="text" placeholder="Tamanho do produto" required />
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

                    <button type="submit" className="product-form__btn" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Salvar Produto"}
                    </button>
                </form>
            </section>
        </>
    );
}

export default ProductForm;