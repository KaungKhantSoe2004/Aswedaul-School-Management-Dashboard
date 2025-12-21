import axios from "axios";
import { useEffect, useState } from "react";

export default function FinancialManagement() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Financial Management System
          </h1>
          <p classNames="text-xl text-gray-600 mb-8">
            Manage salaries, employees, and payment workflows with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div href="/salary">
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-cyan-500">
              <div className="text-3xl mb-3">💰</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Salary Management
              </h2>
              <p className="text-gray-600">
                Manage employee salaries, track payments, and process payroll
                workflows
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How the Salary Workflow Works
          </h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex items-start gap-4">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full font-bold flex-shrink-0">
                1
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">Add Employees</h3>
                <p>
                  Create employee records with name, position, and annual salary
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full font-bold flex-shrink-0">
                2
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">Track Salaries</h3>
                <p>
                  View all employee salaries and calculate total payroll
                  expenses
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full font-bold flex-shrink-0">
                3
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Process Payments
                </h3>
                <p>
                  Mark payments as "Paid" or "Pending" and track payment dates
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full font-bold flex-shrink-0">
                4
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Monitor Overview
                </h3>
                <p>
                  See summary statistics for total payroll and payment status
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
