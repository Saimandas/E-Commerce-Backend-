import { Product } from "../modules/Product.model.js";

class ApiFeatures{
    constructor(querystr){
        this.querystr=querystr;
    }

    async search(query){
       const search= await Product.find({
            $text:{
                $search:query
            }
        })
        return search;
    }

    async filter(gt,lt){
         try {
            const filterQuery= {price:{
            }}
            if (gt) {
                filterQuery.price.$gt=gt;
            }
            if (lt) {
                filterQuery.price.$lt=lt;
            }
            const filter= await Product.find(filterQuery);
            console.log(filter);
    
            return filter
         } catch (error) {
            console.log(error.message);
         }
    }
}

export {ApiFeatures}