import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import FileUpload from '../components/ui/FileUpload';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({});
    const [showAllDetails, setShowAllDetails] = useState(false);
    const navigate = useNavigate();

    // -- Options --
    const MARITAL_STATUS_OPTIONS = [
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
        { value: 'Divorced', label: 'Divorced' },
        { value: 'Widowed', label: 'Widowed' },
        { value: 'Awaiting Divorce', label: 'Awaiting Divorce' },
    ];

    const RELIGION_OPTIONS = [
        { value: 'Hindu', label: 'Hindu' },
        { value: 'Christian', label: 'Christian' },
        { value: 'Muslim', label: 'Muslim' },
        { value: 'Sikh', label: 'Sikh' },
        { value: 'Jain', label: 'Jain' },
    ];

    const FAMILY_TYPE_OPTIONS = [
        { value: 'Joint', label: 'Joint' },
        { value: 'Nuclear', label: 'Nuclear' },
    ];

    const FAMILY_STATUS_OPTIONS = [
        { value: 'Middle Class', label: 'Middle Class' },
        { value: 'Upper Middle Class', label: 'Upper Middle Class' },
        { value: 'Rich', label: 'Rich' },
        { value: 'Affluent', label: 'Affluent' },
    ];

    const EMPLOYED_IN_OPTIONS = [
        { value: 'Private', label: 'Private' },
        { value: 'Government', label: 'Government' },
        { value: 'Business', label: 'Business' },
        { value: 'Self Employed', label: 'Self Employed' },
    ];

    const HABIT_OPTIONS = [
        { value: 'No', label: 'No' },
        { value: 'Occasionally', label: 'Occasionally' },
        { value: 'Regularly', label: 'Regularly' },
    ];

    const EATING_OPTIONS = [
        { value: 'Vegetarian', label: 'Vegetarian' },
        { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
        { value: 'Eggetarian', label: 'Eggetarian' },
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            const res = await fetch('/api/users/profile', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setUser(data);
            setFormData({
                name: data.name,
                gender: data.gender,
                bio: data.bio || '',
                basicDetails: data.basicDetails || { habits: {} },
                religious: data.religious || {},
                professional: data.professional || {},
                location: data.location || {},
                family: data.family || {},
                astrological: data.astrological || {}
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (section, dataToUpdate = null) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(dataToUpdate || formData)
            });
            const data = await res.json();
            setUser(data);
            setEditingSection(null);
            if (dataToUpdate) {
                setFormData(dataToUpdate);
                toast.success('Photo updated successfully!', { icon: '📸' });
            } else {
                toast.success('Section updated!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update profile');
        }
    };

    const handleChange = (section, field, value) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else if (section === 'habits') {
            setFormData(prev => ({
                ...prev,
                basicDetails: {
                    ...prev.basicDetails,
                    habits: {
                        ...prev.basicDetails.habits,
                        [field]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const calculateDaysLeft = (expiryDate) => {
        if (!expiryDate) return 0;
        const diff = new Date(expiryDate) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#F46F4C]"></div>
        </div>
    );

    const daysLeft = calculateDaysLeft(user.subscriptionExpiresAt);
    const membershipType = user.subscriptionStatus === 'free' ? 'Basic' : 
                         user.subscriptionStatus === 'premium' ? 'Premium' : 'Royal';

    const SectionHeader = ({ title, sectionId }) => (
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
            {editingSection !== sectionId && (
                <button 
                    onClick={() => setEditingSection(sectionId)}
                    className="text-[10px] font-black text-[#F46F4C] hover:text-[#e05e3b] transition-colors uppercase tracking-widest border border-[#F46F4C]/20 px-3 py-1.5 rounded-lg"
                >
                    Edit
                </button>
            )}
        </div>
    );

    const DisplayRow = ({ label, value }) => (
        <div className="flex flex-col py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            <span className="font-bold text-gray-800 text-xs mt-0.5">{value || 'Not Specified'}</span>
        </div>
    );

    const renderSummary = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Profile Views', count: 0, color: 'blue', icon: '👁️' },
                    { label: 'Interests', count: 0, color: 'rose', icon: '💞' },
                    { label: 'Shortlists', count: 0, color: 'emerald', icon: '📌' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner bg-gray-50">
                                {stat.icon}
                            </div>
                            <div className="text-gray-300 font-black text-[8px] uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-full">Active</div>
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 mb-0.5">{stat.count}</h4>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
                <SectionHeader title="Basic Details" sectionId="basicDetails" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-6">
                    <DisplayRow label="Date of Birth" value={user.basicDetails?.dob ? new Date(user.basicDetails.dob).toLocaleDateString() : ''} />
                    <DisplayRow label="Marital Status" value={user.basicDetails?.maritalStatus} />
                    <DisplayRow label="Height" value={user.basicDetails?.height ? `${user.basicDetails.height} cm` : ''} />
                    <DisplayRow label="Complexion" value={user.basicDetails?.complexion} />
                    <DisplayRow label="Weight" value={user.basicDetails?.weight ? `${user.basicDetails.weight} kg` : ''} />
                    <DisplayRow label="Body Type" value={user.basicDetails?.bodyType} />
                </div>

                <div className="mt-8">
                    <SectionHeader title="Religious Details" sectionId="religious" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DisplayRow label="Religion" value={user.religious?.religion} />
                        <DisplayRow label="Caste" value={user.religious?.caste} />
                        <DisplayRow label="Sub Caste" value={user.religious?.subCaste} />
                        <DisplayRow label="Gothiram" value={user.religious?.gothiram} />
                    </div>
                </div>

                <div className="mt-8">
                    <SectionHeader title="Professional Details" sectionId="professional" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DisplayRow label="Education" value={user.professional?.education} />
                        <DisplayRow label="Employed In" value={user.professional?.employedIn} />
                        <DisplayRow label="Occupation" value={user.professional?.occupation} />
                        <DisplayRow label="Annual Income" value={user.professional?.annualIncome} />
                    </div>
                </div>

                <div className="mt-8">
                    <SectionHeader title="Location Details" sectionId="location" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DisplayRow label="Country" value={user.location?.country} />
                        <DisplayRow label="State" value={user.location?.state} />
                        <DisplayRow label="City" value={user.location?.city} />
                        <DisplayRow label="Citizenship" value={user.location?.citizenship} />
                    </div>
                </div>

                {!showAllDetails ? (
                    <div className="mt-8 flex justify-center">
                        <button 
                            onClick={() => setShowAllDetails(true)}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#F46F4C] transition-all duration-300 shadow-lg shadow-gray-100"
                        >
                            View Complete DNA
                        </button>
                    </div>
                ) : (
                    <div className="animate-slideDown">
                        <div className="mt-8">
                            <SectionHeader title="Family Details" sectionId="family" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <DisplayRow label="Father's Name" value={user.family?.fatherName} />
                                <DisplayRow label="Father's Occ." value={user.family?.fatherOccupation} />
                                <DisplayRow label="Mother's Name" value={user.family?.motherName} />
                                <DisplayRow label="Mother's Occ." value={user.family?.motherOccupation} />
                                <DisplayRow label="Siblings" value={user.family?.siblings} />
                                <DisplayRow label="Family Origin" value={user.family?.familyOrigin} />
                                <DisplayRow label="Family Type" value={user.family?.familyType} />
                                <DisplayRow label="Family Status" value={user.family?.familyStatus} />
                                <DisplayRow label="Family Values" value={user.family?.familyValues} />
                            </div>
                        </div>

                        <div className="mt-8">
                            <SectionHeader title="Lifestyle Habits" sectionId="habits" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <DisplayRow label="Drinking" value={user.basicDetails?.habits?.drinking} />
                                <DisplayRow label="Smoking" value={user.basicDetails?.habits?.smoking} />
                                <DisplayRow label="Eating" value={user.basicDetails?.habits?.eating} />
                            </div>
                        </div>

                        <div className="mt-8">
                            <SectionHeader title="Astrological Details" sectionId="astrological" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <DisplayRow label="Rassi" value={user.astrological?.rassi} />
                                <DisplayRow label="Natchathiram" value={user.astrological?.natchathiram} />
                                <DisplayRow label="Dosham" value={user.astrological?.dosham} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button 
                                onClick={() => setShowAllDetails(false)}
                                className="text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                            >
                                Collapse View
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderFormSection = (title, sectionId, fields) => (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
                   <p className="text-gray-400 font-bold mt-1 text-xs">Update your {title.toLowerCase()}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => setEditingSection(null)} className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                    <button onClick={() => handleUpdate(sectionId)} className="flex-1 md:flex-none px-6 py-2.5 bg-[#F46F4C] text-white text-xs font-black rounded-xl shadow-lg shadow-orange-100 active:translate-y-0 transition-all">Save Changes</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((f) => (
                    <div key={f.name} className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{f.label}</label>
                        {f.type === 'select' ? (
                            <select 
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-1 focus:ring-[#F46F4C] font-bold text-gray-800 text-sm transition-all appearance-none"
                                value={f.section === 'habits' ? (formData.basicDetails?.habits?.[f.name] || '') : (formData[f.section || sectionId]?.[f.name] || '')}
                                onChange={(e) => handleChange(f.section || sectionId, f.name, e.target.value)}
                            >
                                <option value="">Select {f.label}</option>
                                {f.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type={f.type || 'text'}
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-1 focus:ring-[#F46F4C] font-bold text-gray-800 text-sm transition-all"
                                value={f.name === 'dob' ? (formData[sectionId]?.[f.name]?.split('T')[0] || '') : (formData[f.section || sectionId]?.[f.name] || '')}
                                onChange={(e) => handleChange(f.section || sectionId, f.name, e.target.value)}
                                placeholder={f.label}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-[#FDFCFB] flex min-h-[calc(100vh-80px)]">
            {/* ================= SIDEBAR ================= */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-20 h-[calc(100vh-80px)] overflow-y-auto shrink-0">
                <div className="p-6 text-center border-b border-gray-50">
                    <div className="relative inline-block group mb-4">
                        <div className="w-32 h-32 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl mx-auto bg-gray-50">
                            {user.basicDetails?.photoUrl ? (
                                <img src={user.basicDetails.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#F46F4C]/10 flex items-center justify-center text-[#F46F4C] text-4xl font-black">
                                    {user.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center cursor-pointer">
                            <FileUpload
                                label=""
                                onUpload={(url) => {
                                    const updatedData = { 
                                        ...formData, 
                                        basicDetails: { 
                                            ...formData.basicDetails, 
                                            photoUrl: url 
                                        } 
                                    };
                                    handleUpdate('basicDetails', updatedData);
                                }}
                                className="scale-50 invert grayscale"
                            />
                        </div>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight mb-0.5 capitalize">{user.name}</h2>
                    <p className="text-[9px] font-black text-[#F46F4C] uppercase tracking-[0.2em]">ID: {user._id?.slice(-6).toUpperCase()}</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                  {[
                    { id: 'view', label: 'Dashboard', icon: '📊', active: !editingSection },
                    { id: 'basicDetails', label: 'Basic Info', icon: '👤', active: editingSection === 'basicDetails' },
                    { id: 'religious', label: 'Religious', icon: '🕍', active: editingSection === 'religious' },
                    { id: 'professional', label: 'Career', icon: '💼', active: editingSection === 'professional' },
                    { id: 'location', label: 'Location', icon: '📍', active: editingSection === 'location' },
                    { id: 'family', label: 'Family', icon: '👨‍👩‍👧', active: editingSection === 'family' },
                    { id: 'habits', label: 'Habits', icon: '🍷', active: editingSection === 'habits' },
                    { id: 'astrological', label: 'Astrology', icon: '✨', active: editingSection === 'astrological' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => item.id === 'view' ? setEditingSection(null) : setEditingSection(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 font-bold text-xs ${
                        item.active 
                        ? 'bg-[#FFF5F0] text-[#F46F4C] shadow-sm' 
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 p-8 pb-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Membership Card */}
                    <div className="bg-gradient-to-br from-[#F46F4C] to-[#FF9068] p-10 rounded-[2.5rem] shadow-xl shadow-orange-100 relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🛡️</span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Membership Grade</span>
                                </div>
                                <h3 className="text-4xl font-black tracking-tight">{membershipType} Tier</h3>
                                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-4">Ends on {user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/20 text-center min-w-[120px]">
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">Credits</p>
                                    <p className="text-3xl font-black">0</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/20 text-center min-w-[120px]">
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">Days Left</p>
                                    <p className="text-3xl font-black">{daysLeft}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!editingSection ? renderSummary() : (
                        <div className="space-y-6 animate-fadeIn">
                            {editingSection === 'basicDetails' && renderFormSection('Basic Details', 'basicDetails', [
                                { name: 'dob', label: 'Date of Birth', type: 'date' },
                                { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: MARITAL_STATUS_OPTIONS },
                                { name: 'height', label: 'Height (cm)', type: 'number' },
                                { name: 'weight', label: 'Weight (kg)', type: 'number' },
                                { name: 'bodyType', label: 'Body Type', type: 'select', options: [{value:'Slim', label:'Slim'}, {value:'Athletic', label:'Athletic'}, {value:'Average', label:'Average'}, {value:'Heavy', label:'Heavy'}] },
                                { name: 'complexion', label: 'Complexion', type: 'select', options: [{value:'Fair', label:'Fair'}, {value:'Very Fair', label:'Very Fair'}, {value:'Wheatish', label:'Wheatish'}, {value:'Dark', label:'Dark'}] }
                            ])}
                            
                            {editingSection === 'religious' && renderFormSection('Religious Details', 'religious', [
                                { name: 'religion', label: 'Religion' },
                                { name: 'caste', label: 'Caste' },
                                { name: 'subCaste', label: 'Sub-Caste' },
                                { name: 'gothiram', label: 'Gothiram' },
                                { name: 'kulam', label: 'Kulam' },
                                { name: 'kulladheivam', label: 'Kulla Dheivam' }
                            ])}

                            {editingSection === 'professional' && renderFormSection('Professional Details', 'professional', [
                                { name: 'education', label: 'Education' },
                                { name: 'employedIn', label: 'Employed In', type: 'select', options: EMPLOYED_IN_OPTIONS },
                                { name: 'occupation', label: 'Occupation' },
                                { name: 'annualIncome', label: 'Annual Income' }
                            ])}

                            {editingSection === 'location' && renderFormSection('Location Details', 'location', [
                                { name: 'country', label: 'Country' },
                                { name: 'state', label: 'State' },
                                { name: 'city', label: 'City' },
                                { name: 'citizenship', label: 'Citizenship' }
                            ])}

                            {editingSection === 'family' && renderFormSection('Family Details', 'family', [
                                { name: 'fatherName', label: "Father's Name" },
                                { name: 'fatherOccupation', label: "Father's Occupation" },
                                { name: 'motherName', label: "Mother's Name" },
                                { name: 'motherOccupation', label: "Mother's Occupation" },
                                { name: 'siblings', label: 'Siblings' },
                                { name: 'familyOrigin', label: 'Family Origin' },
                                { name: 'familyType', label: 'Family Type', type: 'select', options: FAMILY_TYPE_OPTIONS },
                                { name: 'familyStatus', label: 'Family Status', type: 'select', options: FAMILY_STATUS_OPTIONS },
                                { name: 'familyValues', label: 'Family Values', type: 'select', options: [{value:'Orthodox', label:'Orthodox'}, {value:'Traditional', label:'Traditional'}, {value:'Moderate', label:'Moderate'}, {value:'Liberal', label:'Liberal'}] }
                            ])}

                            {editingSection === 'habits' && renderFormSection('Lifestyle Habits', 'habits', [
                                { name: 'drinking', label: 'Drinking Hab.', type: 'select', options: HABIT_OPTIONS, section: 'habits' },
                                { name: 'smoking', label: 'Smoking Hab.', type: 'select', options: HABIT_OPTIONS, section: 'habits' },
                                { name: 'eating', label: 'Eating Hab.', type: 'select', options: EATING_OPTIONS, section: 'habits' }
                            ])}

                            {editingSection === 'astrological' && renderFormSection('Astrological Details', 'astrological', [
                                { name: 'rassi', label: 'Rassi' },
                                { name: 'nutchathiram', label: 'Natchathiram' },
                                { name: 'dosham', label: 'Dosham', type: 'select', options: [{value:'No', label:'No'}, {value:'Yes', label:'Yes'}] }
                            ])}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
