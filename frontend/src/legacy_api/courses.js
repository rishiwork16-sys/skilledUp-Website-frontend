// src/api/courses.js
import api from './api';

export const getAllCourses = async () => {
  try {
    const response = await api.get("/api/courses");
    console.log(response.data);
    // Map API response to match your frontend format
    const courses = response.data.map(course => {
      // Determine category based on course title
      let category = "Popular Courses";
      const title = course.title?.toLowerCase() || "";
      
      if (title.includes("data science")) {
        category = "Data Science & AI";
      } else if (title.includes("data analytics")) {
        category = "Data Analytics";
      } else if (title.includes("python") || title.includes("machine learning")) {
        category = "AI & Machine Learning";
      } else if (title.includes("excel") || title.includes("power bi") || title.includes("mysql")) {
        category = "Data Analytics";
      }
      
      // Return formatted course object
      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        category: category,
        mode: "Online/Offline", // Default mode
        duration: "6 Months", // Default duration
        price: course.priceInPaise || 0, // Price is already in rupees
        reviewsCount: course.reviewsCount || Math.floor(Math.random() * 5000) + 1000,
        rating: course.rating || 4.5,
        img: course.thumbnailUrl || "images/default-course.png",
        url: `/courses/${course.slug}`,
        description: course.description || "Learn from industry experts with hands-on projects.",
        active: course.active || true
      };
    });
    
    return courses;
    
  } catch(error) {
    console.error("Error Getting Courses:", error);
    // Return empty array on error
    return [];
  }
};


export const getCourseBySlug = async (slug) => {
  try {
    console.log("dekho bhai kya arha hey "+ slug);
    const response = await api.get(`/api/courses/slug/${slug}`);
    
    // Ensure the response has all required fields
    const courseData = response.data;
    
    // Add fallback values
    return {
      id: courseData.id,
      title: courseData.title || "CareerX: Data Science & GenAI",
      slug: courseData.slug || slug,
      priceInPaise: courseData.price || 100000,
      // originalPrice: courseData.originalPrice || 100000,
      discount: courseData.discount || 10,
      duration: courseData.duration || "9 Months",
      mode: courseData.mode || "Online/Offline (Noida)",
      description: courseData.description || "9-Month Live Data Science & GenAI Program with PPO + Job Guarantee (T&C Apply)",
      thumbnailUrl: courseData.thumbnailUrl || "/images/CareerX_ Data Science & GenAI.png",
      rating: courseData.rating || 4.9,
      reviewsCount: courseData.reviewsCount || 3000
    };
    
  } catch (error) {
    console.error("Error getting course by slug:", error);
    
    // Return fallback data
    return {
      id: 1, // Default ID - UPDATE THIS WITH YOUR ACTUAL COURSE ID
      title: "CareerX: Data Science & GenAI",
      slug: slug,
      priceInPaise: 90000,
      originalPrice: 100000,
      discount: 10,
      duration: "9 Months",
      mode: "Online/Offline (Noida)",
      description: "9-Month Live Data Science & GenAI Program with PPO + Job Guarantee (T&C Apply)",
      thumbnailUrl: "/images/CareerX_ Data Science & GenAI.png",
      rating: 4.9,
      reviewsCount: 3000
    };
  }
};

