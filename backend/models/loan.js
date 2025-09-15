import mongoose from "mongoose";

const loanSchema=new mongoose.Schema({
    loanNumber:{type:String,required:true,unique:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    accountId:{type:mongoose.Schema.Types.ObjectId,ref:"BankAccount",required:true},
    amount:{type:Number,required:true},
    interestRate:{type:Number,required:true},
    termMonths:{type:Number,required:true},
    balanceRemaining:{type:Number,required:true},
    approved:{type:Boolean,default:false},
    approvedAt:{type:Date},
    approvedBy:{type:mongoose.Schema.Types.ObjectId,ref:"Admin"},
    createdAt:{type:Date,default:Date.now},
    repayments:[
        {
            repaymentId:{type:String,required:true},
            amount:{type:Number,required:true},
            date:{type:Date,default:Date.now},
        }
    ]
});

export default mongoose.model("loan",loanSchema)