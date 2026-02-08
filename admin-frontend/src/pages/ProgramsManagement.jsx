
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import categoryService from '../services/category.service';
import settingsService from '../services/settings.service';
import certificateTemplateService from '../services/certificateTemplate.service';
import { Plus, Edit, Trash2, BookOpen, Settings, FileText, Calendar, Check, Save, ArrowLeft, Image as ImageIcon, ChevronDown, ChevronUp, Upload } from 'lucide-react';

const ProgramsManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('programs');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // View State: 'list', 'create', 'edit'
    const [view, setView] = useState('list');
    const [editingId, setEditingId] = useState(null);

    // Form State for Create/Edit
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        imageUrl: '',
        tagline: '',
        description: '',
        durationWeeks: 12,
        level: 'INTERMEDIATE', // Beginner, Intermediate, Advanced
        skills: '',
        tools: '',
        maxSeats: 100,
        autoStart: true,
        allowReEnrollment: false,
        priority: 'NORMAL',
        autoCertificate: true,
        loiPercentage: 80,
        internalNotes: ''
    });

    const [advancedOpen, setAdvancedOpen] = useState(true);

    // Settings State
    const [settings, setSettings] = useState({
        autoStart: true,
        startDay: 'MONDAY',
        frequency: 'WEEKLY'
    });

    // Offer Letter State
    const [offerLetter, setOfferLetter] = useState({
        subject: '',
        body: ''
    });
    const [offerLetterTemplate, setOfferLetterTemplate] = useState({ key: '', url: '' });
    const [offerLetterTemplateFile, setOfferLetterTemplateFile] = useState(null);
    const [offerLetterTemplateUploading, setOfferLetterTemplateUploading] = useState(false);

    const [certificateTemplate, setCertificateTemplate] = useState({ key: '', url: '' });
    const [certificateTemplateFile, setCertificateTemplateFile] = useState(null);
    const [certificateTemplateUploading, setCertificateTemplateUploading] = useState(false);

    const [lorTemplate, setLorTemplate] = useState({ key: '', url: '' });
    const [lorTemplateFile, setLorTemplateFile] = useState(null);
    const [lorTemplateUploading, setLorTemplateUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([loadCategories(), loadSettings()]);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        const data = await categoryService.getActiveCategories();
        setCategories(data);
    };

    const loadSettings = async () => {
        try {
            const config = await settingsService.getConfig();
            setSettings({
                autoStart: config.autoStartBatches,
                startDay: config.startDay,
                frequency: config.frequency
            });
            setOfferLetter({
                subject: config.offerLetterSubject,
                body: config.offerLetterBody
            });
            try {
                const tpl = await settingsService.getOfferLetterTemplate();
                setOfferLetterTemplate({ key: tpl.key || '', url: tpl.url || '' });
            } catch (e) {
                setOfferLetterTemplate({ key: '', url: '' });
            }

            try {
                const ct = await certificateTemplateService.getInternshipCertificateTemplate();
                setCertificateTemplate({ key: ct.key || '', url: ct.url || '' });
            } catch (e) {
                setCertificateTemplate({ key: '', url: '' });
            }

            try {
                const lt = await certificateTemplateService.getLorTemplate();
                setLorTemplate({ key: lt.key || '', url: lt.url || '' });
            } catch (e) {
                setLorTemplate({ key: '', url: '' });
            }
        } catch (error) {
            console.error("Failed to load settings", error);
        }
    };

    const handleCreateClick = () => {
        setFormData({
            title: '',
            slug: '',
            coverImage: '',
            tagline: '',
            description: '',
            durationWeeks: 12,
            level: 'INTERMEDIATE',
            skills: '',
            tools: '',
            maxSeats: 100,
            autoStart: true,
            allowReEnrollment: false,
            priority: 'NORMAL',
            autoCertificate: true,
            loiPercentage: 80,
            internalNotes: ''
        });
        setPreview(null);
        setView('create');
    };

    const handleEditClick = (e, category) => {
        e.stopPropagation();
        setFormData({
            title: category.title,
            slug: category.slug || '',
            coverImage: category.coverImage || '',
            tagline: category.tagline || '',
            description: category.description || '',
            durationWeeks: category.durationWeeks || 12,
            level: category.level || 'INTERMEDIATE',
            skills: category.skills || '',
            tools: category.tools || '',
            maxSeats: category.maxSeats || 100,
            autoStart: category.autoStart !== undefined ? category.autoStart : true,
            allowReEnrollment: category.allowReEnrollment || false,
            priority: category.priority || 'NORMAL',
            autoCertificate: category.autoCertificate !== undefined ? category.autoCertificate : true,
            loiPercentage: category.loiPercentage || 80,
            internalNotes: category.internalNotes || ''
        });
        setEditingId(category.id);
        setPreview(category.coverImage); // Use existing image as preview initially
        setView('edit');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            if (view === 'edit') {
                await categoryService.updateCategory(editingId, formData);
                alert('Internship updated successfully!');
            } else {
                await categoryService.createCategory(formData);
                alert('Internship created successfully!');
            }
            setView('list');
            loadCategories();
        } catch (error) {
            console.error('Save Error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save internship';
            alert(`Error: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (e, id, title) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await categoryService.deleteCategory(id);
                loadCategories();
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    const saveSettings = async () => {
        try {
            await settingsService.updateConfig({
                autoStartBatches: settings.autoStart,
                startDay: settings.startDay,
                frequency: settings.frequency,
                offerLetterSubject: offerLetter.subject,
                offerLetterBody: offerLetter.body
            });
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings");
        }
    };

    const saveOfferLetter = async () => {
        try {
            await settingsService.updateConfig({
                autoStartBatches: settings.autoStart,
                startDay: settings.startDay,
                frequency: settings.frequency,
                offerLetterSubject: offerLetter.subject,
                offerLetterBody: offerLetter.body
            });
            alert("Offer Letter template saved successfully!");
        } catch (error) {
            console.error("Failed to save offer letter", error);
            alert("Failed to save offer letter");
        }
    };

    const uploadOfferLetterTemplate = async () => {
        if (!offerLetterTemplateFile) {
            alert("Please select a .pptx file");
            return;
        }
        if (offerLetterTemplateUploading) return;

        setOfferLetterTemplateUploading(true);
        try {
            const res = await settingsService.uploadOfferLetterTemplate(offerLetterTemplateFile);
            setOfferLetterTemplate({ key: res.key || '', url: res.url || '' });
            setOfferLetterTemplateFile(null);
            alert("Offer Letter format uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload offer letter template", error);
            alert(error?.response?.data?.message || "Failed to upload offer letter format");
        } finally {
            setOfferLetterTemplateUploading(false);
        }
    };

    const uploadCertificateTemplate = async () => {
        if (!certificateTemplateFile) {
            alert("Please select a .pptx file");
            return;
        }
        if (certificateTemplateUploading) return;

        setCertificateTemplateUploading(true);
        try {
            const res = await certificateTemplateService.uploadInternshipCertificateTemplate(certificateTemplateFile);
            setCertificateTemplate({ key: res.key || '', url: res.url || '' });
            setCertificateTemplateFile(null);
            alert("Certificate format uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload certificate template", error);
            alert(error?.response?.data?.message || "Failed to upload certificate format");
        } finally {
            setCertificateTemplateUploading(false);
        }
    };

    const uploadLorTemplate = async () => {
        if (!lorTemplateFile) {
            alert("Please select a .pptx file");
            return;
        }
        if (lorTemplateUploading) return;

        setLorTemplateUploading(true);
        try {
            const res = await certificateTemplateService.uploadLorTemplate(lorTemplateFile);
            setLorTemplate({ key: res.key || '', url: res.url || '' });
            setLorTemplateFile(null);
            alert("LOR format uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload LOR template", error);
            alert(error?.response?.data?.message || "Failed to upload LOR format");
        } finally {
            setLorTemplateUploading(false);
        }
    };

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setFormData({ ...formData, title, slug });
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <span>Admin Panel</span>
                    <span>›</span>
                    <span className="text-slate-800 font-medium">
                        {view === 'list' && 'Program Management'}
                        {view === 'create' && 'Create Internship'}
                        {view === 'edit' && 'Edit Internship'}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {view === 'list' ? 'Program Management' : (view === 'create' ? 'Create Internship' : 'Edit Internship')}
                </h1>
            </div>

            {/* List View Tabs */}
            {view === 'list' && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6 w-fit">
                    <button onClick={() => setActiveTab('programs')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'programs' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <BookOpen size={18} /> Programs
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Settings size={18} /> Settings
                    </button>
                    <button onClick={() => setActiveTab('offer-letter')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'offer-letter' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <FileText size={18} /> Offer Letter
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[600px]">

                {/* LIST VIEW */}
                {view === 'list' && activeTab === 'programs' && (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-bold text-slate-800">Active Categories</h2>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-2 bg-slate-50">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="min-w-[170px]">
                                                <div className="text-xs font-bold text-slate-800">Certificate Template</div>
                                                <div className="text-[11px] text-slate-500 break-all">
                                                    {certificateTemplate.key ? 'Uploaded' : 'Not uploaded'}
                                                </div>
                                            </div>

                                            {certificateTemplate.url ? (
                                                <a
                                                    href={certificateTemplate.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                >
                                                    View
                                                </a>
                                            ) : null}

                                            <input
                                                type="file"
                                                accept=".pptx"
                                                onChange={(e) => setCertificateTemplateFile(e.target.files?.[0] || null)}
                                                className="block w-[220px] text-xs text-slate-600
                                                  file:mr-3 file:py-1.5 file:px-3
                                                  file:rounded-full file:border-0
                                                  file:text-xs file:font-semibold
                                                  file:bg-indigo-50 file:text-indigo-700
                                                  hover:file:bg-indigo-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={uploadCertificateTemplate}
                                                disabled={certificateTemplateUploading || !certificateTemplateFile}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors text-sm ${certificateTemplateUploading || !certificateTemplateFile
                                                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    }`}
                                            >
                                                <Upload size={16} />
                                                {certificateTemplateUploading ? 'Uploading...' : (certificateTemplate.key ? 'Update' : 'Upload')}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="min-w-[170px]">
                                                <div className="text-xs font-bold text-slate-800">LOR Template</div>
                                                <div className="text-[11px] text-slate-500 break-all">
                                                    {lorTemplate.key ? 'Uploaded' : 'Not uploaded'}
                                                </div>
                                            </div>

                                            {lorTemplate.url ? (
                                                <a
                                                    href={lorTemplate.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                >
                                                    View
                                                </a>
                                            ) : null}

                                            <input
                                                type="file"
                                                accept=".pptx"
                                                onChange={(e) => setLorTemplateFile(e.target.files?.[0] || null)}
                                                className="block w-[220px] text-xs text-slate-600
                                                  file:mr-3 file:py-1.5 file:px-3
                                                  file:rounded-full file:border-0
                                                  file:text-xs file:font-semibold
                                                  file:bg-indigo-50 file:text-indigo-700
                                                  hover:file:bg-indigo-100"
                                            />

                                            <button
                                                type="button"
                                                onClick={uploadLorTemplate}
                                                disabled={lorTemplateUploading || !lorTemplateFile}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors text-sm ${lorTemplateUploading || !lorTemplateFile
                                                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    }`}
                                            >
                                                <Upload size={16} />
                                                {lorTemplateUploading ? 'Uploading...' : (lorTemplate.key ? 'Update' : 'Upload')}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleCreateClick} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                                    <Plus size={20} /> Add Program
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => navigate(`/admin/programs/${category.id}`)}
                                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col h-full"
                                >
                                    {/* Card Banner Image */}
                                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                                        {category.coverImage ? (
                                            <img
                                                src={category.coverImage}
                                                alt={category.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback pattern/gradient if no image or error */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                                            style={{ display: category.coverImage ? 'none' : 'flex' }}
                                        >
                                            <BookOpen className="text-white/20 w-20 h-20 absolute -bottom-4 -right-4 rotate-12" />
                                            <BookOpen className="text-white w-12 h-12" />
                                        </div>

                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                                            {category.level || 'Intermediate'}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-slate-800 text-xl mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{category.title}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} /> {category.durationWeeks} Months
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1">
                                            {category.description || 'No description provided.'}
                                        </p>

                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={(e) => handleEditClick(e, category)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-semibold"
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, category.id, category.title)}
                                                className="w-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                                title="Delete Program"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CREATE / EDIT FORM VIEW */}
                {(view === 'create' || view === 'edit') && (
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                        {/* Section 1: Basic Information */}
                        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Basic Information</h3>

                            {/* Thumbnail */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                <label className="text-sm font-semibold text-slate-600 pt-2">Internship Thumbnail</label>
                                <div className="md:col-span-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="thumbnail-upload"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {

                                                    // Upload to S3
                                                    const s3Url = await categoryService.uploadImage(file);

                                                    // Use local object URL for immediate preview
                                                    const localPreview = URL.createObjectURL(file);
                                                    setPreview(localPreview);

                                                    // Store the full S3 URL directly
                                                    setFormData({ ...formData, coverImage: s3Url });
                                                    alert("Image uploaded successfully to S3!");
                                                } catch (err) {
                                                    console.error("Image upload failed", err);
                                                    alert("Failed to upload image. " + (err.response?.data?.message || err.message));
                                                }
                                            }
                                        }}
                                    />
                                    <div
                                        onClick={() => document.getElementById('thumbnail-upload').click()}
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer text-slate-500 relative overflow-hidden group"
                                    >
                                        {preview || formData.coverImage ? (
                                            <div className="relative w-full h-56 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
                                                {/* Display image directly - coverImage now contains full S3 URL */}
                                                <img
                                                    src={preview || formData.coverImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error('Image load error:', e);
                                                        // Do NOT clear state on error to prevent UI flashing
                                                        // e.target.src = '/placeholder.png'; // Optional fallback
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <ImageIcon className="text-white w-8 h-8 mb-2" />
                                                    <span className="text-white font-medium bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">Change Image</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormData({ ...formData, coverImage: '' });
                                                        setPreview(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-white/90 text-slate-600 p-2 rounded-full hover:text-rose-600 hover:bg-white transition-colors shadow-lg z-10"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 block">Click to Upload Image</span>
                                                <span className="text-xs text-slate-400 mt-1 block">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>


                            {/* Name & Slug */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <label className="text-sm font-semibold text-slate-600">Internship Name</label>
                                    <input
                                        type="text"
                                        className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium shadow-sm transition-all"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <label className="text-sm font-semibold text-slate-600">Internship Slug</label>
                                    <div className="md:col-span-3 flex shadow-sm rounded-xl overflow-hidden">
                                        <span className="bg-slate-50 border border-r-0 border-slate-200 text-slate-500 px-3 py-2.5 text-sm font-mono flex items-center">/internships/</span>
                                        <input
                                            type="text"
                                            className="flex-1 w-full border border-slate-200 rounded-r-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-mono text-sm text-slate-600 transition-all"
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Internship ID */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mb-6">
                                <label className="text-sm font-semibold text-slate-600">Internship ID</label>
                                <div className="md:col-span-3">
                                    <input
                                        type="text"
                                        className="w-1/3 border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-slate-50 text-slate-500 font-mono text-sm cursor-not-allowed shadow-inner"
                                        value={editingId ? editingId : "Auto-generated"}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Tagline */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                <label className="text-sm font-semibold text-slate-600 pt-2">Short Tagline</label>
                                <textarea
                                    className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 min-h-[80px] shadow-sm transition-all"
                                    placeholder="Become Job-Ready in Analysis using Python & TensorFlow."
                                    value={formData.tagline}
                                    onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                                />
                            </div>

                            {/* Level */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                <label className="text-sm font-semibold text-slate-600">Internship Level</label>
                                <div className="md:col-span-3 flex gap-4">
                                    {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(lvl => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, level: lvl })}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 shadow-sm ${formData.level === lvl
                                                ? 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-50 transform scale-105'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                        >
                                            {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Skills & Tools */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <label className="text-sm font-semibold text-slate-600">Skills You Will Learn</label>
                                    <input
                                        type="text"
                                        placeholder="Python, SQL, Machine Learning..."
                                        className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all"
                                        value={formData.skills}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <label className="text-sm font-semibold text-slate-600">Tools & Technologies</label>
                                    <input
                                        type="text"
                                        placeholder="TensorFlow, Git, AWS..."
                                        className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all"
                                        value={formData.tools}
                                        onChange={e => setFormData({ ...formData, tools: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                                <label className="text-sm font-semibold text-slate-600 pt-2">Internship Description</label>
                                <textarea
                                    className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 min-h-[120px] shadow-sm transition-all"
                                    placeholder="Detailed description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 2: Advanced Settings */}
                        <div className="bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setAdvancedOpen(!advancedOpen)}
                                className="w-full flex justify-between items-center p-4 bg-slate-100/50 hover:bg-slate-100 transition-colors"
                            >
                                <h3 className="text-sm font-bold text-slate-700">Advanced Settings</h3>
                                {advancedOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                            </button>

                            {advancedOpen && (
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-600 mb-2 block">Max Students Limit</label>
                                            <select
                                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white"
                                                value={formData.maxSeats}
                                                onChange={e => setFormData({ ...formData, maxSeats: parseInt(e.target.value) })}
                                            >
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-600 mb-2 block">Duration (Months)</label>
                                            <input
                                                type="number"
                                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none bg-white"
                                                value={formData.durationWeeks}
                                                onChange={e => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-700">Allow Re-Enrollment</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, allowReEnrollment: !formData.allowReEnrollment })}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${formData.allowReEnrollment ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.allowReEnrollment ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-700">Auto-Start Enabled (Every Monday)</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, autoStart: !formData.autoStart })}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${formData.autoStart ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.autoStart ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-700">Auto Certificate Generation</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, autoCertificate: !formData.autoCertificate })}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${formData.autoCertificate ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.autoCertificate ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-600 mb-2 block">Internal Notes (Admin Only)</label>
                                        <textarea
                                            className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none bg-white min-h-[80px]"
                                            value={formData.internalNotes}
                                            onChange={e => setFormData({ ...formData, internalNotes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 flex items-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {view === 'edit' ? 'Update Internship' : 'Create Internship'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Settings View */}
                {view === 'list' && activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            Internship Schedule Configuration
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                <div>
                                    <h3 className="font-semibold text-slate-800">Global Auto-Start</h3>
                                    <p className="text-sm text-slate-500">Automatically start new internship batches based on schedule.</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, autoStart: !settings.autoStart })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoStart ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.autoStart ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Day</label>
                                    <select
                                        value={settings.startDay}
                                        onChange={(e) => setSettings({ ...settings, startDay: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="MONDAY">Monday</option>
                                        <option value="TUESDAY">Tuesday</option>
                                        <option value="WEDNESDAY">Wednesday</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Frequency</label>
                                    <select
                                        value={settings.frequency}
                                        onChange={(e) => setSettings({ ...settings, frequency: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="WEEKLY">Every Week</option>
                                        <option value="BIWEEKLY">Every 2 Weeks</option>
                                        <option value="MONTHLY">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button onClick={saveSettings} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                                    <Check size={20} />
                                    Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Offer Letter View */}
                {view === 'list' && activeTab === 'offer-letter' && (
                    <div className="max-w-6xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    Offer Letter Template
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Configure the automated offer letter sent to selected interns.</p>
                            </div>
                            <button onClick={saveOfferLetter} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm">
                                <Save size={18} />
                                Save Template
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Subject</label>
                                    <input
                                        type="text"
                                        value={offerLetter.subject}
                                        onChange={(e) => setOfferLetter({ ...offerLetter, subject: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Content Body
                                        <span className="ml-2 text-xs font-normal text-slate-500">(Available variables: {'{{studentName}}, {{domain}}, {{startDate}}, {{duration}}'})</span>
                                    </label>
                                    <textarea
                                        value={offerLetter.body}
                                        onChange={(e) => setOfferLetter({ ...offerLetter, body: e.target.value })}
                                        className="w-full h-[400px] border border-slate-200 rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-sm leading-relaxed text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                                <h3 className="text-sm font-bold text-slate-800 mb-1">Upload Internship Offer Letter Format (PPTX)</h3>
                                <p className="text-xs text-slate-500 mb-4">Admin uploaded PPTX will be used as the base template for all generated offer letters.</p>

                                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-800">Current Template</div>
                                            <div className="text-xs text-slate-500 break-all">
                                                {offerLetterTemplate.key ? offerLetterTemplate.key : 'Not uploaded yet'}
                                            </div>
                                        </div>
                                        {offerLetterTemplate.url ? (
                                            <a
                                                href={offerLetterTemplate.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                            >
                                                View
                                            </a>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept=".pptx"
                                        onChange={(e) => setOfferLetterTemplateFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-slate-600
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-indigo-50 file:text-indigo-700
                                          hover:file:bg-indigo-100"
                                    />
                                    {offerLetterTemplateFile ? (
                                        <div className="text-xs text-slate-600">
                                            Selected: <span className="font-medium">{offerLetterTemplateFile.name}</span>
                                        </div>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={uploadOfferLetterTemplate}
                                        disabled={offerLetterTemplateUploading || !offerLetterTemplateFile}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${offerLetterTemplateUploading || !offerLetterTemplateFile
                                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        <Upload size={18} />
                                        {offerLetterTemplateUploading ? 'Uploading...' : (offerLetterTemplate.key ? 'Update Format' : 'Upload Format')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProgramsManagement;
