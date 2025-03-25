import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import './Profile.css';

const Profile: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/auth';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="profile-content">
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <img src="https://gravatar.com/avatar?d=mp" alt="Profile" />
            </IonAvatar>
            <h2>User Profile</h2>
          </div>

          <IonList>
            <IonItem>
              <IonLabel>
                <h3>Email</h3>
                <p>user@example.com</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Member Since</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </IonLabel>
            </IonItem>
          </IonList>

          <IonButton 
            expand="block" 
            color="danger" 
            onClick={handleLogout}
            className="logout-button"
          >
            <IonIcon slot="start" icon={logOutOutline} />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile; 