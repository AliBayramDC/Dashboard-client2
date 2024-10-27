import React, { createContext, useState } from 'react';

export const DetailsContext = createContext();

export const DetailsProvider = ({ children }) => {
  const [detailsData, setDetailsData] = useState([]);

  return (
    <DetailsContext.Provider value={{ detailsData, setDetailsData }}>
      {children}
    </DetailsContext.Provider>
  );
};
