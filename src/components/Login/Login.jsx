import { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

export const Login = () => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleEmailChange = (event) => {
        const email = event.target.value;
        setEmailValue(email);
        setIsEmailValid(validateEmail(email));
    }

    const handlePasswordChange = (event) => {
        setPasswordValue(event.target.value);
    }

    const handlePasswordShown = () => {
        setPasswordShown(!passwordShown);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);

        if (!isEmailValid || passwordValue.trim() === '') {
            return;
        }

        try {
            const response = await fetch('https://auth-qa.qencode.com/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
    
            if (data.error === 0) {
                console.log('Login successful', data);
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                localStorage.setItem('tokenExpire', data.token_expire);
                
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    };

    return (
        <div className="Login">
            <div className="container">
                <img 
                    src="../src/assets/icons/logo.svg"
                    alt="Qencode Logo"
                    className="Login__logo" 
                />

                <div className="Login__header mainHeader">Log in to your account</div>

                <div className="Login__wrapper">
                    <button className='Login__button-wrapper'>
                        <img src="../src/assets/icons/google-logo.svg" alt="Google logo" />
                        <div className="Login__button-text">Google</div>
                    </button>
                    <button className="Login__button-wrapper">
                        <img src="../src/assets/icons/github-logo.svg" alt="Github logo" />
                        <div className="Login__button-text">Github</div>
                    </button>
                </div>

                <div className="Login__divider-container">
                    <div className="Login__line"></div>
                    <span className='Login__text'>OR</span>
                    <div className="Login__line"></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="Login__email-container">
                        <input 
                            className='input Login__input-email' 
                            type="text" 
                            placeholder='Work email'
                            value={emailValue}
                            onChange={handleEmailChange}
                            autoComplete='email'
                        />
                        {!isEmailValid && submitAttempted && 
                            <div className="error-message">Invalid Email or Password</div>
                        }
                    </div>

                    {emailValue && (
                        <>  
                            <div className="password-container Login__password-container">
                                <input 
                                    type={passwordShown ? "text" : "password"} 
                                    className='input Login__input-password'
                                    placeholder='Password'
                                    value={passwordValue}
                                    onChange={handlePasswordChange}
                                    autoComplete='current-password'
                                />
                                <button
                                    type='button' 
                                    className="password-icon"
                                    onClick={handlePasswordShown}
                                ></button>

                                {!passwordValue.trim() && submitAttempted &&
                                    <div className="error-message">Password is required</div>
                                }
                            </div>
        
                            <Link to='/forgot-password' className='Login__reset'>Forgot your password?</Link>
                        </>
                    )}

                    
                    <button className='button Login__submit'>Log in to Qencode</button>

                </form>

                <span className='Login__new'>
                    Is your company new to Qencode? <a className='Login__signUp' href="#">Sign up</a>
                </span>
            </div>
        </div>
    );
}