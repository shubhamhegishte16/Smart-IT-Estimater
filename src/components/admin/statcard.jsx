function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2 text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default StatCard;