"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSave,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function FAQ() {
  const backend_domain_name = import.meta.env.VITE_BACKEND_DOMAIN_NAME;
  
  // State for FAQ data and loading status
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Theme colors matching admin dashboard
  const theme = {
    primary: "#3FA7A3",
    secondary: "#6C63FF",
    accent: "#2ECC71",
    dark: "#1E293B",
    light: "#64748B",
    background: "#F8FAFC",
    white: "#FFFFFF",
    lightGray: "#E2E8F0",
    red: "#E74C3C",
    orange: "#F39C12",
  };

  // Add new FAQ (Client-side simulation)
  const addFaq = async() => {
    if (newQuestion.trim() && newAnswer.trim()) {

      const formData = new FormData();
      console.log(newQuestion)
      const body = {
        question: newQuestion,
        answer: newAnswer
      }

 
      setNewQuestion("");
      setNewAnswer("");
      setShowAddForm(false);
      const response = await axios.post(`${backend_domain_name}api/faq/createFaq`, body, {withCredentials:true});
      if(response.data.status == true){
          const newFaq = {
             id: Date.now(),
             question: newQuestion,
             answer: newAnswer,
             expanded: false,
              };
          setFaqs([newFaq, ...faqs]);
      }
    }
  };

  // Delete FAQ (Client-side simulation)
  const deleteFaq = async(id) => {
   
    const response = await axios.get(`${backend_domain_name}api/faq/deleteFaq/${id}`, {withCredentials:true});
    if(response.status == 200){
      setFaqs(faqs.filter((faq) => faq.id !== id));
    }
  };

  // Start editing
  const startEdit = (faq) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  // Save edit (Client-side simulation)
  const saveEdit = async() => {

    const body = {
      id: editingId,
      question: editQuestion,
      answer: editAnswer,
    }
    const response = await axios.post(`${backend_domain_name}api/faq/updateFaq`, body, {
      withCredentials:true
    });
    if(response.status == 200){
          setFaqs(
      faqs.map((faq) =>
        faq.id === editingId
          ? { ...faq, question: editQuestion, answer: editAnswer }
          : faq
      )
           );
          setEditingId(null);
          setEditQuestion("");
          setEditAnswer("");
    }

  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  // Toggle FAQ expansion
  const toggleExpanded = (id) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id 
          ? { ...faq, expanded: !faq.expanded } 
          : faq
      )
    );
  };
  const navigate = useNavigate();
  // Fetch data function with loading state management
  const fetchData = async ()=> {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${backend_domain_name}api/faq/getFaqs`);
      
      const initializedFaqs = response.data.map(faq => ({
        ...faq,
        expanded: false, 
      }));

      setFaqs(initializedFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      if(error.response.status == 401){
        Navigate('/login')
      }
      setFaqs([
        { id: 101, question: "What are your office hours?", answer: "We are open Monday to Friday, 9:00 AM to 5:00 PM.", expanded: false },
        { id: 102, question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login screen and follow the instructions sent to your email.", expanded: false },
      ]);
    } finally {
      setIsLoading(false); // End loading
    }
  }

  useEffect(()=> {
    fetchData();
  }, [])

  // --- RENDERING COMPONENTS ---

  const LoadingIndicator = () => (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.primary }}></div>
      <p className="text-lg" style={{ color: theme.dark }}>Loading FAQs...</p>
    </div>
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: theme.background,
      }}
    >
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.dark }}>
            Frequently Asked Questions
          </h1>
          <p className="text-sm" style={{ color: theme.light }}>
            Manage and organize your FAQs with ease
          </p>
        </div>
        {!showAddForm && !isLoading && (
          <button
            onClick={() => setShowAddForm(true)}
            className="py-3 px-6 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
            style={{
              backgroundColor: theme.primary,
              color: theme.white,
            }}
          >
            <FiPlus size={18} />
            Add FAQ
          </button>
        )}
      </div>

      {/* Conditional Rendering for Add Form or Loading/FAQ List */}
      {isLoading ? (
        // ⭐️ FIX: Apply centering styles when loading is true to ensure the spinner is vertically centered.
        // We use flex and min-h-[50vh] to center it relative to the remaining space.
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          {showAddForm && (
            <div
              className="mb-8 p-6 border shadow-sm"
              style={{
                backgroundColor: theme.white,
                borderColor: theme.lightGray,
                borderLeft: `4px solid ${theme.primary}`,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4 flex items-center gap-2"
                style={{ color: theme.dark }}
              >
                <FiPlus size={20} style={{ color: theme.primary }} />
                Add New FAQ
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.dark }}
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter FAQ question..."
                    className="w-full p-3 border outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.lightGray,
                      backgroundColor: theme.background,
                      color: theme.dark,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.dark }}
                  >
                    Answer
                  </label>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Enter FAQ answer..."
                    rows="4"
                    className="w-full p-3 border outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                    style={{
                      borderColor: theme.lightGray,
                      backgroundColor: theme.background,
                      color: theme.dark,
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={addFaq}
                    disabled={!newQuestion.trim() || !newAnswer.trim()}
                    className="flex-1 py-3 px-4 font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor:
                        newQuestion.trim() && newAnswer.trim()
                          ? theme.primary
                          : theme.lightGray,
                      color:
                        newQuestion.trim() && newAnswer.trim()
                          ? theme.white
                          : theme.light,
                      cursor:
                        newQuestion.trim() && newAnswer.trim()
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    <FiPlus size={16} />
                    Add FAQ
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewQuestion("");
                      setNewAnswer("");
                    }}
                    className="px-6 py-3 font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: theme.lightGray,
                      color: theme.light,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div className="space-y-4">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ color: theme.dark }}
            >
              All FAQs ({faqs.length})
            </h2>
            
            {faqs.length === 0 ? (
              <div
                className="p-8 border text-center"
                style={{
                  backgroundColor: theme.white,
                  borderColor: theme.lightGray,
                }}
              >
                <p style={{ color: theme.light }}>
                  No FAQs yet. Add one to get started!
                </p>
              </div>
            ) : (
              faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border shadow-sm overflow-hidden transition-all duration-200"
                  style={{
                    backgroundColor: theme.white,
                    borderColor: theme.lightGray,
                  }}
                >
                  {/* Question Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      // Only allow toggling if not in edit mode
                      if (editingId !== faq.id) {
                        toggleExpanded(faq.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {editingId === faq.id ? (
                          <input
                            type="text"
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            className="w-full p-2 border outline-none mb-3"
                            style={{
                              borderColor: theme.lightGray,
                              backgroundColor: theme.background,
                              color: theme.dark,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: theme.dark }}
                          >
                            {faq.question}
                          </h3>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div
                        className="flex items-center gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingId === faq.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: theme.accent + "20",
                                color: theme.accent,
                              }}
                              title="Save"
                            >
                              <FiSave size={16} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: theme.light + "20",
                                color: theme.light,
                              }}
                              title="Cancel"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(faq)}
                              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: theme.primary + "20",
                                color: theme.primary,
                              }}
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteFaq(faq.id)}
                              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: theme.red + "20",
                                color: theme.red,
                              }}
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                        <button
                          className="p-2 transition-all duration-200"
                          style={{
                            color: theme.primary,
                            transform: faq.expanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                          onClick={() => {
                              if (editingId !== faq.id) {
                                  toggleExpanded(faq.id);
                              }
                          }}
                        >
                          <FiChevronDown size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Answer Section */}
                  {/* Only render if expanded is true */}
                  {faq.expanded && (
                    <div
                      className="px-6 py-4 border-t"
                      style={{ borderColor: theme.lightGray }}
                    >
                      {editingId === faq.id ? (
                        <textarea
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full p-3 border outline-none resize-none"
                          rows="4"
                          style={{
                            borderColor: theme.lightGray,
                            backgroundColor: theme.background,
                            color: theme.dark,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <p style={{ color: theme.dark, lineHeight: "1.6" }}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}