export class User{
    /**
     *
     */
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _expiresIn: Date
    ) {
        
    }

    
    get token() : string | null {
        if(!this._expiresIn || this._expiresIn < new Date()) 
            {
                return null;
            }
        return this._token;
    }
    
}