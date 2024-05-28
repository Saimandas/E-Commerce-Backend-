class ApiResponse{
    constructor(message="succes",data){
        this.message=message,
        this.data=data,
        this.succes=true
    }
}

export {ApiResponse}