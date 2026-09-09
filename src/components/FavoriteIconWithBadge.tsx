import { useFavorites } from "../context/FavoriteContext";

export const FavoriteIconWithBadge = () => {
    const { favoritesCount } = useFavorites();

    return (
        <span className="icon-wrapper" arial-hidden="true">
            {favoritesCount > 0 && (
                <span className="icon-badge">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
            )}
        </span>
    );
}