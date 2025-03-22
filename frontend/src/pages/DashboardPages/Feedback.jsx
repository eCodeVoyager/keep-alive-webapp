import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Star, Send, MessageSquare, Smile, Frown, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Shared/Button";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import FeedbackService from "../../services/feedbackService";

const feedbackValidationSchema = Yup.object().shape({
  rating: Yup.number().required("Please select a rating"),
  comment: Yup.string().required("Please provide some feedback"),
});

const Feedback = () => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState(null);

  const feedbackTypes = [
    { id: "suggestion", label: "Suggestion", icon: Smile },
    { id: "bug", label: "Bug Report", icon: Frown },
    { id: "general", label: "General Feedback", icon: MessageSquare },
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsAnimating(true);

    try {
      await FeedbackService.create({
        rating: values.rating,
        comment: values.comment,
        feedbackType: selectedFeedbackType,
      });

      // Show success modal instead of toast
      setShowSuccessModal(true);
      resetForm();
      setSelectedFeedbackType(null);
    } catch (error) {
      toast.error("Error submitting feedback");
    } finally {
      setSubmitting(false);
      setIsAnimating(false);
    }
  };

  const getRatingDescription = (rating) => {
    const descriptions = [
      "Please select a rating",
      "Very Dissatisfied",
      "Dissatisfied",
      "Neutral",
      "Satisfied",
      "Very Satisfied",
    ];
    return descriptions[rating] || descriptions[0];
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto pb-10"
      >
        <div className="mb-8">
          <h2 className="text-3xl text-white font-bold mb-3">
            Share Your Feedback
          </h2>
          <p className="text-gray-400">
            Your insights help us improve Keep-Alive and deliver a better
            experience for all users. We appreciate your time and thoughts!
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
          <Formik
            initialValues={{ rating: 0, comment: "" }}
            validationSchema={feedbackValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-8">
                {/* Rating Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-700/50 p-6 rounded-xl"
                >
                  <h3 className="text-white text-xl font-semibold mb-4">
                    How would you rate your experience?
                  </h3>

                  <div className="flex flex-col items-center">
                    <div className="flex mb-3 space-x-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFieldValue("rating", star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="duration-200 focus:outline-none transition-all"
                        >
                          <Star
                            className={`h-10 w-10 ${
                              star <= (hoveredStar || values.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-500"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <div className="text-center text-lg font-medium min-h-[28px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={hoveredStar || values.rating}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className={`${
                            (hoveredStar || values.rating) > 3
                              ? "text-green-400"
                              : (hoveredStar || values.rating) > 0
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          {getRatingDescription(hoveredStar || values.rating)}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    {errors.rating && touched.rating && (
                      <div className="text-red-500 text-sm mt-2">
                        {errors.rating}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Feedback Type Selection */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-700/50 p-6 rounded-xl"
                >
                  <h3 className="text-white text-xl font-semibold mb-4">
                    What type of feedback do you have?
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {feedbackTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedFeedbackType(type.id)}
                        className={`p-4 rounded-xl flex flex-col items-center justify-center h-24 transition-colors duration-200 ${
                          selectedFeedbackType === type.id
                            ? "bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        <type.icon
                          className={`h-7 w-7 mb-2 ${
                            selectedFeedbackType === type.id
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`${
                            selectedFeedbackType === type.id
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {type.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Comment Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-700/50 p-6 rounded-xl"
                >
                  <h3 className="text-white text-xl font-semibold mb-4">
                    Tell us more
                  </h3>

                  <div className="mb-6">
                    <label
                      htmlFor="comment"
                      className="text-gray-300 block mb-2"
                    >
                      Your feedback
                    </label>
                    <Field
                      as="textarea"
                      id="comment"
                      name="comment"
                      rows="5"
                      className="bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500 px-4 py-3"
                      placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
                    />
                    {errors.comment && touched.comment && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.comment}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end"
                >
                  <Button
                    type="submit"
                    icon={<Send className="h-5 w-5 mr-2" />}
                    isLoading={isSubmitting}
                    disabled={!values.rating || !values.comment}
                    className="px-8"
                  >
                    Submit Feedback
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex bg-black/50 justify-center p-4 backdrop-blur-sm fixed inset-0 items-center z-50"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 absolute hover:text-white right-4 top-4"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col text-center items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                  className="bg-green-500/20 p-4 rounded-full mb-6"
                >
                  <MessageSquare className="h-12 text-green-400 w-12" />
                </motion.div>

                <h3 className="text-2xl text-white font-bold mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-300 mb-6">
                  Your feedback has been submitted successfully. We appreciate
                  your input and will use it to improve our service.
                </p>

                <Button
                  onClick={() => setShowSuccessModal(false)}
                  variant="primary"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Feedback;
