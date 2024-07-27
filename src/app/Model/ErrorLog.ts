export class ErrorLog{

    /**
     *
     */
    constructor(public statusCode: number,
        public errorMessage: string,
        public dateTime: Date
    ) {
        
        
    }

}