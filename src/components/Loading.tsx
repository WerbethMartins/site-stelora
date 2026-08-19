import icon from "../assets/img/Stelora_icon.png";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Carregando..." }: LoadingProps) {
  return (
    <div className="loading-container">
        <img src={icon}  className="loading-container__img" alt="Icone do loading" />
        <div className="loading-spinner" />
        <p className="loading-text">{message}</p>
    </div>
  );
}