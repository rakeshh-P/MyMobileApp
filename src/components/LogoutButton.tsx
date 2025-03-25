import React, { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonAlert,
  useIonRouter
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import './LogoutButton.css';

const LogoutButton: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useIonRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    // Force a reload to reset all states
    window.location.href = '/auth';
  };

  return (
    <>
      <IonButton
        fill="clear"
        className="logout-button"
        onClick={() => setShowConfirm(true)}
      >
        <IonIcon slot="icon-only" icon={logOutOutline} />
      </IonButton>

      <IonAlert
        isOpen={showConfirm}
        onDidDismiss={() => setShowConfirm(false)}
        header="Confirm Logout"
        message="Are you sure you want to logout?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Logout',
            handler: handleLogout,
            cssClass: 'danger'
          }
        ]}
        cssClass="logout-alert"
      />
    </>
  );
};

export default LogoutButton; 