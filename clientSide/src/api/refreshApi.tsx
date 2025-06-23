import axios from "axios";

const refreshApi = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/token/refresh",
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
