import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-lg hover:shadow-xl",
        secondary: "bg-secondary text-white hover:bg-yellow-600 focus:ring-secondary shadow-md",
        outline: "border-2 border-primary text-primary hover:bg-blue-50 focus:ring-primary",
        ghost: "text-gray-600 hover:bg-gray-100",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
