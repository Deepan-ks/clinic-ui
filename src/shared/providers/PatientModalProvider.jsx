import { createContext, useContext, useState } from "react";

const PatientModalContext = createContext();

export function usePatientModal() {
  const context = useContext(PatientModalContext);
  if (!context) {
    throw new Error("usePatientModal must be used within a PatientModalProvider");
  }
  return context;
}

export function PatientModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onSuccessCb, setOnSuccessCb] = useState(null);

  const openModal = (onSuccess) => {
    setOnSuccessCb(() => onSuccess);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOnSuccessCb(null);
  };

  return (
    <PatientModalContext.Provider value={{ isOpen, openModal, closeModal, onSuccessCb }}>
      {children}
    </PatientModalContext.Provider>
  );
}
