import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { id } = useParams(); // Extracting user ID from URL
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess(false);

            // API call to reset password
            debugger
            const response = await HttpClient.post(`/user/ChangePassword`, {
                token: id, newPassword: password
            });

            if (response.success === true) {
                toast.success('updated password successfully')
                setSuccess(true);
                setTimeout(() => navigate("/login"), 2000); // Redirect to login after success

            }
        } catch (err) {
            setError("Something went wrong. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Reset Password</h2>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                {success && <p className="text-green-500 text-center mb-3">Password reset successfully!</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-600 font-medium">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-gray-600 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
