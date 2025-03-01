/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import CompanyCard from "../components/utils/CompanyCard";
import Loader from "../components/utils/Loader";
import { useSelector } from "react-redux";

const CompaniesPage = () => {
  const companies = useSelector((state) => state.companies.data);
  const status = useSelector((state) => state.companies.status);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-6">
        <Loader />
      </div>
    );
  }

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-8 pt-16">
  {/* Header with Extra Space Above */}
  <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8 mt-6">
    🏢 Available Bus Companies
  </h1>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {companies.map((company) => (
          <div
            key={company.companyId}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg transition-all hover:scale-105"
          >
            <CompanyCard company={company} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
