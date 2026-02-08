import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import {
  sendMobileOtp,
  verifyMobileOtp,
  sendEmailOtp,
  verifyEmailOtp,
  enrollInternship,
  getProfile
} from '../api/internship';
import { getInternshipCategories } from '../api/studentService';

export const useInternshipForm = () => {
  const { user } = useUser();

  /* ============================
     FORM STATE
  ============================ */
  const [formState, setFormState] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    phoneVerified: false,
    phoneOtpSent: false,
    phoneOtp: '',

    email: '',
    emailVerified: false,
    emailOtpSent: false,
    emailOtp: '',

    domain: '',
    duration: '',

    fullAddress: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',

    currentStep: 1
  });

  /* ============================
     UI STATE
  ============================ */
  const [activeInterns, setActiveInterns] = useState(10000);
  const [domainsCount, setDomainsCount] = useState(7);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [zoomedImageSrc, setZoomedImageSrc] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const prefillFromSource = (source) => {
      if (!source) return;
      setFormState(prev => ({
        ...prev,
        firstName: source.firstName || prev.firstName || '',
        lastName: source.lastName || prev.lastName || '',
        email: source.email || prev.email || '',
        phone: source.phone || source.mobile || prev.phone || '',
        emailVerified: true,
        phoneVerified: true
      }));
    };

    if (user) {
      prefillFromSource(user);
    }

    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        prefillFromSource({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.mobile,
          mobile: profile.mobile
        });
      } catch (err) {
      }
    };

    fetchProfile();
  }, [user]);

  /* ============================
     FETCH INTERNSHIP CATEGORIES
  ============================ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getInternshipCategories();
        setCategories(data || []);
        setDomainsCount(data?.length || 0);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ============================
     INPUT HANDLER
  ============================ */
  const handleInputChange = useCallback((field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  /* ============================
     MOBILE OTP
  ============================ */
  const sendPhoneOtp = useCallback(async () => {
    try {
      if (!/^\d{10}$/.test(formState.phone)) {
        showToast('Enter valid 10-digit mobile number');
        return;
      }

      await sendMobileOtp(formState.phone);

      setFormState(prev => ({
        ...prev,
        phoneOtpSent: true
      }));

      showToast('OTP sent to mobile');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to send mobile OTP');
    }
  }, [formState.phone]);

  const verifyPhoneOtp = useCallback(async () => {
    try {
      if (!formState.phoneOtp || formState.phoneOtp.length !== 6) {
        showToast('Enter valid 6-digit OTP');
        return;
      }

      await verifyMobileOtp(formState.phone, formState.phoneOtp);

      setFormState(prev => ({
        ...prev,
        phoneVerified: true
      }));

      showToast('Mobile verified successfully');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Invalid mobile OTP');
    }
  }, [formState.phone, formState.phoneOtp]);

  /* ============================
     EMAIL OTP
  ============================ */
  const sendEmailOtpHandler = useCallback(async () => {
    try {
      if (!formState.phoneVerified) {
        showToast('Verify mobile first');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
        showToast('Enter valid email');
        return;
      }

      await sendEmailOtp(formState.email);

      setFormState(prev => ({
        ...prev,
        emailOtpSent: true
      }));

      showToast('OTP sent to email');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to send email OTP');
    }
  }, [formState.email, formState.phoneVerified]);

  const verifyEmailOtpHandler = useCallback(async () => {
    try {
      if (!formState.emailOtp || formState.emailOtp.length !== 6) {
        showToast('Enter valid 6-digit OTP');
        return;
      }

      await verifyEmailOtp(formState.email, formState.emailOtp);

      setFormState(prev => ({
        ...prev,
        emailVerified: true
      }));

      showToast('Email verified successfully');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Invalid email OTP');
    }
  }, [formState.email, formState.emailOtp]);

  /* ============================
     STEP 1 → STEP 2
  ============================ */
  const continueToStep2 = useCallback(() => {
    const { firstName, lastName, domain, duration, phoneVerified, emailVerified } = formState;

    if (!firstName || !lastName) return showToast('Name is required');
    if (!phoneVerified) return showToast('Verify mobile first');
    if (!emailVerified) return showToast('Verify email first');
    if (!domain || !duration) return showToast('Select domain and duration');

    setFormState(prev => ({ ...prev, currentStep: 2 }));
  }, [formState]);

  /* ============================
     FINAL SUBMIT
  ============================ */
  const completeApplication = useCallback(async () => {
    try {
      const payload = {
        userId: user?.id || user?.userId, // Add userId here
        internshipTypeId: Number(formState.domain),
        name: `${formState.firstName} ${formState.middleName} ${formState.lastName}`.trim(),
        email: formState.email,
        phone: formState.phone,
        duration: Number(formState.duration),
        address: formState.fullAddress,
        city: formState.city,
        state: formState.state,
        country: formState.country,
        pincode: formState.pinCode
      };

      await enrollInternship(payload);

      setShowSuccess(true);
      showToast('Internship enrolled successfully');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Enrollment failed');
    }
  }, [formState, user]);

  /* ============================
     MODAL HANDLERS ✅ (CRITICAL FIX)
  ============================ */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setFormState(prev => ({ ...prev, currentStep: 1 }));
    setShowSuccess(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFormState(prev => ({ ...prev, currentStep: 1 }));
    setShowSuccess(false);
  }, []);

  /* ============================
     TOAST
  ============================ */
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className =
      'fixed top-5 left-1/2 -translate-x-1/2 bg-blue-800 text-white px-7 py-3 rounded-lg font-bold z-[99999]';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  /* ============================
     EXPORT
  ============================ */
  return {
    formState,
    activeInterns,
    domainsCount,
    currentSlide,
    isModalOpen,
    isImageModalOpen,
    currentZoom,
    zoomedImageSrc,
    showSuccess,

    formActions: {
      handleInputChange,
      sendPhoneOtp,
      verifyPhoneOtp,
      sendEmailOtp: sendEmailOtpHandler,
      verifyEmailOtp: verifyEmailOtpHandler,
      continueToStep2,
      completeApplication,
      setCurrentStep: (step) =>
        setFormState(prev => ({ ...prev, currentStep: step }))
    },

    sliderActions: {
      nextSlide: () => setCurrentSlide(prev => (prev + 1) % 4),
      prevSlide: () => setCurrentSlide(prev => (prev - 1 + 4) % 4),
      goToSlide: (i) => setCurrentSlide(i)
    },

    modalActions: {
      openModal,
      closeModal
    },

    imageModalActions: {
      openImageModal: () => { },
      closeImageModal: () => { },
      zoomIn: () => { },
      zoomOut: () => { },
      resetZoom: () => { }
    },

    categories,
    categoriesLoading
  };
};
