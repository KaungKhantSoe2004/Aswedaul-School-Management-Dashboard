
import axios from "axios";
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaUser as FiUsers } from "react-icons/fa";
import {
  FiEdit, FiTrash2, FiPlus, FiX, FiSave, FiDollarSign, FiCalendar, FiUser, FiLoader,
  FiZap,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiMail,
  
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const theme = {
    primary: "#06B6D4",
    secondary: "#8B5CF6",
    accent: "#10B981",
    feeAccent: "#F59E0B",
    dark: "#0F172A", 
    light: "#64748B", 
    background: "#F0F9FF", 
    white: "#FFFFFF",
    red: "#EF4444", 
    lightGray: "#E2E8F0",
};

const formatPayMonth = (isoString) => {
    try {
        const date = new Date(isoString);
        const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const year = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'UTC' });
        return `${month} ${year}`;
    } catch (e) {
        return "N/A";
    }
};

const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return `0`;
    return `${numericAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const calculateNetSalary = (monthly, bonus, deductions) => {
    return (parseFloat(monthly) || 0) + (parseFloat(bonus) || 0) - (parseFloat(deductions) || 0);
};

const transformApiData = (apiSalaries) => {
    if (!Array.isArray(apiSalaries)) return [];

    return apiSalaries.map(salaryItem => {
        const netSalary = calculateNetSalary(salaryItem.monthly_salary, salaryItem.bonus, salaryItem.deductions);
        return {
            id: salaryItem.id,
            userId: salaryItem.user_id,
            name: salaryItem.user?.username || 'Unknown User',
            role: salaryItem.userType || 'N/A',
            monthlySalary: parseFloat(salaryItem.monthly_salary) || 0,
            bonus: parseFloat(salaryItem.bonus) || 0,
            deductions: parseFloat(salaryItem.deductions) || 0,
            netSalary: netSalary,
            payMonth: salaryItem.pay_month,
            remarks: salaryItem.remarks || '',
            paymentStatus: netSalary > 0 ? "Paid" : "Pending",
        };
    });
};

function SalaryManagement() {
    const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME   
    const [showModal, setShowModal] = useState(false); 
    const [isLoading,setIsLoading]= useState(false);
    const [error, setError]= useState(false);
    const [salaries, setSalaries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const handleChange = useCallback(
  (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  },
  []
     );
    const today = new Date();
    const currentPayMonthDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    const currentPayMonthDisplay = currentPayMonthDateString;
    
    const [formData, setFormData] = useState({
        user_id: "", username: "", monthly_salary: "", bonus: "0", deductions: "0", pay_month: "", remarks: "",
    });
    const navigate = useNavigate();
    const fetchData = async()=> {
     try{
        const response = await axios.get(`${admin_backend_domain_name}api/admin/getSalaries` , {
          withCredentials:true
        });
        setSalaries(response.data);
        console.log(salaries)
     }catch(err){
       if(err.response.status == 401){
        navigate("/login")
       }
     }
    }
    
    const isMonthlyListGenerated = salaries.length > 0;

    const { totalPayroll, paidCount, pendingCount } = useMemo(() => {
        const total = salaries.reduce((sum, s) => sum + s.monthlySalary, 0);
        const paid = salaries.filter(s => s.netSalary > 0).length;
        return { totalPayroll: total, paidCount: paid, pendingCount: salaries.length - paid };
    }, [salaries]);

    const handleCreateMonthlyList = async () => {
        if (isGenerating) return;

        if (!window.confirm(`Are you sure you want to generate the initial salary list for ${currentPayMonthDisplay}? This will create a pending record for all staff.`)) {
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            
            const response = await axios.get(`${admin_backend_domain_name}api/admin/generate`, {
              withCredentials:true
            });
  
            const generatedData = transformApiData(response.data.data);
            setSalaries(generatedData);
        } catch (error) {
            setError(error.response.data.message)
            // alert(error.response.data.message);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleAddClick = () => {
        setFormData({ user_id: "", username: "", monthly_salary: "", bonus: "0", deductions: "0", pay_month:"", remarks: "" });
        setEditingId(null);
        setShowModal(true); 
    };

    const handleEditClick = (salaryItem) => {
        setFormData({
            user_id: salaryItem.user_id.toString(), 
            username: salaryItem.username,
            monthly_salary: salaryItem.monthly_salary, 
            bonus: salaryItem.bonus.toString(),
            deductions: salaryItem.deductions.toString(), 
            pay_month: salaryItem.pay_month, 
            remarks: salaryItem.remarks,
        });
        console.log(salaryItem)
        setEditingId(salaryItem.id);
        setShowModal(true); 
    };

    const handleCancel = () => {
        setShowModal(false); 
        setEditingId(null);
        setFormData({ user_id: "", username: "", monthly_salary: "", bonus: "0", deductions: "0", pay_month: "", remarks: "" });
    };

    const handleSave = async () => {
      if (!formData.user_id) return;

        const net_salary_calc = calculateNetSalary(
        formData.monthly_salary,
        formData.bonus,
        formData.deductions
         );

        const payload = {
        id: editingId,                   // ID of the salary entry to update
        bonus: parseFloat(formData.bonus),
        deductions: parseFloat(formData.deductions),
        net_salary: net_salary_calc,
        remarks: formData.remarks,
         };

    try {
        // POST to backend
        const response = await axios.post(
            `${admin_backend_domain_name}api/admin/saveSalary`,
            payload, {
              withCredentials:true
            }
        );
        console.log(response.data)

        // Backend responds with the updated salaries list
        setSalaries(response.data);

        handleCancel(); // close modal and reset form
    } catch (error) {
        console.error(error);
        setError(`Failed to ${editingId ? 'update' : 'add'} salary entry.`);
    }
};


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this salary record?")) return;
        try {
            await axios.get(`${admin_backend_domain_name}api/admin/deleteSalary/${id}`, {
              withCredentials:true
            });
            setSalaries(salaries.filter(item => item.id !== id));
        } catch (error) {
            setError("Failed to delete salary record.");
        }
    };





    const LoadingIndicator = () => (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center p-6 rounded-lg" style={{backgroundColor: theme.white}}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 mx-auto mb-4" style={{ borderColor: theme.lightGray, borderTopColor: theme.primary }}></div>
                <p className="text-lg font-medium" style={{ color: theme.dark }}>Loading salary data...</p>
            </div>
        </div>
    );
    
    const EmptyState = () => (
        <div className="p-12 border rounded-xl text-center shadow-inner mt-8" style={{ backgroundColor: theme.white, borderColor: theme.lightGray, }}>
            <div className="mx-auto mb-4 p-3 rounded-full inline-block" style={{backgroundColor: theme.primary + '10'}}><FiDollarSign size={32} style={{ color: theme.primary }} /></div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.dark }}>Salary List for {currentPayMonthDisplay} is Not Yet Created</h3>
            <p className="mb-6" style={{ color: theme.light }}>Generate the default payroll entries for all staff to begin the payment process.</p>
            
            <button 
                onClick={handleCreateMonthlyList} 
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: theme.accent, color: theme.white, boxShadow: `0 4px 6px -1px ${theme.accent}30`, margin: '0 auto' }}>
                {isGenerating ? (
                    <>
                        <FiLoader size={18} className="animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <FiZap size={18} />
                        Generate {currentPayMonthDisplay} Salary List
                    </>
                )}
            </button>
            
            <button onClick={handleAddClick} className="mt-4 text-sm font-medium" style={{ color: theme.primary }}>
                Or, manually add a single entry
            </button>
        </div>
    );

    useEffect(()=> {
       fetchData()   
    }, [])
    return (
        <div className="mb-12">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: theme.dark }}>Salary Management 💰</h1>
                    <p className="text-sm" style={{ color: theme.light }}>Manage staff salaries, bonuses, and deductions by month.</p>
                </div>
                {!isLoading && isMonthlyListGenerated && (
                    <button onClick={handleAddClick} className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
                        style={{ backgroundColor: theme.primary, color: theme.white, boxShadow: `0 4px 6px -1px ${theme.primary}30`, }}>
                        <FiPlus size={16} />
                        Add Salary Entry
                    </button>
                )}
            </div>

            {isLoading ? (
                <LoadingIndicator />
            ) : error ? (
                <div className="p-8 border text-center rounded-lg mt-8" style={{ backgroundColor: theme.red + '10', borderColor: theme.red }}>
                    <p className="font-medium" style={{ color: theme.red }}>🚨 Error: {error}</p>
                </div>
            ) : !isMonthlyListGenerated ? (
                <EmptyState />
            ) : (
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: theme.white, borderLeft: `4px solid ${theme.primary}`, }}>
                            <p style={{ color: theme.light }} className="text-sm mb-1">Total Monthly Base Payroll</p>
                            <p className="text-2xl font-bold" style={{ color: theme.dark }}>{formatCurrency(totalPayroll)}</p>
                        </div>
                        <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: theme.white, borderLeft: `4px solid ${theme.accent}`, }}>
                            <p style={{ color: theme.light }} className="text-sm mb-1">Entries Paid</p>
                            <p className="text-2xl font-bold" style={{ color: theme.dark }}>{paidCount} / {salaries.length}</p>
                        </div>
                        <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: theme.white, borderLeft: `4px solid ${theme.feeAccent}`, }}>
                            <p style={{ color: theme.light }} className="text-sm mb-1">Entries Pending (Net Salary $0.00)</p>
                            <p className="text-2xl font-bold" style={{ color: theme.dark }}>{pendingCount}</p>
                        </div>
                    </div>

                    <hr style={{borderColor: theme.lightGray}} className="mb-6"/>

                    <h2 className="text-2xl font-semibold mb-6" style={{color: theme.dark}}>Salary Records for {currentPayMonthDisplay}</h2>
           <div
  className="overflow-x-auto border rounded-xl shadow-lg"
  style={{ backgroundColor: theme.white, borderColor: theme.lightGray }}
>
  <table className="w-full min-w-[900px]">
    <thead>
      <tr
        style={{
          backgroundColor: theme.primary + "15",
          borderBottom: `2px solid ${theme.primary}50`,
        }}
      >
        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: theme.dark }}>Employee</th>
        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: theme.dark }}>Username</th>
        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: theme.dark }}>Role</th>
        <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: theme.dark }}>Pay Month</th>
        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: theme.dark }}>Monthly Salary</th>
        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: theme.dark }}>Bonus</th>
        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: theme.dark }}>Deductions</th>
        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: theme.dark }}>Net Salary</th>
        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: theme.dark }}>Remarks</th>
        <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: theme.dark }}>Actions</th>
      </tr>
    </thead>

    <tbody>
      {salaries.map((salary) => (
        <tr
          key={salary.id}
          className="border-b transition-all duration-200 hover:bg-opacity-50"
          style={{ borderBottomColor: theme.lightGray }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.background; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <td className="px-6 py-4">
            <p className="font-medium" style={{ color: theme.dark }}>
              {salary.user_id}
            </p>
          </td>

          <td className="px-6 py-4">
            <p className="text-sm" style={{ color: theme.light }}>
              {salary.username}
            </p>
          </td>

          <td className="px-6 py-4">
            <p className="text-sm" style={{ color: theme.light }}>
              {salary.userType}
            </p>
          </td>

          <td className="px-6 py-4 text-center">
            <span
              className="flex items-center justify-center gap-1 text-sm font-medium"
              style={{ color: theme.dark }}
            >
              <FiCalendar size={14} style={{ color: theme.primary }} />
              {salary.pay_month}
            </span>
          </td>

          <td className="px-6 py-4 text-right">
            <p className="font-medium" style={{ color: theme.primary }}>
              {formatCurrency(salary.monthly_salary)}
            </p>
          </td>

          <td className="px-6 py-4 text-right">
            <p className="font-medium" style={{ color: theme.dark }}>
              {formatCurrency(salary.bonus)}
            </p>
          </td>

          <td className="px-6 py-4 text-right">
            <p className="font-medium" style={{ color: theme.red }}>
              {formatCurrency(salary.deductions)}
            </p>
          </td>

          <td className="px-6 py-4 text-right">
            <p className="font-extrabold text-lg" style={{ color: theme.accent }}>
              {formatCurrency(salary.net_salary)}
            </p>
          </td>

          <td className="px-6 py-4">
            <p className="text-sm" style={{ color: theme.dark }}>
              {salary.remarks || "-"}
            </p>
          </td>

          <td className="px-6 py-4">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleEditClick(salary)}
                title="Edit Salary Entry"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: theme.secondary + "20", color: theme.secondary }}
              >
                <FiEdit size={16} />
              </button>

              <button
                onClick={() => handleDelete(salary.id)}
                title="Delete Salary Record"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: theme.red + "20", color: theme.red }}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

                </section>
            )}

            {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      onClick={handleCancel}
    ></div>

    <div
      className="w-full max-w-2xl p-6 rounded-xl shadow-2xl relative"
      style={{
        backgroundColor: theme.white,
        border: `1px solid ${theme.lightGray}`,
        zIndex: 60,
      }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center mb-6 border-b pb-3"
        style={{ borderColor: theme.lightGray }}
      >
        <h2 className="text-2xl font-semibold" style={{ color: theme.dark }}>
          {editingId ? "Edit Salary Entry" : "Add New Salary Entry"}
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 rounded-full transition-all duration-200 hover:bg-red-50"
          style={{ color: theme.light }}
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Employee Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
            Employee Name
          </label>
          <input
            value={formData.username}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.lightGray,
              color: theme.dark,
            }}
          />
        </div>

        {/* Pay Month & Salary (disabled) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Pay Month
            </label>
            <input
              
              value={formData.pay_month}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
              style={{
                borderColor: theme.lightGray,
                color: theme.dark,
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Monthly Salary (Base)
            </label>
            <input
              type="number"
              value={formData.monthly_salary}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
              style={{
                borderColor: theme.lightGray,
                color: theme.dark,
              }}
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Bonus (+)
            </label>
            <input
              type="number"
              value={formData.bonus}
              min="0"
              onChange={(e) => handleChange("bonus", Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
              style={{ backgroundColor: theme.background, borderColor: theme.lightGray, color: theme.dark }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
              Deductions (-)
            </label>
            <input
              type="number"
              value={formData.deductions}
              min="0"
              onChange={(e) => handleChange("deductions", Number(e.target.value))}
              className="w-full p-3 border rounded-lg"
              style={{ backgroundColor: theme.background, borderColor: theme.lightGray, color: theme.dark }}
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.dark }}>
            Remarks
          </label>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            rows={2}
            className="w-full p-3 border rounded-lg"
            style={{ backgroundColor: theme.background, borderColor: theme.lightGray, color: theme.dark }}
          />
        </div>

        {/* Net Salary Display */}
        <div
          className="p-4 rounded-lg flex justify-between items-center mt-4"
          style={{
            backgroundColor: theme.accent + "10",
            border: `1px solid ${theme.accent}50`,
          }}
        >
          <p className="text-lg font-medium" style={{ color: theme.dark }}>
            Calculated Net Salary:
          </p>
          <p className="text-3xl font-extrabold" style={{ color: theme.accent }}>
            {formatCurrency(calculateNetSalary(formData.monthly_salary, formData.bonus, formData.deductions).toFixed(2))}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 justify-end">
          <button
            onClick={handleCancel}
            className="px-5 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-gray-300"
            style={{ backgroundColor: theme.lightGray, color: theme.dark }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!formData.user_id}
            className="flex items-center gap-2 px-5 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
              boxShadow: `0 4px 6px -1px ${theme.primary}30`,
            }}
          >
            <FiSave size={16} />
            {editingId ? "Update Entry" : "Add Entry"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

            <FeesManagement />
        </div>
    );
}

export default SalaryManagement;









 const ModalForm = ({ editingStudent, newPaymentAmount, setNewPaymentAmount, setShowModal, handleSavePayment }) => {

       return(
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="w-full max-w-xl p-8 rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 bg-white z-50 border border-gray-200">
                
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Record Payment - {editingStudent?.name}</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 rounded-full transition-all duration-200 text-gray-500 hover:bg-red-100"><FiX size={24} /></button>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border border-dashed ${editingStudent?.remaining_fee > 0 ? 'border-red-500' : 'border-emerald-500'}`}>
                            <p className={`text-sm font-medium ${editingStudent?.remaining_fee > 0 ? 'text-red-500' : 'text-emerald-500'}`}>Remaining Balance</p>
                            <p className={`text-3xl font-extrabold mt-1 ${editingStudent?.remaining_fee > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatCurrency(editingStudent?.remaining_fee || 0)}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-dashed border-gray-300">
                            <p className="text-sm font-medium text-gray-500">Total Fee (Assumed)</p>
                            <p className="text-3xl font-extrabold mt-1 text-gray-800">{formatCurrency(editingStudent?.annual_fee || 0)}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-base font-semibold mb-2 text-gray-800">Payment Amount</label>
                        <input type="number" value={newPaymentAmount} onChange={(e) => setNewPaymentAmount(e.target.value)}
                            placeholder={`Max: ${formatCurrency(Math.max(0, editingStudent?.remaining_fee || 0))}`} 
                            className="w-full p-4 border rounded-xl focus:ring-4 focus:ring-indigo-200 bg-gray-50 border-gray-300 text-gray-800 text-xl outline-none transition-shadow" 
                        />
                    </div>

                    <div className="flex gap-3 pt-4 justify-end">
                        <button onClick={() => setShowModal(false)} className="px-6 py-3 text-base font-medium rounded-xl transition-all duration-200 border border-gray-300 text-gray-800 bg-white hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSavePayment} disabled={!newPaymentAmount || parseFloat(newPaymentAmount) <= 0} 
                            className="flex items-center gap-2 px-6 py-3 text-base font-medium rounded-xl transition-all duration-200 bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none">
                            <FiSave size={18} />
                            Record Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
 )
};

function FeesManagement() {
    const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME   
    const [isLoading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [newPaymentAmount, setNewPaymentAmount] = useState("");


    const [studentFeesData, setStudentFeesData] = useState([]);
    const totalRemaining = studentFeesData.reduce((sum, s) => sum + s.remaining_fee, 0);
    const accountsWithBalance = studentFeesData.filter(s => s.remaining_fee > 0).length;
    const [editingStudent, setEditingStudent] = useState(null);
    const handleRecordPaymentClick = (student) => {
        setEditingStudent(student);
        setNewPaymentAmount("");
        setShowModal(true);
    }; 
    const handleSavePayment = async() => {
        
        const payment = parseFloat(newPaymentAmount);
        if (isNaN(payment) || payment <= 0 || !editingStudent) return;

        const newRemainingFees = editingStudent.remaining_fee - payment;
        const response =await axios.post(`${backend_domain_name}api/user/addUserFee`, { id: editingStudent.id, newRemainingFees}, {
          withCredentials:true
        });
        if(response.status == 200){
             fetchData()
        }else{
            alert("Failed modifying student remaining fees")
        }

        setShowModal(false);
    };

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white" 
             style={{ borderLeft: `4px solid ${colorClass.includes('indigo') ? '#4f46e5' : colorClass.includes('red') ? '#ef4444' : '#1f2937'}` }}> 
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">{title}</p>
                <div className={`p-2 rounded-full ${colorClass.replace('text-', 'bg-')} bg-opacity-10`}>
                    <Icon size={20} className={colorClass} />
                </div>
            </div>
            <p className="text-4xl font-extrabold mt-3 text-gray-800">{value}</p>
        </div>
    );


    
    const LoadingIndicator = () => (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center p-6 rounded-lg bg-white shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 mx-auto mb-4 border-gray-200 border-t-indigo-600"></div>
                <p className="text-lg font-medium text-gray-800">Loading outstanding fee data...</p>
            </div>
        </div>
    );
    
    const EmptyState = () => (
        <div className="p-12 border border-gray-200 rounded-xl text-center shadow-md mt-8 bg-white">
            <div className="mx-auto mb-4 p-4 rounded-full inline-block bg-emerald-500/10"><FiCheckCircle size={36} className="text-emerald-500" /></div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">All Student Fees Are Settled</h3>
            <p className="mb-6 text-gray-500">The current list of students with outstanding fees is empty.</p>
        </div>
    );

    const fetchData = async()=> {
        setLoading(true)
        const response = await axios.get(`${backend_domain_name}api/user/remainingFees`, {
          withCredentials:true
        });
        console.log(response.status);
        setLoading(false);
        if(response.status == 200){
            setStudentFeesData(response.data.data)
            console.log(studentFeesData)
        }else{
             console.log("Error Occured fetching users")
        }

    }
    useEffect(()=> {
        fetchData();

    }, [])
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-5xl font-extrabold mb-1 text-gray-800">Fees Management</h1>
                    <p className="text-lg text-gray-500">Overview of student accounts with an outstanding balance.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 border border-red-500 bg-red-50 rounded-xl mb-6 shadow-md">
                    <p className="font-medium text-red-700">🚨 Connection/API Error: {error}</p>
                </div>
            )}
            
            {isLoading ? (
                <LoadingIndicator />
            ) : studentFeesData.length === 0 ? (
                <EmptyState />
            ) : (
                <section>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <StatCard 
                            title="Accounts with Balance" 
                            value={accountsWithBalance} 
                            icon={FiAlertTriangle} 
                            colorClass="text-red-500" 
                        />
                        <StatCard 
                            title="Total Outstanding Fees" 
                            value={formatCurrency(totalRemaining)} 
                            icon={FiTrendingUp} 
                            colorClass="text-indigo-600" 
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-10">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Pending Student Payments</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700">Student Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700">Class / Enrollment</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-700">Total Fee (Assumed)</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-700">Paid Amount</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-700">Remaining Balance</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentFeesData.map((student, index) => (
                                        <tr key={student.id} 
                                            className="border-b transition-all duration-200 last:border-b-0 hover:bg-gray-50" 
                                            style={{ borderBottomColor: index === studentFeesData.length - 1 ? 'transparent' : '#E5E7EB', }}
                                        >
                                            
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-medium text-gray-800">{student.name}</p>
                                                <p className="text-xs mt-1 text-gray-500">ID: {student.id}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><p className="text-sm text-gray-500">{student.class}</p></td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap"><p className="font-medium text-gray-800">{formatCurrency(student.annual_fee)}</p></td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap"><p className="font-medium text-emerald-600">{formatCurrency(student.annual_fee - student.remaining_fee)}</p></td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <p className={`font-extrabold text-lg ${student.remaining_fee > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                     {formatCurrency(student.remaining_fee)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${student.remaining_fee <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {student.remaining_fee <= 0 ? <FiCheckCircle size={14} /> : <FiAlertTriangle size={14} />}
                                                    {student.remaining_fee <= 0 ? 'Settled' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2 justify-center">
                                                    {student.remaining_fee > 0 && (
                                                        <button onClick={() => handleRecordPaymentClick(student)} title="Record New Payment" 
                                                            className="p-3 rounded-full transition-all duration-200 bg-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-700">
                                                            <FiDollarSign size={18} />
                                                        </button>
                                                    )}
                                                    {/* <button title="Send Fee Reminder" 
                                                        className="p-3 rounded-full transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300">
                                                        <FiMail size={18} />
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

         {showModal && (
    <ModalForm
        editingStudent={editingStudent}
        newPaymentAmount={newPaymentAmount}
        setNewPaymentAmount={setNewPaymentAmount}
        setShowModal={setShowModal}
        handleSavePayment={handleSavePayment}
    />
)}

        </div>
    );
}

