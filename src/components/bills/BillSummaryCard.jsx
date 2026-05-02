function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function BillSummaryCard({ bill }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-gray-900">Bill Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <SummaryField label="Bill Number" value={bill.billNumber} />
        <SummaryField label="Date" value={formatDate(bill.date)} />
        <SummaryField label="Patient" value={bill.patientName} />
        <SummaryField label="Doctor" value={bill.doctorName} />
      </div>
    </div>
  );
}

function SummaryField({ label, value }) {
  return (
    <div className="border border-gray-100 rounded-lg px-3 py-2.5 bg-gray-50/70">
      <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">
        {label}
      </p>
      <p className="text-sm text-gray-800 font-medium mt-1 break-all">{value || "-"}</p>
    </div>
  );
}

