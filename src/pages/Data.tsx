import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { analyticsOutline, trendingUpOutline, peopleOutline } from 'ionicons/icons';
import './Data.css';

const Data: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="data-content">
          <div className="data-container">
            <IonCard className="data-card">
              <IonCardHeader>
                <IonIcon icon={analyticsOutline} />
                <IonCardTitle>Total Meals</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel className="stat-value">150</IonLabel>
                <IonLabel className="stat-label">meals explored</IonLabel>
              </IonCardContent>
            </IonCard>

            <IonCard className="data-card">
              <IonCardHeader>
                <IonIcon icon={trendingUpOutline} />
                <IonCardTitle>Popular Categories</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel className="stat-value">25</IonLabel>
                <IonLabel className="stat-label">categories</IonLabel>
              </IonCardContent>
            </IonCard>

            <IonCard className="data-card">
              <IonCardHeader>
                <IonIcon icon={peopleOutline} />
                <IonCardTitle>Active Users</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel className="stat-value">1.2k</IonLabel>
                <IonLabel className="stat-label">users</IonLabel>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Data; 