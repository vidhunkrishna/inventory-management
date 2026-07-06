import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = ''
}) => {
  const getInitials = (n) => {
    return n
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  // Generate color palette based on name characters
  const getBgGradient = (n) => {
    const charCodeSum = n.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = charCodeSum % 5;
    const gradients = [
      'from-blue-400 to-indigo-500',
      'from-emerald-400 to-teal-500',
      'from-amber-400 to-orange-500',
      'from-rose-400 to-pink-500',
      'from-purple-400 to-violet-500'
    ];
    return gradients[colorIndex];
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden select-none shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      
      {/* Fallback Initials under/instead of image */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-tr ${getBgGradient(name)} text-white font-bold font-sans`}>
        {getInitials(name)}
      </div>
    </div>
  );
};
export default Avatar;
