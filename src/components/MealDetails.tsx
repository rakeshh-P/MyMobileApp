import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonText,
  IonChip
} from '@ionic/react';
import { 
  timeOutline, 
  listOutline, 
  restaurantOutline, 
  globeOutline,
  chevronDown,
  checkmarkCircle
} from 'ionicons/icons';
import './MealDetails.css';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  step: number;
  text: string;
}

interface MealDetailsProps {
  title: string;
  category?: string;
  cuisine?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

const MealDetails: React.FC<MealDetailsProps> = ({ 
  title, 
  category, 
  cuisine, 
  ingredients, 
  instructions 
}) => {
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(['ingredients']);

  const handleAccordionChange = (e: CustomEvent) => {
    const values = e.detail.value;
    setExpandedAccordions(Array.isArray(values) ? values : [values]);
  };

  return (
    <div className="meal-details">
      <div className="meal-header">
        <h1>{title}</h1>
        <div className="meal-tags">
          {category && (
            <IonChip className="meal-tag">
              <IonIcon icon={restaurantOutline} />
              <IonLabel>{category}</IonLabel>
            </IonChip>
          )}
          {cuisine && (
            <IonChip className="meal-tag">
              <IonIcon icon={globeOutline} />
              <IonLabel>{cuisine}</IonLabel>
            </IonChip>
          )}
        </div>
      </div>

      <IonAccordionGroup 
        multiple={true}
        value={expandedAccordions}
        onIonChange={handleAccordionChange}
      >
        <IonAccordion value="ingredients">
          <IonItem slot="header" className="accordion-header">
            <IonIcon icon={listOutline} slot="start" className="section-icon" />
            <IonLabel>
              <h2>Ingredients</h2>
            </IonLabel>
            <IonIcon icon={chevronDown} slot="end" className="dropdown-icon" />
          </IonItem>
          
          <div slot="content" className="accordion-content">
            <IonList>
              {ingredients.map((ingredient, index) => (
                <IonItem key={index} lines="none" className="ingredient-item">
                  <IonIcon icon={checkmarkCircle} slot="start" className="check-icon" />
                  <IonLabel>
                    <div className="ingredient-text">
                      <span className="ingredient-name">{ingredient.name}</span>
                      <span className="ingredient-amount">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </div>
        </IonAccordion>

        <IonAccordion value="instructions">
          <IonItem slot="header" className="accordion-header">
            <IonIcon icon={timeOutline} slot="start" className="section-icon" />
            <IonLabel>
              <h2>Instructions</h2>
            </IonLabel>
            <IonIcon icon={chevronDown} slot="end" className="dropdown-icon" />
          </IonItem>
          
          <div slot="content" className="accordion-content">
            <IonList>
              {instructions.map((instruction) => (
                <IonItem key={instruction.step} lines="none" className="instruction-item">
                  <div className="step-number">{instruction.step}</div>
                  <IonLabel className="instruction-text">
                    {instruction.text}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </div>
        </IonAccordion>
      </IonAccordionGroup>
    </div>
  );
};

export default MealDetails; 