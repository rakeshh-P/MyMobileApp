import React from 'react';
import { IonCard, IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import './MealCard.css';

interface MealCardProps {
  meal: {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
  };
  onViewDetails: (id: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onViewDetails }) => {
  return (
    <IonCard 
      className="meal-card"
      onClick={() => onViewDetails(meal.idMeal)}
    >
      <div className="meal-image-container">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
        <div className="meal-overlay">
          <div className="stars-background">
            <IonIcon icon={starOutline} className="star star1" />
            <IonIcon icon={star} className="star star2" />
            <IonIcon icon={starOutline} className="star star3" />
            <IonIcon icon={star} className="star star4" />
            <IonIcon icon={starOutline} className="star star5" />
          </div>
          <span className="view-details-text">Click to view details</span>
        </div>
      </div>
      <div className="meal-content">
        <h2>{meal.strMeal}</h2>
        <div className="meal-info">
          <span className="category">{meal.strCategory}</span>
          <span className="area">{meal.strArea}</span>
        </div>
      </div>
    </IonCard>
  );
};

export default MealCard; 