import { useState, useEffect } from "react";
import NetworkHandler from "../utils/NetworkHandler";
import { showMessage } from "../utils/showMessage";

const useFetchData = (endpoint, initialData = [], dependencies = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
