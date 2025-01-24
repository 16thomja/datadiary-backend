import React, { createContext, useContext, useState } from 'react';

const NotFoundContext = createContext();

export const NotFoundProvider = ({ children }) => {
  const [notFoundInfo, setNotFoundInfo] = useState(null);

  return (
    <NotFoundContext.Provider value={{ notFoundInfo, setNotFoundInfo }}>
      {children}
    </NotFoundContext.Provider>
  );
};

export const useNotFound = () => useContext(NotFoundContext);
