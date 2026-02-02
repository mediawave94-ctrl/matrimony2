import React from 'react';

const Card = ({ children, className = '', title, badge, ...props }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
            {...props}
        >
            {title && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    {badge}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
