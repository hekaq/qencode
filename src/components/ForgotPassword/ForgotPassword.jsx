import { useState } from 'react';
import './ForgotPassword.css'
import { Link, useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
    const [emailValue, setEmailValue] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleEmailChange = (event) => {
        const email = event.target.value;
        setEmailValue(email);
        setIsEmailValid(validateEmail(email));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);

        if (!isEmailValid) {
            return;
        }

        const apiUrl = 'https://auth-qa.qencode.com/v1/auth/password-reset';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailValue,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok && data.error === 0) {
                navigate('/create-password');
            } else {
                console.error('Password reset error:', data.detail || 'Unknown error');
            }
        } catch (error) {
            console.error('Password reset failed:', error);
        }
    }

    return (
        <div className="ForgotPassword">
            <div className="container">
                <img 
                    src="../src/assets/icons/logo.svg"
                    alt="Qencode logo"
                    className="ForgotPassword__logo"
                />

                <div className='mainHeader ForgotPassword__header'>Forgot Password?</div>

                <form onSubmit={handleSubmit}>
                    <div className='ForgotPassword__email-container'>
                        <input 
                            type="text" 
                            placeholder='Enter your email' 
                            className='input ForgotPassword__input'
                            value={emailValue}
                            onChange={handleEmailChange}
                        />

                        {!isEmailValid && submitAttempted && 
                            <div className="error-message">Invalid Email</div>
                        }
                    </div>

                    <button className='button ForgotPassword__submit'>Send</button>
                </form>
                <Link to='/' type='button' className='button ForgotPassword__cancel'>Cancel</Link>
            </div>
        </div>
    );
}