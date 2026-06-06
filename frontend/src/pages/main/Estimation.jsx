import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/estimation/Stepper";
import ProjectTypeStep from "../../components/estimation/ProjectTypeStep";
import FeaturesStep from "../../components/estimation/FeaturesStep";
import ClientDetailsStep from "../../components/estimation/ClientDetailsStep";

import projectTypes from "../../data/projectTypes";
import features from "../../data/features";

import { calculateEstimate } from "../../utils/estimateCalculator";

export default function Estimation() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    projectType: "",
    features: [],
    clientName: "",
    email: "",
    phone: "",
    company: "",
  });

  const toggleFeature = (feature) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const estimate = calculateEstimate(data);

  const generateEstimate = () => {
    navigate("/results", {
      state: {
        data,
        estimate,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "36px",
          }}
        >
          Smart IT Estimator
        </h1>

        <Stepper step={step} />

        {step === 1 && (
          <ProjectTypeStep
            projectTypes={projectTypes}
            selectedType={data.projectType}
            setProjectType={(type) =>
              setData((prev) => ({
                ...prev,
                projectType: type,
              }))
            }
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <FeaturesStep
            features={features}
            selectedFeatures={data.features}
            toggleFeature={toggleFeature}
            cost={estimate.cost}
            complexity={estimate.complexity}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <ClientDetailsStep
            data={data}
            setData={setData}
            cost={estimate.cost}
            complexity={estimate.complexity}
            onBack={() => setStep(2)}
            onGenerate={generateEstimate}
          />
        )}
      </div>
    </div>
  );
}