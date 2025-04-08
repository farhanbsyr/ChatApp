package com.portofolio.talkify.utility;

public class ApiResponse<T> {

    private Boolean success;
    private String message;
    private T data;
    private Object error;

    public ApiResponse(Boolean success, String message, T data, Object error){
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Object getError() {
        return error;
    }

    public void setError(Object error) {
        this.error = error;
    }

    
}
