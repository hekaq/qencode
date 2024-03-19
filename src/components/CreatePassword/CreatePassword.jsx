import { useState } from 'react';
import './CreatePassword.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const CreatePassword = () => {
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const secret = searchParams.get('secret');

    const validatePassword = (password) => {
        const hasMinimumLength = password.length >= 8;
        const containsNoSpaces = !/\s/.test(password);
        setIsPasswordValid(hasMinimumLength && containsNoSpaces);
        console.log(isPasswordValid);
    }

    const validateConfirmPassword = (confirmPassword) => {
        setIsConfirmPasswordValid(confirmPassword === passwordValue);
    }

    const handlePassword = (event) => {
        const newPassword = event.target.value;
        setPasswordValue(newPassword);
        validatePassword(newPassword);
    }

    const handleConfirmPassword = (event) => {
        const newConfirmPassword = event.target.value;
        setConfirmPasswordValue(newConfirmPassword);
        validateConfirmPassword(newConfirmPassword);
    }

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    }

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordShown(!confirmPasswordShown);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);

        if (!isPasswordValid || !isConfirmPasswordValid) {
            return;
        }
    
        try {
            const response = await fetch('https://auth-qa.qencode.com/v1/auth/password-set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    secret: secret,
                    password: passwordValue,
                    password_confirm: confirmPasswordValue,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok && data.error === 0) {
                alert('Password reset successfully.');
                navigate('/');
            } else {
                alert(`Error: ${data.detail.join(', ')}`);
            }
        } catch (error) {
            console.error('Password reset failed:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    return (
        <div className="CreatePassword">
            <div className="container">
                <img 
                    src="../src/assets/icons/logo.svg" 
                    alt="Qencode logo" 
                    className="CreatePassword__logo"
                />

                <div className='mainHeader CreatePassword__header'>Create new Password?</div>

                <form onSubmit={handleSubmit}>
                    <label className='CreatePassword__label' htmlFor="password">Password</label>
                    <div className="password-container CreatePassword__password-container">
                        <input 
                            type={passwordShown ? "text" : "password"} 
                            id='password' 
                            placeholder='Password'
                            className='input CreatePassword__input'
                            value={passwordValue}
                            onChange={handlePassword}
                        />
                        {!isPasswordValid && submitAttempted && (
                            <div className='error-message'>Password must be at least 8 characters long</div>
                        )}
                        <button 
                            type='button' 
                            className='password-icon' 
                            onClick={togglePasswordVisibility}
                        ></button>
                    </div>

                    <label className='CreatePassword__label' htmlFor="confirm-password">Confirm Password</label>
                    <div className="password-container CreatePassword__confirmPassword-container">
                        <input 
                            type={confirmPasswordShown ? "text" : "password"} 
                            id='confirm-password' 
                            placeholder='Password'
                            className='input CreatePassword__input-confirm'
                            value={confirmPasswordValue}
                            onChange={handleConfirmPassword}
                        />

                        {!isConfirmPasswordValid && submitAttempted && (
                            <div className='error-message'>Passwords do not match</div>
                        )}
                        <button 
                            type='button' 
                            className='password-icon' 
                            onClick={toggleConfirmPasswordVisibility}
                        ></button>
                    </div>

                    <button className='button'>Reset Password</button>
                </form>
            </div>
        </div>
    );
}