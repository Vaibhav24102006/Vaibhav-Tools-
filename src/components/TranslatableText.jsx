import React from 'react';
import { useTranslation } from '../context/TranslationContext';

// Component to wrap translatable text
const TranslatableText = ({ children, ...props }) => {
  const { translate, isTranslating } = useTranslation();
  
  // If it's a string, translate it
  if (typeof children === 'string') {
    return (
      <span className={isTranslating ? 'opacity-70 transition-opacity duration-200' : ''} {...props}>
        {translate(children)}
      </span>
    );
  }
  
  // If it's a React element, try to translate its text content recursively
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: `${children.props.className || ''} ${isTranslating ? 'opacity-70 transition-opacity duration-200' : ''}`.trim(),
      children: translateChildren(children.props.children, translate)
    });
  }
  
  // For other types, return as is
  return children;
};

// Helper function to translate children recursively
const translateChildren = (children, translate) => {
  if (typeof children === 'string') {
    return translate(children);
  }
  
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return translate(child);
      }
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          key: index,
          children: translateChildren(child.props.children, translate)
        });
      }
      return child;
    });
  }
  
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      children: translateChildren(children.props.children, translate)
    });
  }
  
  return children;
};

// Higher-order component for making components translatable
export const withTranslation = (WrappedComponent) => {
  return function TranslatableComponent(props) {
    const { translate } = useTranslation();
    return <WrappedComponent {...props} translate={translate} />;
  };
};

// Hook for quick translation in components
export const useT = () => {
  const { translate } = useTranslation();
  return translate;
};

export default TranslatableText;
