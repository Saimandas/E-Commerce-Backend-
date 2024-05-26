class ApiError extends Error{

    constructor(statusCode,message="something went wrong",error){
        super(message)
        this.message= message;
        this.error= error;
        this.statusCode=statusCode,
        this.succes=false
    }
}

export {ApiError}