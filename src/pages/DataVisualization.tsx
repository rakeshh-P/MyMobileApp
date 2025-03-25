import React, { useState, useEffect } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonImg } from "@ionic/react";
import axios from "axios";

const DataVisualization: React.FC = () => {
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        setMeals(response.data.meals);
      } catch (error) {
        console.error("Error fetching meal data", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meal List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {meals.map((meal) => (
            <IonItem key={meal.idMeal}>
              <IonImg src={meal.strMealThumb} alt={meal.strMeal} />
              <IonLabel>
                <h3>{meal.strMeal}</h3>
                <p>{meal.strCategory}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DataVisualization;
