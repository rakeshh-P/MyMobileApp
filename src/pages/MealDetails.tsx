import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSpinner,
  IonChip,
  IonIcon,
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useParams } from 'react-router';
import {
  locationOutline,
  restaurantOutline,
  timeOutline,
  bookmarkOutline,
  globeOutline,
  checkmarkCircle,
  videocamOutline,
  chevronDown,
} from 'ionicons/icons';
import './MealDetails.css';

interface Ingredient {
  name: string;
  measure: string;
}

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  ingredients: Ingredient[];
}

const MealDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(['ingredients']);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
          const mealData = data.meals[0];
          const ingredients: Ingredient[] = [];

          // Extract ingredients and measures
          for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[`strIngredient${i}`];
            const measure = mealData[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim() !== '') {
              ingredients.push({
                name: ingredient,
                measure: measure || ''
              });
            }
          }

          setMeal({
            idMeal: mealData.idMeal,
            strMeal: mealData.strMeal,
            strCategory: mealData.strCategory,
            strArea: mealData.strArea,
            strInstructions: mealData.strInstructions,
            strMealThumb: mealData.strMealThumb,
            strTags: mealData.strTags || '',
            strYoutube: mealData.strYoutube || '',
            ingredients
          });
        } else {
          setError('Meal not found');
        }
      } catch (err) {
        setError('Failed to fetch meal details');
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [id]);

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="loading-container">
            <IonSpinner />
            <p>Loading meal details...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !meal) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="error-container">
            <p>{error || 'Failed to load meal details'}</p>
            <IonButton routerLink="/home">Go back to home</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{meal.strMeal}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="meal-hero">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
          <div className="meal-info-overlay">
            <h1>{meal.strMeal}</h1>
            <div className="meal-meta">
              <IonChip color="primary">
                <IonIcon icon={restaurantOutline} />
                <span>{meal.strCategory}</span>
              </IonChip>
              <IonChip color="secondary">
                <IonIcon icon={globeOutline} />
                <span>{meal.strArea}</span>
              </IonChip>
              {meal.strTags && (
                <IonChip color="tertiary">
                  <IonIcon icon={bookmarkOutline} />
                  <span>{meal.strTags}</span>
                </IonChip>
              )}
            </div>
          </div>
        </div>

        <div className="meal-content">
          <IonAccordionGroup 
            multiple={true}
            value={expandedAccordions}
            onIonChange={(e) => setExpandedAccordions(e.detail.value as string[])}
          >
            <IonAccordion value="ingredients">
              <IonItem slot="header" className="accordion-header">
                <IonIcon icon={timeOutline} slot="start" className="section-icon" />
                <IonLabel>
                  <h2>Ingredients</h2>
                </IonLabel>
                <IonIcon icon={chevronDown} slot="end" className="dropdown-icon" />
              </IonItem>
              
              <div className="accordion-content" slot="content">
                <div className="ingredients-grid">
                  {meal.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-item">
                      <IonIcon icon={checkmarkCircle} color="success" />
                      <div className="ingredient-info">
                        <span className="ingredient-name">{ingredient.name}</span>
                        <span className="ingredient-measure">{ingredient.measure}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </IonAccordion>

            <IonAccordion value="instructions">
              <IonItem slot="header" className="accordion-header">
                <IonIcon icon={locationOutline} slot="start" className="section-icon" />
                <IonLabel>
                  <h2>Instructions</h2>
                </IonLabel>
                <IonIcon icon={chevronDown} slot="end" className="dropdown-icon" />
              </IonItem>
              
              <div className="accordion-content" slot="content">
                <div className="instructions-list">
                  {meal.strInstructions.split('\n').map((instruction, index) => (
                    instruction.trim() && (
                      <div key={index} className="instruction-step">
                        <span className="step-number">{index + 1}</span>
                        <p>{instruction.trim()}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </IonAccordion>
          </IonAccordionGroup>

          {meal.strYoutube && (
            <section className="meal-section">
              <div className="section-header">
                <IonIcon icon={videocamOutline} />
                <h2>Video Tutorial</h2>
              </div>
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(meal.strYoutube)}`}
                  title="Recipe Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MealDetails; 