import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Star, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "../components/Shared/Button";
import DashboardLayout from "../components/Layouts/DashboardLayout";

const feedbackValidationSchema = Yup.object().shape({
  rating: Yup.number().required("Please select a rating"),
  comment: Yup.string().required("Please provide some feedback"),
});

const Feedback = () => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // TODO: Implement API call to submit feedback
      console.log("Submitting feedback:", values);
      toast.success("Feedback submitted successfully");
      resetForm();
    } catch (error) {
      toast.error("Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Provide Feedback</h2>

        <div className="bg-gray-800 rounded-lg p-10 shadow-lg">
          <Formik
            initialValues={{ rating: 0, comment: "" }}
            validationSchema={feedbackValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-white mb-2">
                    Rate your experience
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFieldValue("rating", star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredStar || values.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && touched.rating && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.rating}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="comment" className="block text-white mb-2">
                    Your feedback
                  </label>
                  <Field
                    as="textarea"
                    id="comment"
                    name="comment"
                    rows="6"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell us about your experience..."
                  />
                  {errors.comment && touched.comment && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.comment}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  icon={<Send className="h-5 w-5 mr-2" />}
                  isLoading={isSubmitting}
                  fullWidth
                >
                  Submit Feedback
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Feedback;
