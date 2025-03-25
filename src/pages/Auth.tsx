import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonText
} from "@ionic/react";
import {
  mailOutline,
  lockClosedOutline,
  checkmarkCircle,
  closeCircle
} from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import './Auth.css';

interface PasswordRequirements {
  minLength: boolean;
  hasNumber: boolean;
  hasLetter: boolean;
  hasSpecialChar: boolean;
}

const Auth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasNumber: false,
    hasLetter: false,
    hasSpecialChar: false
  });

  const history = useHistory();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePasswordRequirements(value);
  };

  const validatePasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const isEmailValid = validateEmail(email);
  const isPasswordValid = Object.values(passwordRequirements).every(req => req);
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    if (!isFormValid) {
      if (!email.trim()) {
        setEmailError("Please enter your email address");
      } else if (!isEmailValid) {
        setEmailError("Please enter a valid email address");
      }
      return;
    }

    setEmailError("");
    setShowSuccess(true);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Wait for success message to show before redirecting
    setTimeout(() => {
      // Force a reload to update all states
      window.location.href = '/home';
    }, 1500);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid) {
      handleLogin();
    }
  };

  return (
    <IonPage>
      <IonContent className="auth-container">
        {showSuccess && (
          <div className="success-message">
            Login Successful! Welcome to Meal Explorer
          </div>
        )}
        <div className="auth-form">
          <div className="auth-header">
            <h2>Welcome to Meal Explorer</h2>
            <p className="subtitle">Please sign in to continue</p>
          </div>

          <div className="form-group">
            <div className="input-container">
              <IonIcon icon={mailOutline} className="input-icon" />
              <IonInput
                type="email"
                placeholder="Email"
                value={email}
                debounce={0}
                onIonInput={e => handleEmailChange(e.detail.value!)}
                onKeyPress={handleKeyPress}
                className={`auth-input ${email ? (isEmailValid ? 'ion-valid' : 'ion-invalid') : ''}`}
              />
            </div>

            {emailError && (
              <div className="error-message">
                <IonText color="danger">{emailError}</IonText>
              </div>
            )}

            <div className="input-container">
              <IonIcon icon={lockClosedOutline} className="input-icon" />
              <IonInput
                type="password"
                placeholder="Password"
                value={password}
                debounce={0}
                onIonInput={e => handlePasswordChange(e.detail.value!)}
                onKeyPress={handleKeyPress}
                className={`auth-input ${password ? (isPasswordValid ? 'ion-valid' : 'ion-invalid') : ''}`}
              />
            </div>

            {password && (
              <div className="password-requirements">
                <h3>Password Requirements:</h3>
                <ul>
                  <li className={passwordRequirements.minLength ? 'met' : ''}>
                    <IonIcon icon={passwordRequirements.minLength ? checkmarkCircle : closeCircle} />
                    At least 8 characters
                  </li>
                  <li className={passwordRequirements.hasNumber ? 'met' : ''}>
                    <IonIcon icon={passwordRequirements.hasNumber ? checkmarkCircle : closeCircle} />
                    Contains a number
                  </li>
                  <li className={passwordRequirements.hasLetter ? 'met' : ''}>
                    <IonIcon icon={passwordRequirements.hasLetter ? checkmarkCircle : closeCircle} />
                    Contains a letter
                  </li>
                  <li className={passwordRequirements.hasSpecialChar ? 'met' : ''}>
                    <IonIcon icon={passwordRequirements.hasSpecialChar ? checkmarkCircle : closeCircle} />
                    Contains a special character
                  </li>
                </ul>
              </div>
            )}

            <IonButton
              expand="block"
              onClick={handleLogin}
              className="login-button"
              size="large"
              disabled={!isFormValid}
            >
              Sign In
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
