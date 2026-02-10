import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const MobileMenuToggle = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle && onToggle(!isOpen);
  };

  return (
    <button 
      className="mobile-menu-toggle" 
      onClick={handleToggle}
      aria-label="Toggle mobile menu"
    >
      {isOpen ? <FaTimes /> : <FaBars />}
    </button>
  );
};

export default MobileMenuToggle; 