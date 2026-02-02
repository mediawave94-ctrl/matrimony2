import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { questions } from '../data/questionnaire';

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const currentQuestion = questions[currentStep];

    const handleOptionSelect = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitProfile();
        }
    };

    const handleSkip = () => {
        // Skip current question (don't save answer)
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitProfile();
        }
    };

    const submitProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Should be logged in to reach here
                return;
            }

            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ personality: answers })
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                console.error("Failed to update profile");
                // Navigate anyway? or show error?
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (!currentQuestion) return null;

    const progress = ((currentStep) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span>Question {currentStep + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                </div>

                <Card>
                    <div className="py-2">
                        <div className="mb-2">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-blue-50 px-2 py-1 rounded">
                                {currentQuestion.category}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {currentQuestion.text}
                        </h2>

                        {/* "Why we ask" Context */}
                        <div className="mb-8 p-3 bg-gray-50 rounded-lg text-sm text-gray-500 italic border-l-4 border-gray-200">
                            <strong>Why we ask:</strong> This helps us understand your compatibility style better. {currentQuestion.category === 'Conflict Handling' ? 'How you handle disagreements is crucial for long-term peace.' : 'Shared values build stronger foundations.'}
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${answers[currentQuestion.id] === option.value
                                        ? 'border-primary bg-blue-50/50 ring-1 ring-primary'
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="font-medium text-gray-900 block mb-1">
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                Skip Question
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={!answers[currentQuestion.id] && false} // Can proceed even if not answered (effectively skip)
                            >
                                {currentStep === questions.length - 1 ? (loading ? 'Saving...' : 'Finish & View Matches') : 'Next Question'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;
