import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';
import ReferenceBadge from './ReferenceBadge';
import { ClinicalReference } from '@/types';

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedAlgorithm?: 'PCE' | 'PREVENT';
  onAlgorithmChange?: (algorithm: 'PCE' | 'PREVENT') => void;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  action?: () => void;
  icon: React.ReactNode;
  description?: string;
  showWhen?: 'always' | 'home' | 'calculator' | 'results';
}

// Clinical references for mobile menu
const MOBILE_REFERENCES: ClinicalReference[] = [
  {
    id: 'pce-mobile',
    authors: 'ACC/AHA',
    title: '2013 Risk Assessment Guideline',
    journal: 'Circulation',
    year: 2014,
    pmid: '24222018',
    summary: 'Clinical standard for cardiovascular risk assessment'
  },
  {
    id: 'prevent-mobile',
    authors: 'AHA',
    title: 'PREVENT Equations 2024',
    journal: 'Circulation',
    year: 2024,
    pmid: '38440987',
    summary: 'Enhanced risk prediction with kidney function'
  }
];

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onToggle,
  selectedAlgorithm = 'PREVENT',
  onAlgorithmChange,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Close menu when route changes
  useEffect(() => {
    onToggle();
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentPage = location.pathname;

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      description: 'Return to homepage',
      showWhen: currentPage !== '/' ? 'always' : undefined
    },
    {
      id: 'calculator',
      label: 'Risk Calculator',
      path: '/calculator',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2 1 1 0 000-2zm-4 1a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h1a1 1 0 100-2H7zm4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Start cardiovascular risk assessment',
      showWhen: currentPage !== '/calculator' ? 'always' : undefined
    },
    {
      id: 'how-it-works',
      label: 'How It Works',
      action: () => {
        if (currentPage === '/') {
          const section = document.getElementById('how-it-works');
          section?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            const section = document.getElementById('how-it-works');
            section?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      },
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Learn about our clinical methodology',
      showWhen: 'always'
    }
  ];

  const visibleItems = navigationItems.filter(item => 
    !item.showWhen || item.showWhen === 'always'
  );

  const handleNavigation = (item: NavigationItem) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  const handleAlgorithmSwitch = (algorithm: 'PCE' | 'PREVENT') => {
    if (onAlgorithmChange) {
      onAlgorithmChange(algorithm);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onToggle}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-prediction-50 to-intelligence-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-prediction-500 to-intelligence-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Bioprognostika</h3>
                <p className="text-xs text-prediction-600">Health Prediction</p>
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Main Navigation */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Navigation
                </h4>
                <div className="space-y-2">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-neutral-100 transition-colors group"
                    >
                      <div className="text-neutral-500 group-hover:text-prediction-600 transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 group-hover:text-prediction-900">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-xs text-neutral-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-neutral-400 group-hover:text-prediction-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Algorithm Selection (if available) */}
              {onAlgorithmChange && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    Algorithm Selection
                  </h4>
                  <div className="space-y-2">
                    {(['PREVENT', 'PCE'] as const).map((algorithm) => (
                      <button
                        key={algorithm}
                        onClick={() => handleAlgorithmSwitch(algorithm)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          selectedAlgorithm === algorithm
                            ? 'bg-prediction-50 border-prediction-200 text-prediction-900'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {algorithm} ({algorithm === 'PREVENT' ? '2024' : '2013'})
                          </span>
                          {selectedAlgorithm === algorithm && (
                            <svg className="w-5 h-5 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600">
                          {algorithm === 'PREVENT' 
                            ? 'Enhanced with kidney function, 10 & 30-year risk'
                            : 'Traditional 10-year cardiovascular risk assessment'
                          }
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Evidence */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Clinical Evidence
                </h4>
                <div className="space-y-2">
                  {MOBILE_REFERENCES.map((ref) => (
                    <div key={ref.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <ReferenceBadge referenceId={ref.id} variant="medium" showTooltip={false} />
                      <p className="text-xs text-neutral-600 mt-1">{ref.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (currentPage !== '/calculator') {
                        navigate('/calculator');
                      }
                    }}
                    className="w-full"
                  >
                    <Button className="w-full bg-gradient-to-r from-prediction-600 to-primary-600 hover:from-prediction-700 hover:to-primary-700">
                      Start Risk Assessment
                    </Button>
                  </button>
                  
                  <button
                    onClick={() => {
                      const section = document.getElementById('how-it-works');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/');
                      }
                    }}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full border-prediction-300 text-prediction-700 hover:bg-prediction-50">
                      Learn More
                    </Button>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-neutral-600 mb-2">
                Evidence-based cardiovascular risk prediction
              </p>
              <div className="flex items-center justify-center space-x-3 text-xs text-neutral-500">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Privacy-First
                </span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clinically Validated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;