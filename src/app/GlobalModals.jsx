import { usePatientModal } from "@/shared/providers/PatientModalProvider";
import AddPatientModal from "@/modules/patients/components/AddPatientModal";

export function GlobalModals() {
  const { isOpen, closeModal, onSuccessCb } = usePatientModal();

  const handleCreated = (patient) => {
    if (onSuccessCb) onSuccessCb(patient);
    closeModal();
  };

  return (
    <>
      <AddPatientModal
        open={isOpen}
        onClose={closeModal}
        onCreated={handleCreated}
      />
      {/* Other global modals can be added here */}
    </>
  );
}
