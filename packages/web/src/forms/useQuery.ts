import { useState } from "react";

export type ManagedQuery<QueryT> = {
  loading: boolean;
  successMessage?: string;
  errorMessage?: string;
  submit: (query: QueryT) => Promise<void>;
};

export default function useQuery<QueryT, ResultsT>(
  fetchData: (query: QueryT) => Promise<ResultsT>,
  setResults: (results: ResultsT) => void)
  : ManagedQuery<QueryT> {

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  async function submit(newQuery: QueryT) {
    setLoading(true);
    try {
      const startTime = new Date().getTime();
      const results = await fetchData(newQuery);
      setSuccessMessage(`Query submitted successfully in ${new Date().getTime() - startTime} ms!`);
      setErrorMessage(undefined);
      setResults(results);
    } catch (error) {
      setSuccessMessage(undefined);
      setErrorMessage('Error submitting query: ' + error);
    }
    setLoading(false);
  }

  return {
    loading,
    successMessage,
    errorMessage,
    submit,
  };
}