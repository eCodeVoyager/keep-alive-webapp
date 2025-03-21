import { Plus, Loader, Globe, Clock, Search } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "../Shared/Button";

const ServerForm = ({ addServer, isLoading, testUrl, isTestingUrl }) => {
  const initialValues = {
    serverUrl: "",
    interval: "10m",
  };

  const validationSchema = Yup.object({
    serverUrl: Yup.string()
      .url("Invalid URL")
      .required("Server URL is required"),
    interval: Yup.string().required("Interval is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    addServer(values.serverUrl, values.interval);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* URL Input Field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              name="serverUrl"
              type="text"
              placeholder="https://yourdomain.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.serverUrl && touched.serverUrl && (
              <div className="text-red-500 text-sm mt-1 absolute">
                {errors.serverUrl}
              </div>
            )}
          </div>

          {/* Interval Selection */}
          <div className="relative min-w-[120px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              as="select"
              name="interval"
              className="w-full pl-10 pr-8 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
            >
              <option value="5m">5 min</option>
              <option value="10m">10 min</option>
              <option value="15m">15 min</option>
              <option value="20m">20 min</option>
              <option value="30m">30 min</option>
            </Field>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Test Button */}
          {testUrl && (
            <div>
              <Button
                type="button"
                variant="secondary"
                isLoading={isTestingUrl}
                icon={<Search className="h-5 w-5" />}
                onClick={() => testUrl(values.serverUrl)}
                disabled={!values.serverUrl || errors.serverUrl}
                className="w-full md:w-auto"
              >
                Test
              </Button>
            </div>
          )}

          {/* Add Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={<Plus className="h-5 w-5" />}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Add Website
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ServerForm;
