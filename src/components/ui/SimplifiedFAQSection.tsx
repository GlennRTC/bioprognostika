import React, { useState } from 'react';
import { CitationTooltip } from '@/components/ui';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'usage' | 'algorithms' | 'privacy' | 'clinical';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'who-should-use',
    question: 'Who should use this calculator?',
    answer: 'Adults aged 30-79 without known cardiovascular disease. PCE is validated for ages 40-79, while PREVENT covers ages 30-79. Particularly valuable for individuals with risk factors who want to understand their cardiovascular risk.',
    category: 'usage'
  },
  {
    id: 'algorithm-choice',
    question: 'Which algorithm should I choose - PCE or PREVENT?',
    answer: 'PCE (2013) is the established gold standard, ideal for standard risk assessment and ages 40-79. PREVENT (2024) is more comprehensive, includes kidney function, provides 30-year predictions, and works for ages 30-79. Choose based on your age, available lab data, and desired prediction timeframe.',
    category: 'algorithms'
  },
  {
    id: 'data-privacy',
    question: 'Is my health data private and secure?',
    answer: 'Absolutely. All calculations happen in your browser - your data never leaves your device. We use local storage only, with no servers, databases, or external data transmission. This is HIPAA-compliant by design.',
    category: 'privacy'
  },
  {
    id: 'clinical-use',
    question: 'Can I use this for medical decisions?',
    answer: 'This is an educational tool only, not for clinical decision-making. Always consult healthcare providers for personalized medical advice. However, you can share your results with your doctor as part of informed health discussions.',
    category: 'clinical'
  },
  {
    id: 'accuracy',
    question: 'How accurate are the predictions?',
    answer: 'Both algorithms use clinically validated statistical models. PCE has 30+ years of validation (C-statistic 0.71-0.82), while PREVENT shows improved accuracy (C-statistic 0.73-0.85) especially in younger adults and those with kidney disease.',
    category: 'algorithms'
  },
  {
    id: 'integration',
    question: 'Can this be integrated into clinical software?',
    answer: 'Yes. Our open-source TypeScript implementation can be integrated into EHR systems, clinical decision support tools, or research platforms. All algorithms and code are transparently available.',
    category: 'clinical'
  }
];

const SimplifiedFAQSection: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Questions', icon: '❓' },
    { id: 'usage', label: 'Usage', icon: '👤' },
    { id: 'algorithms', label: 'Algorithms', icon: '🧮' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'clinical', label: 'Clinical', icon: '🏥' }
  ];

  return (
    <div className="border-t border-neutral-200 pt-12">
      <div className="text-center mb-8">
        <h3 className="medical-heading-secondary text-neutral-900 mb-4">
          Frequently Asked Questions
        </h3>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Get quick answers about how Bioprognostika works, data privacy, and clinical applications.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-white text-prediction-700 shadow-sm'
                  : 'text-neutral-600 hover:text-prediction-600'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-3">
        {filteredFAQs.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center flex-1">
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-3 ${
                  item.category === 'usage' ? 'bg-blue-100 text-blue-800' :
                  item.category === 'algorithms' ? 'bg-purple-100 text-purple-800' :
                  item.category === 'privacy' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {categories.find(c => c.id === item.category)?.icon}
                  <span className="ml-1">{categories.find(c => c.id === item.category)?.label}</span>
                </div>
                <span className="font-medium text-neutral-900">{item.question}</span>
              </div>
              <svg 
                className={`w-5 h-5 text-neutral-400 transition-transform ${
                  expandedItems.has(item.id) ? 'rotate-180' : ''
                }`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {expandedItems.has(item.id) && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <p className="text-neutral-700 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-prediction-50 to-intelligence-50 p-6 rounded-lg border border-prediction-200 max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-neutral-900 mb-2">Still have questions?</h4>
          <p className="text-sm text-neutral-700 mb-4">
            Bioprognostika is designed to be transparent and educational. All our algorithms, methodologies, 
            and clinical references are available for review.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-prediction-300 rounded-lg text-prediction-700 hover:bg-prediction-50 transition-colors text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              View Clinical Evidence
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-prediction-300 rounded-lg text-prediction-700 hover:bg-prediction-50 transition-colors text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Open Source Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedFAQSection;