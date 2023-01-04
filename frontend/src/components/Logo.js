import React from 'react';

function Logo(props) {
  return (
    <img
      alt="Logo"
      src="/static/logo.png"
      width={43}
      height={43}
      {...props}
    />
  );
}

export default Logo;
