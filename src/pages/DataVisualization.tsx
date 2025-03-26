import React, { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonChip,
  IonIcon,
  IonButton,
  RefresherEventDetail
} from '@ionic/react';
import { timeOutline, refreshOutline, saveOutline, cloudDownloadOutline } from 'ionicons/icons';
import './DataVisualization.css';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  lastUpdated?: number;
}

const CACHE_KEY = 'mealDataCache';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

const DataVisualization: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to check if cache is valid
  const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < CACHE_EXPIRY;
  };

  // Load data from cache
  const loadFromCache = useCallback(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (isCacheValid(timestamp)) {
        setMeals(data);
        setLastUpdate(new Date(timestamp));
        return true;
      }
    }
    return false;
  }, []);

  // Save data to cache
  const saveToCache = (data: Meal[]) => {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  };

  // Fetch fresh data from API
  const fetchMeals = async (useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      // Try loading from cache first if allowed
      if (useCache && loadFromCache()) {
        setLoading(false);
        return;
      }

      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();

      if (data.meals) {
        const updatedMeals = data.meals.map((meal: any) => ({
          ...meal,
          lastUpdated: Date.now()
        }));
        setMeals(updatedMeals);
        setLastUpdate(new Date());
        saveToCache(updatedMeals);
      } else {
        setError('No meals found');
      }
    } catch (err) {
      setError('Failed to fetch meal data');
      // Try loading from cache as fallback
      loadFromCache();
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMeals();

    // Set up auto-refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchMeals();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Handle manual refresh
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchMeals(false); // Force fresh data
    event.detail.complete();
  };

  // Force refresh from API
  const handleForceRefresh = () => {
    fetchMeals(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Data Visualization</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleForceRefresh}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {lastUpdate && (
          <div className="update-info">
            <IonChip>
              <IonIcon icon={timeOutline} />
              <IonLabel>Last updated: {lastUpdate.toLocaleTimeString()}</IonLabel>
            </IonChip>
            <IonChip color="success">
              <IonIcon icon={saveOutline} />
              <IonLabel>Cached data available</IonLabel>
            </IonChip>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <IonSpinner />
            <p>Loading meal data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <IonButton onClick={() => fetchMeals(false)}>
              <IonIcon slot="start" icon={cloudDownloadOutline} />
              Retry
            </IonButton>
          </div>
        ) : (
          <IonList>
            {meals.map((meal) => (
              <IonItem key={meal.idMeal} className="meal-item">
                <IonImg 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal} 
                  className="meal-thumbnail"
                />
                <IonLabel>
                  <h2>{meal.strMeal}</h2>
                  <p>
                    {meal.strCategory} • {meal.strArea}
                  </p>
                  {meal.lastUpdated && (
                    <p className="update-time">
                      Updated: {new Date(meal.lastUpdated).toLocaleTimeString()}
                    </p>
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DataVisualization;
