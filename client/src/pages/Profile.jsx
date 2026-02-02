import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import FileUpload from '../components/ui/FileUpload';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState(null); // 'basic', 'religious', etc.
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

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
            // Initialize form data with structure
            setFormData({
                name: data.name,
                gender: data.gender,
                bio: data.bio || '',
                basicDetails: data.basicDetails || {},
                religious: data.religious || {},
                professional: data.professional || {},
                location: data.location || {}, // Note: might be string in old data
                family: data.family || {},
                astrological: data.astrological || {}
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (section, updatedData = null) => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = updatedData || formData;
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(dataToSend)
            });
            const data = await res.json();
            setUser(data);
            setEditingSection(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (section, field, value) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
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

    const handleNestedChange = (section, subSection, field, value) => {
        // handle habits, etc if needed. keeping simple for now.
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const SectionHeader = ({ title, sectionName }) => (
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {editingSection === sectionName ? (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingSection(null)}>Cancel</Button>
                    <Button size="sm" onClick={() => handleUpdate(sectionName)}>Save</Button>
                </div>
            ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditingSection(sectionName)}>Edit</Button>
            )}
        </div>
    );

    const DisplayRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="font-medium text-gray-900 text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header / Basic Identity */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                {formData.basicDetails?.photoUrl ? (
                                    <img src={formData.basicDetails.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-400 font-bold">{user.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FileUpload
                                    label=""
                                    onUpload={(url) => {
                                        const newBasicDetails = { ...formData.basicDetails, photoUrl: url };
                                        setFormData(prev => ({ ...prev, basicDetails: newBasicDetails }));
                                        handleUpdate('basicDetails', { ...formData, basicDetails: newBasicDetails });
                                    }}
                                    className="scale-75"
                                />
                            </div>
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                {user.subscriptionStatus && (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.subscriptionStatus === 'elite' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                        user.subscriptionStatus === 'premium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                            'bg-gray-100 text-gray-600 border border-gray-200'
                                        }`}>
                                        {user.subscriptionStatus} Member
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500">ID: {user._id?.slice(-6).toUpperCase()}</p>
                            <div className="mt-4">
                                {editingSection === 'bio' ? (
                                    <div className="space-y-3">
                                        <textarea
                                            className="w-full p-3 border rounded-xl"
                                            rows="3"
                                            value={formData.bio}
                                            onChange={(e) => handleChange('root', 'bio', e.target.value)}
                                            placeholder="Introduce yourself..."
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => setEditingSection(null)}>Cancel</Button>
                                            <Button size="sm" onClick={() => handleUpdate('bio')}>Save Bio</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative group cursor-pointer" onClick={() => setEditingSection('bio')}>
                                        <p className="text-gray-600 italic">"{user.bio || 'Add a bio to introduce yourself...'}"</p>
                                        <span className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-blue-500 text-xs">Edit</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Basic Details */}
                    <Card className="p-6">
                        <SectionHeader title="Basic Details" sectionName="basicDetails" />
                        {editingSection === 'basicDetails' ? (
                            <div className="grid grid-cols-1 gap-4">
                                <FileUpload
                                    label="Profile Photo"
                                    onUpload={(url) => handleChange('basicDetails', 'photoUrl', url)}
                                />
                                {formData.basicDetails?.photoUrl && <p className="text-xs text-green-600">Photo uploaded!</p>}

                                <Input label="Date of Birth" type="date" value={formData.basicDetails?.dob ? new Date(formData.basicDetails.dob).toISOString().split('T')[0] : ''} onChange={(e) => handleChange('basicDetails', 'dob', e.target.value)} />
                                <Select
                                    label="Marital Status"
                                    options={[{ value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' }, { value: 'Divorced', label: 'Divorced' }, { value: 'Widowed', label: 'Widowed' }]}
                                    value={formData.basicDetails?.maritalStatus || ''}
                                    onChange={(e) => handleChange('basicDetails', 'maritalStatus', e.target.value)}
                                />
                                <Select
                                    label="Physical Status"
                                    options={[{ value: 'Normal', label: 'Normal' }, { value: 'Physically Challenged', label: 'Physically Challenged' }]}
                                    value={formData.basicDetails?.physicalStatus || ''}
                                    onChange={(e) => handleChange('basicDetails', 'physicalStatus', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Height (cm)" type="number" value={formData.basicDetails?.height || ''} onChange={(e) => handleChange('basicDetails', 'height', e.target.value)} />
                                    <Input label="Weight (kg)" type="number" value={formData.basicDetails?.weight || ''} onChange={(e) => handleChange('basicDetails', 'weight', e.target.value)} />
                                </div>
                                <Select
                                    label="Body Type"
                                    options={[{ value: 'Slim', label: 'Slim' }, { value: 'Athletic', label: 'Athletic' }, { value: 'Average', label: 'Average' }, { value: 'Heavy', label: 'Heavy' }]}
                                    value={formData.basicDetails?.bodyType || ''}
                                    onChange={(e) => handleChange('basicDetails', 'bodyType', e.target.value)}
                                />
                                <Select
                                    label="Complexion"
                                    options={[{ value: 'Fair', label: 'Fair' }, { value: 'Very Fair', label: 'Very Fair' }, { value: 'Wheatish', label: 'Wheatish' }, { value: 'Dark', label: 'Dark' }]}
                                    value={formData.basicDetails?.complexion || ''}
                                    onChange={(e) => handleChange('basicDetails', 'complexion', e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <DisplayRow label="Date of Birth" value={user.basicDetails?.dob ? new Date(user.basicDetails.dob).toLocaleDateString() : ''} />
                                <DisplayRow label="Marital Status" value={user.basicDetails?.maritalStatus} />
                                <DisplayRow label="Physical Status" value={user.basicDetails?.physicalStatus} />
                                <DisplayRow label="Height" value={user.basicDetails?.height ? `${user.basicDetails.height} cm` : ''} />
                                <DisplayRow label="Weight" value={user.basicDetails?.weight ? `${user.basicDetails.weight} kg` : ''} />
                                <DisplayRow label="Body Type" value={user.basicDetails?.bodyType} />
                                <DisplayRow label="Complexion" value={user.basicDetails?.complexion} />
                            </div>
                        )}
                    </Card>

                    {/* Religious Details */}
                    <Card className="p-6">
                        <SectionHeader title="Religious Details" sectionName="religious" />
                        {editingSection === 'religious' ? (
                            <div className="grid grid-cols-1 gap-4">
                                <Input label="Religion" value={formData.religious?.religion || ''} onChange={(e) => handleChange('religious', 'religion', e.target.value)} />
                                <Input label="Caste" value={formData.religious?.caste || ''} onChange={(e) => handleChange('religious', 'caste', e.target.value)} />
                                <Input label="Sub Caste" value={formData.religious?.subCaste || ''} onChange={(e) => handleChange('religious', 'subCaste', e.target.value)} />
                                <Input label="Gothiram" value={formData.religious?.gothiram || ''} onChange={(e) => handleChange('religious', 'gothiram', e.target.value)} />
                                <Input label="Kulam" value={formData.religious?.kulam || ''} onChange={(e) => handleChange('religious', 'kulam', e.target.value)} />
                                <Input label="Kulladheivam" value={formData.religious?.kulladheivam || ''} onChange={(e) => handleChange('religious', 'kulladheivam', e.target.value)} />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <DisplayRow label="Religion" value={user.religious?.religion} />
                                <DisplayRow label="Caste" value={user.religious?.caste} />
                                <DisplayRow label="Sub Caste" value={user.religious?.subCaste} />
                                <DisplayRow label="Gothiram" value={user.religious?.gothiram} />
                                <DisplayRow label="Kulam" value={user.religious?.kulam} />
                                <DisplayRow label="Kulladheivam" value={user.religious?.kulladheivam} />
                            </div>
                        )}
                    </Card>

                    {/* Professional Details */}
                    <Card className="p-6">
                        <SectionHeader title="Professional Details" sectionName="professional" />
                        {editingSection === 'professional' ? (
                            <div className="grid grid-cols-1 gap-4">
                                <Input label="Education" value={formData.professional?.education || ''} onChange={(e) => handleChange('professional', 'education', e.target.value)} />
                                <Input label="Education Details" value={formData.professional?.educationDetails || ''} onChange={(e) => handleChange('professional', 'educationDetails', e.target.value)} />
                                <Input label="Occupation" value={formData.professional?.occupation || ''} onChange={(e) => handleChange('professional', 'occupation', e.target.value)} />
                                <Input label="Occupation Details" value={formData.professional?.occupationDetails || ''} onChange={(e) => handleChange('professional', 'occupationDetails', e.target.value)} />
                                <Select
                                    label="Employed In"
                                    options={[{ value: 'Private', label: 'Private' }, { value: 'Government', label: 'Government' }, { value: 'Business', label: 'Business' }, { value: 'Self Employed', label: 'Self Employed' }]}
                                    value={formData.professional?.employedIn || ''}
                                    onChange={(e) => handleChange('professional', 'employedIn', e.target.value)}
                                />
                                <Input label="Annual Income" value={formData.professional?.annualIncome || ''} onChange={(e) => handleChange('professional', 'annualIncome', e.target.value)} />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <DisplayRow label="Education" value={user.professional?.education} />
                                <DisplayRow label="Edu. Details" value={user.professional?.educationDetails} />
                                <DisplayRow label="Occupation" value={user.professional?.occupation} />
                                <DisplayRow label="Occ. Details" value={user.professional?.occupationDetails} />
                                <DisplayRow label="Employed In" value={user.professional?.employedIn} />
                                <DisplayRow label="Annual Income" value={user.professional?.annualIncome} />
                            </div>
                        )}
                    </Card>

                    {/* Location Details */}
                    <Card className="p-6">
                        <SectionHeader title="Location Details" sectionName="location" />
                        {editingSection === 'location' ? (
                            <div className="grid grid-cols-1 gap-4">
                                <Input label="Country" value={formData.location?.country || ''} onChange={(e) => handleChange('location', 'country', e.target.value)} />
                                <Input label="State" value={formData.location?.state || ''} onChange={(e) => handleChange('location', 'state', e.target.value)} />
                                <Input label="City" value={formData.location?.city || ''} onChange={(e) => handleChange('location', 'city', e.target.value)} />
                                <Input label="Citizenship" value={formData.location?.citizenship || ''} onChange={(e) => handleChange('location', 'citizenship', e.target.value)} />
                                <Input label="Residing State" value={formData.location?.residingState || ''} onChange={(e) => handleChange('location', 'residingState', e.target.value)} />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <DisplayRow label="Country" value={user.location?.country} />
                                <DisplayRow label="State" value={user.location?.state} />
                                <DisplayRow label="City" value={user.location?.city} />
                                <DisplayRow label="Citizenship" value={user.location?.citizenship} />
                                <DisplayRow label="Residing State" value={user.location?.residingState} />
                            </div>
                        )}
                    </Card>

                    {/* Family Details */}
                    <Card className="p-6">
                        <SectionHeader title="Family Details" sectionName="family" />
                        {editingSection === 'family' ? (
                            <div className="grid grid-cols-1 gap-4">
                                <Input label="Father's Name" value={formData.family?.fatherName || ''} onChange={(e) => handleChange('family', 'fatherName', e.target.value)} />
                                <Input label="Father's Occupation" value={formData.family?.fatherOccupation || ''} onChange={(e) => handleChange('family', 'fatherOccupation', e.target.value)} />
                                <Input label="Mother's Name" value={formData.family?.motherName || ''} onChange={(e) => handleChange('family', 'motherName', e.target.value)} />
                                <Input label="Mother's Occupation" value={formData.family?.motherOccupation || ''} onChange={(e) => handleChange('family', 'motherOccupation', e.target.value)} />
                                <Input label="Siblings" value={formData.family?.siblings || ''} onChange={(e) => handleChange('family', 'siblings', e.target.value)} />
                                <Select
                                    label="Family Status"
                                    options={[{ value: 'Middle Class', label: 'Middle Class' }, { value: 'Upper Middle Class', label: 'Upper Middle Class' }, { value: 'Rich', label: 'Rich' }, { value: 'Affluent', label: 'Affluent' }]}
                                    value={formData.family?.familyStatus || ''}
                                    onChange={(e) => handleChange('family', 'familyStatus', e.target.value)}
                                />
                                <Select
                                    label="Family Type"
                                    options={[{ value: 'Joint', label: 'Joint' }, { value: 'Nuclear', label: 'Nuclear' }]}
                                    value={formData.family?.familyType || ''}
                                    onChange={(e) => handleChange('family', 'familyType', e.target.value)}
                                />
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About Family</label>
                                    <textarea className="w-full px-4 py-2 rounded-xl border" rows="2" value={formData.family?.aboutFamily || ''} onChange={(e) => handleChange('family', 'aboutFamily', e.target.value)}></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <DisplayRow label="Father" value={`${user.family?.fatherName || ''} ${user.family?.fatherOccupation ? `(${user.family.fatherOccupation})` : ''}`} />
                                <DisplayRow label="Mother" value={`${user.family?.motherName || ''} ${user.family?.motherOccupation ? `(${user.family.motherOccupation})` : ''}`} />
                                <DisplayRow label="Siblings" value={user.family?.siblings} />
                                <DisplayRow label="Status" value={user.family?.familyStatus} />
                                <DisplayRow label="Type" value={user.family?.familyType} />
                                <DisplayRow label="About Family" value={user.family?.aboutFamily} />
                            </div>
                        )}
                    </Card>

                    {/* Astrological Details */}
                    <Card className="p-6">
                        <SectionHeader title="Astrological Details" sectionName="astrological" />
                        {editingSection === 'astrological' ? (
                            <div className="grid grid-cols-1 gap-4">
                                <Input label="Rassi" value={formData.astrological?.rassi || ''} onChange={(e) => handleChange('astrological', 'rassi', e.target.value)} />
                                <Input label="Natchathiram" value={formData.astrological?.natchathiram || ''} onChange={(e) => handleChange('astrological', 'natchathiram', e.target.value)} />
                                <Select
                                    label="Dosham"
                                    options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }, { value: 'Don\'t Know', label: 'Don\'t Know' }]}
                                    value={formData.astrological?.dosham || ''}
                                    onChange={(e) => handleChange('astrological', 'dosham', e.target.value)}
                                />
                                <FileUpload
                                    label="Upload Jathagam (Photo/PDF)"
                                    onUpload={(url) => handleChange('astrological', 'jathagamUrl', url)}
                                    className="mt-2"
                                />
                                {formData.astrological?.jathagamUrl && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Jathagam ready to save!
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <DisplayRow label="Rassi" value={user.astrological?.rassi} />
                                <DisplayRow label="Natchathiram" value={user.astrological?.natchathiram} />
                                <DisplayRow label="Dosham" value={user.astrological?.dosham} />
                                <DisplayRow label="Jathagam" value={user.astrological?.jathagamUrl ? (
                                    <a href={user.astrological.jathagamUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                                        View Jathagam
                                    </a>
                                ) : 'Not Uploaded'} />
                            </div>
                        )}
                    </Card>

                </div>

                <div className="flex justify-center pt-8">
                    <Button variant="secondary" onClick={() => navigate('/onboarding')}>
                        Retake Compatibility Quiz
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
