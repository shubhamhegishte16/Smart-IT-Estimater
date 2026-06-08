import { useLocation, useNavigate } from "react-router-dom";
import { Download, FileText, Home, Printer } from "lucide-react";

function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { estimate, client } = location.state || {};

    if (!estimate) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">No estimate data found.</p>
                    <button 
                        onClick={() => navigate("/estimations")}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-xl"
                    >
                        Create New Estimate
                    </button>
                </div>
            </div>
        );
    }

    const handleDownload = () => {
        alert("Download report functionality will be implemented");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-black text-white px-8 py-6">
                        <h1 className="text-2xl font-bold">Estimate Summary</h1>
                        <p className="text-gray-300 mt-1">Thank you for choosing our services</p>
                    </div>

                    {/* Client Info */}
                    <div className="px-8 py-6 border-b">
                        <h2 className="text-lg font-semibold mb-3">Client Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{client?.clientName || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{client?.clientEmail || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{client?.phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Company</p>
                                <p className="font-medium">{client?.company || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="px-8 py-6 border-b">
                        <h2 className="text-lg font-semibold mb-3">Project Details</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Project Type</p>
                                <p className="font-medium">{estimate.projectType?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Complexity</p>
                                <p className="font-medium">{estimate.complexity || "Medium"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Timeline</p>
                                <p className="font-medium">{estimate.days || 0} days</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tech Stack</p>
                                <p className="font-medium">{estimate.stack || "React + Node.js"}</p>
                            </div>
                        </div>

                        {/* Selected Features */}
                        {estimate.features && estimate.features.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Selected Features</p>
                                <div className="space-y-2">
                                    {estimate.features.map((feature, idx) => (
                                        <div key={idx} className="flex justify-between py-1">
                                            <span>{feature.name}</span>
                                            <span className="font-medium">₹{feature.cost?.toLocaleString() || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total Cost */}
                    <div className="px-8 py-6 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">Total Estimated Cost</span>
                            <span className="text-3xl font-black">₹{estimate.cost?.toLocaleString() || 0}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">*This is an estimate. Final pricing may vary based on requirements.</p>
                    </div>

                    {/* Actions */}
                    <div className="px-8 py-6 flex gap-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 h-12 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-800"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex-1 h-12 rounded-xl border border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                        <button
                            onClick={() => navigate("/estimations")}
                            className="flex-1 h-12 rounded-xl border border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                            <Home size={18} />
                            New Estimate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Results;