import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonLabel,
  IonAlert
} from "@ionic/react";
import { logOutOutline, filterOutline, starOutline, star, chevronForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Home.css';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface Category {
  strCategory: string;
}

interface Area {
  strArea: string;
}

const Home: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchCategories();
    fetchAreas();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const timer = setTimeout(() => {
        fetchMeals();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      fetchMeals();
    }
  }, [searchText, selectedCategory, selectedArea]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const data = await response.json();
      setCategories(data.meals);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      const data = await response.json();
      setAreas(data.meals);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const fetchMeals = async () => {
    setLoading(true);
    try {
      let url = '';
      let meals = [];
      
      if (searchText) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
        const response = await fetch(url);
        const data = await response.json();
        meals = data.meals || [];
      } else if (selectedCategory || selectedArea) {
        url = selectedCategory 
          ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
          : `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.meals) {
          const detailedMeals = await Promise.all(
            data.meals.map(async (meal: Meal) => {
              try {
                const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                const detailData = await detailResponse.json();
                return detailData.meals[0];
              } catch (error) {
                console.error(`Error fetching details for meal ${meal.idMeal}:`, error);
                return null;
              }
            })
          );
          meals = detailedMeals.filter(meal => meal !== null);
        }
      } else {
        const randomMeals = await Promise.all(
          Array(8).fill(null).map(async () => {
            try {
              const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
              const data = await response.json();
              return data.meals[0];
            } catch (error) {
              console.error('Error fetching random meal:', error);
              return null;
            }
          })
        );
        meals = randomMeals.filter(meal => meal !== null);
      }
      
      setMeals(meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setMeals([]);
    }
    setLoading(false);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
    setSelectedArea('');
  };

  const handleAreaClick = (area: string) => {
    setSelectedArea(selectedArea === area ? '' : area);
    setSelectedCategory('');
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('isAuthenticated');
    history.push('/auth');
  };

  return (
    <IonPage>
      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header="Logout"
        message="Are you sure you want to logout?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: 'Logout',
            handler: confirmLogout,
            cssClass: 'alert-button-logout'
          }
        ]}
        cssClass="logout-alert"
      />
      <IonHeader>
        <IonToolbar>
          <div className="header-content">
            <IonSearchbar
              value={searchText}
              onIonChange={e => setSearchText(e.detail.value!)}
              placeholder="Search for meals..."
              className="meal-searchbar"
            />
            <div className="header-buttons">
              <IonButton
                className={`filter-button ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <IonIcon slot="icon-only" icon={filterOutline} />
              </IonButton>
              <IonButton
                className="logout-button"
                onClick={handleLogout}
              >
                <IonIcon slot="icon-only" icon={logOutOutline} />
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="page-title">
          <h1>Discover Delicious Meals</h1>
        </div>

        {showFilters && (
          <div className="filters-section">
            <h2>Categories</h2>
            <div className="filter-chips">
              {categories.map(category => (
                <IonChip
                  key={category.strCategory}
                  className={`filter-chip ${selectedCategory === category.strCategory ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.strCategory)}
                >
                  <IonLabel>{category.strCategory}</IonLabel>
                </IonChip>
              ))}
            </div>

            <h2>Cuisines</h2>
            <div className="filter-chips">
              {areas.map(area => (
                <IonChip
                  key={area.strArea}
                  className={`filter-chip ${selectedArea === area.strArea ? 'active' : ''}`}
                  onClick={() => handleAreaClick(area.strArea)}
                >
                  <IonLabel>{area.strArea}</IonLabel>
                </IonChip>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <IonSpinner />
          </div>
        ) : meals?.length > 0 ? (
          <div className="meals-grid">
            {meals.map(meal => (
              <div
                key={meal.idMeal}
                className="meal-card"
                onClick={() => history.push(`/meal/${meal.idMeal}`)}
              >
                <div className="meal-image-container">
                  <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-card-image" />
                  <div className="meal-title-base">{meal.strMeal}</div>
                  <div className="meal-overlay">
                    <h3 className="meal-title-hover">{meal.strMeal}</h3>
                    <div className="meal-tags">
                      {meal.strCategory && (
                        <span className="meal-tag category">{meal.strCategory}</span>
                      )}
                      {meal.strArea && (
                        <span className="meal-tag cuisine">{meal.strArea}</span>
                      )}
                    </div>
                    <div className="rating">
                      <IonIcon icon={star} className="star" />
                      <IonIcon icon={star} className="star" />
                      <IonIcon icon={star} className="star" />
                      <IonIcon icon={star} className="star" />
                      <IonIcon icon={starOutline} className="star" />
                    </div>
                    <div className="view-recipe">
                      View Recipe
                      <IonIcon icon={chevronForward} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No meals found</h3>
            <p>Try searching for something else</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
