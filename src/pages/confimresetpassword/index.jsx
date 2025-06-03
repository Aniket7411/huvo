import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HttpClient } from "../../server/client/http";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handlePasswordResetSubmit = async (event) => {

        console.log(newPassword)
        console.log(confirmPassword)

        event.preventDefault();
        setFormError("");
        setFormSuccess("");

        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setFormError("Both fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setFormError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Simulated API call
            const response = HttpClient.post()
             

            if (response.ok) {
                setFormSuccess("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login"); // Redirect to login page
                }, 2000);
            } else {
                const errorResponse = await response.json();
                setFormError(errorResponse.message || "Failed to reset password. Try again.");
            }
        } catch (error) {
            setFormError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reset-password-container flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handlePasswordResetSubmit}
                className="reset-password-form bg-white shadow-md rounded-lg p-6 w-full max-w-md"
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Reset Your Password</h2>

                {/* New Password Field */}
                <label htmlFor="new-password" className="block text-gray-700 font-medium mb-2">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formError && !newPassword ? "border-red-500" : "border-gray-300"
                            }`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-gray-600"
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Confirm Password Field */}
                <label htmlFor="confirm-password" className="block text-gray-700 font-medium mt-4 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formError && !confirmPassword ? "border-red-500" : "border-gray-300"
                            }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-600"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Error/Success Messages */}
                {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
                {formSuccess && <p className="text-green-500 text-sm mt-2">{formSuccess}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full mt-6 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
