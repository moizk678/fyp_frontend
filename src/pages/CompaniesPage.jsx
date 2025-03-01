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
      <div className="flex items-center justify-center w-full">
        <Loader />;
      </div>
    );
  }

  return (
    <div className="content">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-6">
        {companies.map((company) => (
          <CompanyCard key={company.companyId} company={company} />
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
