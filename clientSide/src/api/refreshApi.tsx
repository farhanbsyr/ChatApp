import axios from "axios";

const refreshApi = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/token/refresh`,
      null,
      {
        withCredentials: true,
      }
    );

    console.log("refresh token sukses");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export default refreshApi;
