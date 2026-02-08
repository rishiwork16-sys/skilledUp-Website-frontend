// src/pages/Internship/InternshipCategories.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { getInternshipCategories } from '../../api/studentService';

const InternshipCategories = ({ onApplyClick }) => {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getInternshipCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedCategories = categoriesExpanded
    ? categories
    : categories.slice(0, 6);

  // Icon mapping based on title keywords
  const getIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    if (lowerTitle.includes('data science') || lowerTitle.includes('ai')) return '📊';
    if (lowerTitle.includes('data analytics') || lowerTitle.includes('analytics')) return '📈';
    if (lowerTitle.includes('business')) return '💼';
    if (lowerTitle.includes('web') || lowerTitle.includes('development')) return '💻';
    if (lowerTitle.includes('marketing')) return '📱';
    if (lowerTitle.includes('design')) return '🎨';
    if (lowerTitle.includes('hr') || lowerTitle.includes('human')) return '👥';
    if (lowerTitle.includes('content') || lowerTitle.includes('writing')) return '✍️';
    return '📚'; // Default icon
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading internship programs...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Programs Available</h2>
          <p className="text-gray-600">Check back soon for new internship opportunities!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Internship Programs
          </h2>
          <p className="text-gray-600 font-semibold max-w-2xl mx-auto">
            Explore our {categories.length} available internship programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
          {displayedCategories.map((category) => (
            <Card key={category.id} className="text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">
                  {getIcon(category.title)}
                </span>
              </div>

              <h3 className="text-lg font-black text-blue-800 mb-2">
                {category.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 min-h-[3rem] line-clamp-2">
                {category.description || `Join our ${category.title} internship program`}
              </p>

              <Button
                onClick={onApplyClick}
                variant="primary"
                size="small"
                className="w-full"
              >
                Apply Now →
              </Button>
            </Card>
          ))}
        </div>

        {categories.length > 6 && (
          <div className="text-center">
            <Button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              variant="secondary"
              size="medium"
            >
              {categoriesExpanded ? 'Show Less' : 'View All Internships'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InternshipCategories;