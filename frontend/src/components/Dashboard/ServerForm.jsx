import { Plus } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const ServerForm = ({ addServer, isLoading }) => {
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
      {({ errors, touched }) => (
        <Form className="mb-8 flex gap-4">
          <div className="flex-grow">
            <Field
              name="serverUrl"
              type="text"
              placeholder="Enter server URL"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
            {errors.serverUrl && touched.serverUrl && (
              <div className="text-red-500 text-sm mt-1">
                {errors.serverUrl}
              </div>
            )}
          </div>
          <Field
            as="select"
            name="interval"
            className="max-h-10 px-2 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none border-gray-800 border-r-8"
          >
            <option value="5m">5m</option>
            <option value="10m">10m</option>
            <option value="15m">15m</option>
            <option value="20m">20m</option>
            <option value="30m">30m</option>
          </Field>
          <button
            type="submit"
            disabled={isLoading}
            className="max-h-10 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
          >
            <Plus className="mr-2" /> Add Server
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ServerForm;
